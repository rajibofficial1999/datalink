<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\User;
use App\Models\VisitorInformation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Stevebauman\Location\Facades\Location;

class VisitorInformationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), $this->formRules());

        if ($validator->fails()) {
            return $this->throwErrors($validator->errors());
        }

        $requestData = $request->all();

        $user = User::findUserByAccessToken($requestData['user_access_token']);
        if (!$user) {
            return $this->addErrorAndThrow($validator, 'user_access_token', 'User access token is not valid.');
        }

        $category = $this->findCategoryByName($requestData['service_name']);
        if (!$category) {
            return $this->addErrorAndThrow($validator, 'service_name', 'Service name is not valid.');
        }

        $data = Location::get($requestData['ip_address']);

        if($data){
            $data = $data->toArray();

            $data = $this->prepareData($user, $category, $requestData['user_agent'], $data);

            $subValidator = Validator::make($data, $this->subRules());

            if($subValidator->fails()){
                return $this->throwErrors($validator->errors());
            }

            $visitorInfo = VisitorInformation::create($data);

            return response()->json([
                'success' => true,
                'visitor_information' => $visitorInfo
            ], Response::HTTP_OK);
        }

        return $this->addErrorAndThrow($validator, 'ip_address', 'IP Address is not valid.');
    }

    protected function formRules(): array
    {
        return [
            'user_access_token' => 'required|string',
            'service_name' => 'required|string|max:255',
            'ip_address' => 'required|string|max:255',
            'user_agent' => 'required|string',
        ];
    }

    protected function subRules(): array
    {
        return [
            'country' => 'required|max:255',
            'city' => 'nullable|max:255',
            'state_name' => 'nullable|max:255',
            'zip_code' => 'nullable|max:255',
        ];
    }

    protected function addErrorAndThrow($validator, string $key, string $message): JsonResponse
    {
        $validator->errors()->add($key, $message);
        return $this->throwErrors($validator->errors());
    }

    protected function throwErrors($errors): JsonResponse
    {
        return response()->json([
            'success' => false,
            'errors' => $errors,
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    protected function findCategoryByName(string $name): ?Category
    {
        return Category::whereRaw('LOWER(name) = ?', [strtolower($name)])->first();
    }

    protected function prepareData(User $user, Category $category, string $user_agent, array $data): array
    {
        $data['user_id'] = $user->id;
        $data['category_id'] = $category->id;
        $data['ip_address'] = $data['ip'];
        $data['country'] = $data['countryName'];
        $data['city'] = $data['cityName'];
        $data['state_name'] = $data['regionName'];
        $data['zip_code'] = $data['zipCode'];
        $data['user_agent'] = $user_agent;

        return $data;
    }
}
