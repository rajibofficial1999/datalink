<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\SessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::post('/login', [SessionController::class, 'create']);

    Route::middleware('auth:sanctum')->group(function () {
       Route::delete('/logout', [SessionController::class, 'destroy']);
       Route::apiResource('/users', UserController::class);
    });
});
