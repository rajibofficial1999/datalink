<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\AccountManage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AccountInformationController extends Controller
{
    public function __construct(protected AccountManage $accountService){}

    public function store(Request $request): JsonResponse
    {
        $data = $this->accountService->create($request->all());

        $responseCode = $data['success'] ? Response::HTTP_OK : Response::HTTP_UNPROCESSABLE_ENTITY;

        return response()->json($data, $responseCode);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $this->accountService->update($request);

        $responseCode = $data['success'] ? Response::HTTP_OK : Response::HTTP_UNPROCESSABLE_ENTITY;

        return response()->json($data, $responseCode);
    }
}
