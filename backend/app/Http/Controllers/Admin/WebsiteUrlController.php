<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DomainStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\WebsiteUrlStoreRequest;
use App\Models\Category;
use App\Models\Domain;
use App\Models\WebsiteUrl;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class WebsiteUrlController extends Controller
{
    public function index($categoryId = null): JsonResponse
    {
        if(!$categoryId){
            $category = Category::query()->first();
        }else{
            $category = Category::find($categoryId);
        }

        $authUser = request()->user();

        $websiteUrls = $category->websiteUrls()
                    ->when($authUser->isAdmin, function ($query) use ($authUser) {
                        return $query->where('user_id', $authUser->id);
                    })
                    ->when($authUser->isUser, function ($query) use ($authUser) {
                        return $query->where('user_id', $authUser->team_id);
                    })
                    ->paginate(10);

        return response()->json($websiteUrls, Response::HTTP_OK);
    }

    public function store(WebsiteUrlStoreRequest $request): JsonResponse
    {
        Gate::authorize('create', WebsiteUrl::class);

        $data = $request->validated();
        $domain = Domain::find($data['domain']);

        $websiteUrlsData = [];

        foreach ($data['categories'] as $key => $category) {

            $endpoint = '';

            if(Arr::exists($data['endpoints'], $key)){

                $endpoint = $data['endpoints'][$key];

                if(!Str::startsWith($endpoint, '/')){
                    $endpoint = "/" . $endpoint;
                }
            }

            $websiteUrlsData[] = [
                'category_id' => $category,
                'url' => "https://{$domain->name}{$endpoint}",
                'user_id' => $domain->user_id,
            ];
        }

        $domain->websiteUrls()->createMany($websiteUrlsData);
        $domain->update(['status' => DomainStatus::APPROVED]);

        return response()->json(['success' => 'Website Url has been created successfully.'], Response::HTTP_CREATED);
    }

    public function destroy(WebsiteUrl $websiteUrl): JsonResponse
    {
        Gate::authorize('delete', $websiteUrl);

        $websiteUrl->delete();

        return response()->json(['success' => 'Website Url has been deleted successfully.'], Response::HTTP_OK);
    }
}
