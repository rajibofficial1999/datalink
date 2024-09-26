<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccountInformation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AccountInformationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $authUser = $request->user();

        $accounts = AccountInformation::query()
            ->with('category')
            ->when($authUser->isAdmin, function ($query) use ($authUser) {
                return $query->whereHas('owners', function ($query) use ($authUser) {
                    return $query->where('user_id', $authUser->id)->orWhere('team_id', $authUser->id);
                });
            })
            ->when($authUser->isUser, function ($query) use ($authUser) {
                return $query->whereHas('owners', function ($query) use ($authUser) {
                    return $query->where('user_id', $authUser->id);
                });
            })
            ->when(!$authUser->isUser, function ($query) use ($authUser) {
                return $query->when($authUser->isSuperAdmin, function ($query) use ($authUser) {
                    return $query->with('owners');
                })->when($authUser->isAdmin, function ($query) use ($authUser) {
                    return $query->with(['owners' => function ($query) use ($authUser) {
                        return $query->where('user_id', $authUser->id)->orWhere('team_id', $authUser->id);
                    }]);
                });
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
