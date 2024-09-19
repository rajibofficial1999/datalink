<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DomainStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\DomainStoreRequest;
use App\Http\Requests\DomainUpdateRequest;
use App\Models\Domain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;

class DomainController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();

        $domains = [];
        if($authUser->isAdmin || $authUser->isSuperAdmin) {
            $domains = Domain::query()
                ->with('user')
                ->where('status', '!=', DomainStatus::PENDING)
                ->when($authUser->isAdmin, function ($query) use ($authUser) {
                    return $authUser->domains()
                        ->with('user')
                        ->where('status', '!=', DomainStatus::PENDING);
                })
                ->latest()
                ->paginate(10);
        }

        return response()->json([
            'domains' => $domains,
            'status' => DomainStatus::cases()
        ], Response::HTTP_OK);
    }


    public function store(DomainStoreRequest $request)
    {
        Gate::authorize('create', Domain::class);

        $data = $request->validated();

        $name = $data['domain'];
        if(!Str::startsWith($name, 'www.')){
            $name = "www." . $name;
        }

        $data['name'] = $name;

        if($request->hasFile('screenshot')) {
            $imagePath = $request->file('screenshot')->store('screenshots', 'public');
            $data['screenshot'] = $imagePath;
        }

        $request->user()->domains()->create($data);

        return response()->json(['success' => 'User has been created successfully.'], Response::HTTP_CREATED);
    }

    public function show(Domain $domain)
    {
        Gate::authorize('view', $domain);

        return response()->json($domain, Response::HTTP_OK);
    }

    public function destroy(Domain $domain): JsonResponse
    {
        Gate::authorize('delete', $domain);

        if(Storage::disk('public')->exists($domain->screenshot)){
            Storage::disk('public')->delete($domain->screenshot);
        }

        $domain->websiteUrls()->delete();

        $domain->delete();

        return response()->json(['success' => 'Domain has been deleted successfully.'], Response::HTTP_OK);
    }

    public function updateDomain(DomainUpdateRequest $request): JsonResponse
    {
        $data = $request->validated();

        $domain = Domain::find($data['domain_id']);

        Gate::authorize('update', $domain);

        $name = $data['domain'];
        if(!Str::startsWith($name, 'www.')){
            $name = "www." . $name;
        }

        $data['name'] = $name;

        if($request->hasFile('screenshot')) {

            if(Storage::disk('public')->exists($domain->screenshot)){
                Storage::disk('public')->delete($domain->screenshot);
            }

            $imagePath = $request->file('screenshot')->store('screenshots', 'public');
            $data['screenshot'] = $imagePath;
        }

        $domain->update($data);

        return response()->json([
            'success' => 'Domain has been updated successfully.',
            'domain' => $domain,
        ], Response::HTTP_OK);
    }

    public function domainStatus(Request $request, Domain $domain)
    {
        Gate::authorize('updateDomainStatus', Domain::class);

        $data = $request->validate( [
            'status' => ['required', new Enum(DomainStatus::class)],
        ]);

        if($data['status'] === DomainStatus::REJECTED->value) {
            $domain->websiteUrls()->delete();
        }

        $domain->update($data);

        return response()->json(['success' => 'Domain status has been changed.'], Response::HTTP_OK);
    }
}
