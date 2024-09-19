<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccountInformation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class AccountInformationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $authUser = $request->user();

        $accounts = AccountInformation::query()
                        ->with(['category', 'owner'])
                        ->when($authUser->isAdmin, function ($query) use ($authUser) {
                            return $query->where('user_id', $authUser->id)
                                ->orWhereHas('owner', function ($query) use ($authUser) {
                                    $query->where('team_id', $authUser->id);
                                });
                        })
                        ->when($authUser->isUser, function ($query) use ($authUser) {
                            return $query->where('user_id', $authUser->id);
                        })
                        ->latest()
                        ->paginate(10);

        return response()->json($accounts, Response::HTTP_OK);
    }

    public function destroy(AccountInformation $accountInformation): JsonResponse
    {

        Gate::authorize('delete', $accountInformation);

        if(Storage::disk('public')->exists($accountInformation->nid_front ?? '')){
            Storage::disk('public')->delete($accountInformation->nid_front ?? '');
        }

        if(Storage::disk('public')->exists($accountInformation->nid_back ?? '')){
            Storage::disk('public')->delete($accountInformation->nid_back ?? '');
        }

        if(Storage::disk('public')->exists($accountInformation->selfie ?? '')){
            Storage::disk('public')->delete($accountInformation->selfie ?? '');
        }

        $accountInformation->delete();

        return response()->json(['success' => 'Record deleted successfully.'], Response::HTTP_OK);

    }
}
