<?php

namespace App\Services\AccountInformation;

use App\Models\AccountInformation;

class DefaultService
{
    public function create(array $data): array
    {
        $account = AccountInformation::updateOrCreate($data['update_key'], $data);

        return [
            'success' => true,
            'account' => $account,
            'account_access_token' => $account->access_token,
        ];
    }
}
