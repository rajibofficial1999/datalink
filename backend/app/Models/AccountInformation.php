<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountInformation extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "category_id",
        "email",
        "username",
        "phone",
        "password",
        "confirm_password",
        "password_of_email",
        "captcha",
        "otp_code",
        "nid_front",
        "nid_back",
        "user_agent"
    ];

    protected $appends = ['time_for_humans'];


    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function timeForHumans(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->created_at->diffForHumans()
        );
    }

}
