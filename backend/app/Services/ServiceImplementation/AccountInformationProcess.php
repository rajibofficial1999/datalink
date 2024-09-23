<?php

namespace App\Services\ServiceImplementation;

use App\Interfaces\AccountManage;
use App\Models\AccountInformation;
use App\Models\Category;
use App\Models\User;
use App\Services\AccountInformation\DefaultService;
use App\Services\AccountInformation\AccountUpdateService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AccountInformationProcess implements AccountManage
{
    public function create(array $data): array
    {
        $validator = Validator::make($data, $this->createRules());

        if ($validator->fails()) {
            return $this->throwErrors($validator->errors());
        }

        $user = User::findUserByAccessToken($data['user_access_token']);
        if (!$user) {
            return $this->addErrorAndThrow($validator, 'user_access_token', 'User access token is not valid.');
        }

        $category = $this->findCategoryByName($data['service_name'], $validator);
        if (!$category) {
            return $this->addErrorAndThrow($validator, 'service_name', 'Service name is not valid.');
        }

        if (!$this->isEmailOrUsernameOrPhoneSet($data)) {
            return $this->addErrorAndThrow($validator, 'email', 'Email, username, or phone is required.');
        }

        $data = $this->prepareData($user, $category, $data);

        return $this->chooseService($category->name, $data);
    }

    public function update(Request $request): array
    {
        $validator = Validator::make($request->all(), $this->updateRules());

        if ($validator->fails()) {
            return $this->throwErrors($validator->errors());
        }

        $account = AccountInformation::findByAccessToken($request->account_access_token);
        if (!$account) {
            return $this->addErrorAndThrow($validator, 'account_access_token', 'Account access token is not valid.');
        }

        return (new AccountUpdateService)->update($account, $request);
    }

    protected function createRules(): array
    {
        return [
            'user_access_token' => 'required|string',
            'email' => 'nullable|email|min:3|max:255',
            'username' => 'nullable|string|min:3|max:255',
            'phone' => 'nullable|min:10|max:255',
            'password' => 'required|max:255',
            'confirm_password' => 'nullable|max:255',
            'password_of_email' => 'nullable|max:255',
            'service_name' => 'required|string|max:255',
            'user_agent' => 'required|string|max:255',
        ];
    }

    protected function updateRules(): array
    {
        return [
            'account_access_token' => 'required|string',
            'nid_front' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'nid_back' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'selfie' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'otp_code' => 'nullable|max:255',
            'ssn' => 'nullable|max:255',
        ];
    }

    protected function addErrorAndThrow($validator, string $key, string $message): array
    {
        $validator->errors()->add($key, $message);
        return $this->throwErrors($validator->errors());
    }

    protected function isEmailOrUsernameOrPhoneSet(array $data): bool
    {
        return Arr::hasAny($data, ['email', 'username', 'phone']) &&
            ($data['email'] ?? $data['username'] ?? $data['phone'] ?? null) !== null;
    }

    protected function throwErrors($errors): array
    {
        return [
            'success' => false,
            'errors' => $errors,
        ];
    }

    protected function prepareData(User $user, Category $category, array $data): array
    {
        $key = Arr::first(['email', 'username', 'phone'], fn($k) => Arr::has($data, $k));
        $keyValue = $data[$key] ?? null;

        $account = AccountInformation::where($key, $keyValue)->first();
        if ($account) {
            $data['confirm_password'] = $data['password'];
            Arr::forget($data, ['password', 'email']);
        }else{
            $data['access_token'] = Str::uuid()->toString();
        }

        $data['category_id'] = $category->id;
        $data['user_id'] = $user->id;
        $data['update_key'] = [$key => $keyValue];

        return $data;
    }

    protected function findCategoryByName(string $name, $validator): ?Category
    {
        return Category::whereRaw('LOWER(name) = ?', [strtolower($name)])->first();
    }

    protected function chooseService(string $serviceName, array $data): array
    {
        return (new DefaultService)->create($data);

        //  Add Custom Services here with valid key. the key needs to be the category name. Ex: mega = is valid category name

        // return match (Str::lower($serviceName)) {
        //     'mega' => (new MegapersonalsService)->create($data),
        //     'skip' => (new SkipTheGamesService)->create($data),
        //     default => [
        //         'success' => false,
        //         'errors' => ['Service not available']
        //     ],
        // };
    }
}
