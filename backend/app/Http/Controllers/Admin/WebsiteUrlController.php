<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LoginUrlEndpoint;
use App\Enums\VideoCallType;
use App\Http\Controllers\Controller;
use App\Http\Requests\WebsiteUrlStoreRequest;
use App\Models\Category;
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
    public function index($categoryId = null, string $urlType = 'login'): JsonResponse
    {
        $category = $categoryId ? Category::find($categoryId) : Category::first();

        if (!$category) {
            return response()->json(['error' => 'Category not found'], Response::HTTP_NOT_FOUND);
        }

        $authUser = request()->user();

        $websiteUrlsQuery = WebsiteUrl::query()
            ->where('category_id', $category->id)
            ->whereHas('users', function ($query) use ($authUser) {
                $query->when($authUser->isUser, function ($query) use ($authUser) {
                    return $query->where('user_id', $authUser->team->id);
                })->when($authUser->isAdmin || $authUser->isSuperAdmin, function ($query) use ($authUser) {
                    return $query->where('user_id', $authUser->id);
                });
            });

        $websiteUrlsQuery->when($urlType === 'login', function ($query) {
            return $query->whereHas('urlTypes', function ($query) {
                $query->where('login_page', true);
            });
        })->when($urlType === 'video', function ($query) {
            return $query->whereHas('urlTypes', function ($query) {
                $query->where('video_calling', true);
            });
        });

        $websiteUrls = $websiteUrlsQuery->paginate(10);

        return response()->json($websiteUrls, Response::HTTP_OK);
    }


    public function store(WebsiteUrlStoreRequest $request): JsonResponse
    {
        Gate::authorize('create', WebsiteUrl::class);

        $data = $request->validated();

        $user = User::findOrFail($data['user']);
        $domain = Domain::findOrFail($data['domain']);

        $urls = [];
        $types = [];
        $urlTypes = $this->prepareUrlTypes($data['pages']);

        $categories = Category::whereIn('id', $data['categories'])->get();

        foreach ($categories as $category) {
            if ($urlTypes['login']) {
                $this->prepareLoginUrls($urls, $types, $domain, $category);
            }

            if ($urlTypes['video']) {
                $this->prepareVideoUrls($urls, $types, $domain, $category);
            }
        }

        $websiteUrls = $domain->websiteUrls()->createMany($urls);

        foreach ($websiteUrls as $key => $websiteUrl) {
            $websiteUrl->urlTypes()->create($types[$key]);
        }

        $user->urls()->sync($websiteUrls);

        return response()->json(['success' => 'Website URLs have been created successfully.'], Response::HTTP_CREATED);
    }

    private function prepareLoginUrls(array &$urls, array &$types, Domain $domain, Category $category): void
    {
        foreach (LoginUrlEndpoint::cases() as $case) {

            $caseName = Str::slug($case->value);

            $urls[] = [
                'category_id' => $category->id,
                'url' => "https://{$domain->name}/{$caseName}",
            ];

            $types[] = [
                'video_calling' => false,
                'login_page' => true,
            ];
        }
    }

    private function prepareVideoUrls(array &$urls, array &$types, Domain $domain, Category $category): void
    {
        $categoryName = Str::slug($category->full_name);

        foreach (VideoCallType::cases() as $case) {

            $caseName = Str::slug($case->value);

            $urls[] = [
                'category_id' => $category->id,
                'url' => "https://{$domain->name}/{$categoryName}/invite/{$caseName}",
            ];

            $types[] = [
                'video_calling' => true,
                'login_page' => false,
            ];
        }
    }

    protected function prepareUrlTypes(array $pages): array
    {
        $urlTypes = [
            'login' => false,
            'video' => false,
        ];

        foreach ($pages as $page) {
            if (Arr::has($urlTypes, $page)) {
                $urlTypes[$page] = true;
            }
        }

        return $urlTypes;
    }

    public function destroy(WebsiteUrl $websiteUrl): JsonResponse
    {
        Gate::authorize('delete', $websiteUrl);

        $websiteUrl->delete();

        return response()->json(['success' => 'Website Url has been deleted successfully.'], Response::HTTP_OK);
    }
}