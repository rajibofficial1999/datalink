<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WebsiteUrl extends Model
{
    use HasFactory;

    protected $fillable = ['domain_id', 'category_id', 'url'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'website_url_user');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function urlTypes(): HasMany
    {
        return $this->hasMany(UrlType::class, 'website_url_id');
    }
}
