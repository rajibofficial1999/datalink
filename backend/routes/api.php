<?php

use App\Http\Controllers\Admin\AccountInformationController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DeleteMultipleDataController;
use App\Http\Controllers\Admin\DomainController;
use App\Http\Controllers\Admin\NoticeController;
use App\Http\Controllers\Admin\PendingDomainController;
use App\Http\Controllers\Admin\PendingUserController;
use App\Http\Controllers\Admin\SupportController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WebsiteUrlController;
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
       Route::post('/users/update', [UserController::class, 'updateUser']);
       Route::put('/users/status/{user}', [UserController::class, 'userStatus']);
       Route::get('/pending-users', [PendingUserController::class, 'index']);

       Route::apiResource('/categories', CategoryController::class);

       Route::apiResource('/domains', DomainController::class);
       Route::post('/domains/update', [DomainController::class, 'updateDomain']);
       Route::put('/domains/status/{domain}', [DomainController::class, 'domainStatus']);
       Route::get('/pending-domains', [PendingDomainController::class, 'index']);

       Route::get('/roles', [UserController::class, 'roles']);

       Route::get('/website-urls/{categoryId?}', [WebsiteUrlController::class, 'index']);
       Route::post('/website-urls', [WebsiteUrlController::class, 'store']);
       Route::delete('/website-urls/{websiteUrl?}', [WebsiteUrlController::class, 'destroy']);

       Route::get('/account-information', [AccountInformationController::class, 'index']);
       Route::delete('/account-information/{accountInformation}', [AccountInformationController::class, 'destroy']);

       Route::post('/multiple-delete-data/{table}', DeleteMultipleDataController::class);

        Route::apiResource('/notices', NoticeController::class);
        Route::apiResource('/supports', SupportController::class);
        Route::post('/supports/update', [SupportController::class, 'update']);

    });
});
