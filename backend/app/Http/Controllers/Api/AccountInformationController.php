<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\AccountManage;
use App\Models\AccountInformation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AccountInformationController extends Controller
{
    public function __construct(protected AccountManage $accountService) {}

    public function store(Request $request): JsonResponse
    {
        $data = $this->accountService->create($request->all());

        $responseCode = $data['success'] ? Response::HTTP_OK : Response::HTTP_UNPROCESSABLE_ENTITY;

        return response()->json($data, $responseCode);
    }

    public function show(string $access_token): JsonResponse
    {
        $account = AccountInformation::findByAccessToken($access_token);

        return response()->json($account, Response::HTTP_OK);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $this->accountService->update($request);

        $responseCode = $data['success'] ? Response::HTTP_OK : Response::HTTP_UNPROCESSABLE_ENTITY;

        return response()->json($data, $responseCode);
    }
}
