<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class AccountInformation extends Model
{
    use HasFactory;

    protected $fillable = [
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
        "selfie",
        "ssn",
        "user_agent",
        'access_token'
    ];

    protected $appends = ['time_for_humans'];


    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function timeForHumans(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->updated_at->diffForHumans()
        );
    }

    public static function findByAccessToken($token): ?AccountInformation
    {
        return self::where('access_token', $token)->first();
    }

    public function deleteOlderPhoto(string $path = ''): void
    {
        if(Storage::disk('public')->exists($path)){
            Storage::disk('public')->delete($path);
        }
    }

    public function owners(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
