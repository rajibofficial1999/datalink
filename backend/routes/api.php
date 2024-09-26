<?php

use App\Http\Controllers\Api\VisitorInformationController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccountInformationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::post('/accounts/store', [AccountInformationController::class, 'store']);

    Route::post('/accounts/update', [AccountInformationController::class, 'update']);

    Route::post('/visitor-information/store', [VisitorInformationController::class, 'store']);
});
