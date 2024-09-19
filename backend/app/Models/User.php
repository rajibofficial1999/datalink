<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $appends = ['is_admin','is_super_admin', 'is_user'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'access_token',
        'team_id',
        'password',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => UserStatus::class
        ];
    }

    public function domains(): HasMany
    {
        return $this->hasMany(Domain::class);
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(User::class, 'team_id');
    }

    public function teamMembers(): HasMany
    {
        return $this->hasMany(User::class, 'team_id');
    }

    public function websiteUrls(): HasMany
    {
        return $this->hasMany(WebsiteUrl::class);
    }

    public function isAdmin(): Attribute
    {
        return Attribute::make(
            get: function() {
                if($this->roles->first()){
                    return $this->roles->first()->name == 'admin-user';
                }else{
                    return false;
                }
            }
        );
    }

    public function isSuperAdmin(): Attribute
    {
        return Attribute::make(
            get: function() {
                if($this->roles->first()){
                    return $this->roles->first()->name == 'super-admin';
                }else{
                    return false;
                }
            }
        );
    }

    public function isUser(): Attribute
    {
        return Attribute::make(
            get: function() {
                if($this->roles->first()){
                    return $this->roles->first()->name == 'normal-user';
                }else{
                    return false;
                }
            }
        );
    }

    public function updateStatus($value): void
    {
        $this->status = $value;

        $this->save();
    }

    public function supports(): HasMany
    {
        return $this->hasMany(Support::class);
    }

    public function notices(): HasMany
    {
        return $this->hasMany(Notice::class);
    }

}
