<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccountInformation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

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
                        ->orderBy('updated_at', 'desc')
                        ->paginate(10);

        return response()->json($accounts, Response::HTTP_OK);
    }

    public function destroy(AccountInformation $account): JsonResponse
    {
        Gate::authorize('delete', $account);

        $photos = ['nid_front', 'nid_back', 'selfie'];

        foreach ($photos as $photo) {
            $account->deleteOlderPhoto($account->{$photo} ?? '');
        }

        $account->delete();

        return response()->json(['success' => 'Record deleted successfully.'], Response::HTTP_OK);
    }

}
