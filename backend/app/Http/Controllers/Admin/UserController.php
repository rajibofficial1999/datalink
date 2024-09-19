<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Enum;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $authUser = $request->user();

        if($authUser->isSuperAdmin || $authUser->isAdmin) {
            $users = User::query()
                    ->with(['roles', 'team'])
                    ->when($authUser->isSuperAdmin, function ($query) use ($authUser) {
                        return $query->where('id', '!=', $authUser->id)
                            ->where('status', '!=', UserStatus::PENDING);
                    })
                    ->when($authUser->isAdmin, function ($query) use ($authUser) {
                        return $authUser->teamMembers()->where('status', '!=', UserStatus::PENDING);
                    })
                    ->latest()
                    ->paginate(10);
        }


        return response()->json([
            'users' => $users ?? [],
            'status' => UserStatus::cases()
        ], Response::HTTP_OK);
    }

    public function roles(Request $request): JsonResponse
    {
        if($request->user()->isSuperAdmin){
            return response()->json(Role::where('name', '!=', 'simple-user')->get(), Response::HTTP_OK);
        }

        return response()->json([], Response::HTTP_OK);
    }

    public function store(UserStoreRequest $request): JsonResponse
    {
        Gate::authorize('create', User::class);

        $data = $request->validated();
        $data['access_token'] = bin2hex(random_bytes(4));

        $role = $data['role'];
        if($request->user()->isAdmin || !$role){
            $role = Role::whereName('normal-user')->first();
            $data['team_id'] = $request->user()->id;
        }

        if($request->hasFile('profile_photo')) {
            $imagePath = $request->file('profile_photo')->store('users', 'public');
            $data['avatar'] = $imagePath;
        }

        $user = User::create($data);
        $user->updateStatus(UserStatus::APPROVED);


        $user->roles()->attach($role);

        return response()->json(['success' => 'User has been created successfully.'], Response::HTTP_CREATED);
    }

    public function show(User $user)
    {
        Gate::authorize('view', $user);

        return response()->json($user, Response::HTTP_OK);
    }

    public function destroy(User $user): JsonResponse
    {
        Gate::authorize('delete', $user);

        if(Storage::disk('public')->exists($user->avatar)){
            Storage::disk('public')->delete($user->avatar);
        }

        if($user->isAdmin){
            foreach ($user->teamMembers as $member) {
                if(Storage::disk('public')->exists($member->avatar)){
                    Storage::disk('public')->delete($member->avatar);
                }
            }

            $user->teamMembers()->delete();
        }

        $user->delete();

        return response()->json(['success' => 'User has been deleted successfully.'], Response::HTTP_OK);
    }

    public function updateUser(UserUpdateRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::find($data['user_id']);

        Gate::authorize('update', $user);

        if($data['role']){
            $user->roles()->sync($data['role']);
        }

        if(!$data['password']){
            unset($data['password']);
        }

        if($request->hasFile('profile_photo')) {

            if(Storage::disk('public')->exists($user->avatar)){
                Storage::disk('public')->delete($user->avatar);
            }

            $imagePath = $request->file('profile_photo')->store('users', 'public');
            $data['avatar'] = $imagePath;
        }

        $user->update($data);

        return response()->json([
            'success' => 'User has been updated successfully.',
            'user' => $user,
        ], Response::HTTP_OK);
    }

    public function userStatus(Request $request, User $user)
    {
        Gate::authorize('changeStatus', $user);

        $data = $request->validate( [
            'status' => ['required', new Enum(UserStatus::class)],
        ]);

        $user->status = $data['status'];
        $user->save();

        return response()->json(['success' => 'User status has been changed.'], Response::HTTP_OK);
    }
}
