<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PendingUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $authUser = $request->user();

        $users = [];
        if($authUser->isSuperAdmin || $authUser->isAdmin){
            $users = User::query()
                    ->with(['roles', 'team'])
                    ->when($authUser->isSuperAdmin, function ($query) use ($authUser) {
                        return $query->where('id', '!=', $authUser->id)
                            ->where('status', UserStatus::PENDING);
                    })
                    ->when($authUser->isAdmin, function ($query) use ($authUser) {
                        return $authUser->teamMembers()->where('status', UserStatus::PENDING);
                    })
                    ->latest()
                    ->paginate(10);
        }

        return response()->json([
            'users' => $users,
            'status' => UserStatus::cases()
        ], Response::HTTP_OK);
    }
}
