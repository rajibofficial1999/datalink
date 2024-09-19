<?php

namespace App\Policies;

use App\Models\AccountInformation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AccountInformationPolicy
{
    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AccountInformation $accountInformation): bool
    {
        if($user->isSuperAdmin){
            return true;
        }

        if($user->isAdmin){
            if($accountInformation->owner()->is($user)){
                return true;
            }

            if($accountInformation->owner->team_id == $user->id){
                return true;
            }

            return false;
        }

        return false;

    }

}
