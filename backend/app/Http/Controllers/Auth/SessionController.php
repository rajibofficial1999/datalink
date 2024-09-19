<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class SessionController extends Controller
{
    public function create(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if(Auth::attempt($credentials, true)){
            $user = UserResource::make(Auth::user());
            $token = $user->createToken(time())->plainTextToken;

            return response()->json(['user' => $user, 'token' => $token], Response::HTTP_OK);
        }

        return response()->json([
            'errors' => [
                'error' => 'Provided credentials are not valid.'
            ]
        ], Response::HTTP_UNAUTHORIZED);
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['success' => true], Response::HTTP_OK);
    }
}
