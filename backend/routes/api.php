<?php

use App\Http\Controllers\Api\VisitorInformationController;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccountInformationController;

Route::prefix('v1')->group(function () {
    Route::post('/accounts/store', [AccountInformationController::class, 'store']);

    Route::post('/accounts/update', [AccountInformationController::class, 'update']);

    Route::get('/accounts/show-account/{access_token}', [AccountInformationController::class, 'show']);

    Route::post('/visitor-information/store', [VisitorInformationController::class, 'store']);
});
