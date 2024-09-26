<?php

namespace App\Models;

use App\Enums\UserStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany, HasOne};
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;


    protected $fillable = [
        'name', 'email', 'access_token', 'team_id', 'password',
        'two_step_auth', 'avatar', 'email_verified_at', 'status'
    ];


    protected $hidden = [
        'password', 'remember_token',
    ];


    protected $appends = ['is_admin', 'is_super_admin', 'is_user', 'verified_date'];


    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => UserStatus::class,
        ];
    }

    /* Relationships */

    public function team(): BelongsTo
    {
        return $this->belongsTo(User::class, 'team_id');
    }

    public function teamMembers(): HasMany
    {
        return $this->hasMany(User::class, 'team_id');
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function accounts(): BelongsToMany
    {
        return $this->belongsToMany(AccountInformation::class);
    }

    public function domains(): HasMany
    {
        return $this->hasMany(Domain::class);
    }

    public function supports(): HasMany
    {
        return $this->hasMany(Support::class);
    }

    public function notices(): HasMany
    {
        return $this->hasMany(Notice::class);
    }

    public function otpCode(): HasOne
    {
        return $this->hasOne(OtpCode::class);
    }

    /* Custom Attributes */

    public function isAdmin(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->roles->first()?->name === 'admin-user' ?? false
        );
    }

    public function isSuperAdmin(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->roles->first()?->name === 'super-admin' ?? false
        );
    }

    public function isUser(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->roles->first()?->name === 'normal-user' ?? false
        );
    }

    public function verifiedDate(): Attribute
    {
        return Attribute::make(
            get: fn() => Carbon::parse($this->email_verified_at)->format('d-M-y')
        );
    }

    public function isVerified(): bool
    {
        return (bool) $this->email_verified_at;
    }

    public function isTowStepAuthOn(): bool
    {
        return $this->two_step_auth;
    }

    public static function findUserByAccessToken($token): ?User
    {
        return self::where('access_token', $token)->first();
    }

    public function urls(): BelongsToMany
    {
        return $this->belongsToMany(WebsiteUrl::class, 'website_url_user');
    }
}
