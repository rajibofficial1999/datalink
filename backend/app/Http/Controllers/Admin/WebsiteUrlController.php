<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Category;
use App\Enums\LoginUrlEndpoint;
use App\Enums\Sites;
use App\Enums\VideoCallingTypes;
use App\Http\Controllers\Controller;
use App\Http\Requests\WebsiteUrlStoreRequest;
use App\Models\Domain;
use App\Models\User;
use App\Models\WebsiteUrl;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class WebsiteUrlController extends Controller
{
    public function index($site = null, string $category = null): JsonResponse
    {
        $site = $site ?? Sites::EROS_ADS->value;

        $category = $category ?? Category::LOGIN->value;

        $authUser = request()->user();

        $domainOwner = $authUser->isUser ? $authUser->team : $authUser;

        $domainsWithUrls = Domain::query()
            ->when($authUser->isAdmin || $authUser->isUser, function ($query) use ($domainOwner) {
                return $query->where('is_default', true)->orWhere('user_id', $domainOwner->id);
            })
            ->with(['websiteUrls' => function ($query) use ($category, $site) {
                return $query->where('site', $site)->where('category', $category);
            }])
            ->get();

        $websiteUrls = $domainsWithUrls->flatMap(function ($domain) {
            return $domain->websiteUrls;
        });

        return response()->json([
            'websiteUrls' => $websiteUrls,
            'sites' => Sites::cases()
        ], Response::HTTP_OK);
    }


    public function store(WebsiteUrlStoreRequest $request): JsonResponse
    {
        Gate::authorize('create', WebsiteUrl::class);

        $data = $request->validated();

        $user = User::findOrFail($data['user']);
        $domain = Domain::findOrFail($data['domain']);

        $urls = [];
        $categoriesStatus = $this->prepareCategories($data['categories']);

        $sites = $data['sites'];

        foreach ($sites as $site) {
            if ($categoriesStatus[Category::LOGIN->value]) {
                $urls[] = $this->prepareLoginUrls(
                    Category::LOGIN->value,
                    $domain,
                    $site
                );
            }

            if ($categoriesStatus[Category::VIDEO_CALLING->value]) {
                $urls[] = $this->prepareVideoUrls(
                    Category::VIDEO_CALLING->value,
                    $domain,
                    $site
                );
            }
        }

        return response()->json($urls, Response::HTTP_CREATED);

        // $websiteUrls = $domain->websiteUrls()->createMany($urls);

        return response()->json(['success' => 'Website URLs have been created successfully.'], Response::HTTP_CREATED);
        // return response()->json(['success' => 'Website URLs have been created successfully.'], Response::HTTP_CREATED);
    }

    private function prepareLoginUrls(string $category, Domain $domain, string $site): array
    {

        $items = [];
        foreach (LoginUrlEndpoint::cases() as $case) {

            $caseName = Str::slug($case->value);

            $items['login_url'][] = [
                'category' => $category,
                'site' => $site,
                'url' => "https://{$domain->name}/{$caseName}",
            ];
        }

        return $items;
    }

    private function prepareVideoUrls(string $category, Domain $domain, string $site): array
    {
        $categoryName = Str::slug($category);

        $items = [];
        foreach (VideoCallingTypes::cases() as $case) {

            $caseName = Str::slug($case->value);

            $items['video_calling_url'][] = [
                'category' => $category,
                'site' => $site,
                'url' => "https://{$domain->name}/{$categoryName}/invite/{$caseName}",
            ];

            return $items;
        }
    }

    protected function prepareCategories(array $categories): array
    {
        $pageItems = [
            Category::LOGIN->value => false,
            Category::VIDEO_CALLING->value => false,
        ];

        foreach ($categories as $category) {
            if (Arr::has($pageItems, $category)) {
                $pageItems[$category] = true;
            }
        }

        return $pageItems;
    }

    public function destroy(WebsiteUrl $websiteUrl): JsonResponse
    {
        Gate::authorize('delete', $websiteUrl);

        $websiteUrl->delete();

        return response()->json(['success' => 'Website Url has been deleted successfully.'], Response::HTTP_OK);
    }
}
