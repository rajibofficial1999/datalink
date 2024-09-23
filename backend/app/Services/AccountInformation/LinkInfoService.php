<?php

namespace App\Services\AccountInformation;

use App\Models\LinkInfo;
use Illuminate\Support\Facades\Validator;
use Stevebauman\Location\Facades\Location;

class LinkInfoService
{
    public function create(mixed $visitor_ip, int $user_id, ?int $account_type_id = null)
    {

        $data = Location::get($visitor_ip);

        if($data){

            $data = $data->toArray();

            $data['ip_address'] = $data['ip'];
            $data['country'] = $data['countryName'];
            $data['city'] = $data['cityName'];
            $data['zip_code'] = $data['zipCode'];
            $data['state_name'] = $data['regionName'];
            $data['account_type_id'] = $account_type_id;
            $data['user_id'] = $user_id;

            $validator = Validator::make($data, [
                'account_type_id' => 'nullable|numeric|exists:account_types,id',
                'user_id' => 'required|numeric|exists:users,id',
                'ip_address' => 'required|max:255',
                'country' => 'required|max:255',
                'city' => 'required|max:255',
                'state_name' => 'nullable|max:255',
                'zip_code' => 'nullable|max:255',
            ]);

            if($validator->fails()){
                return $validator->errors();
            }

            LinkInfo::create($data);
        }
    }
}
