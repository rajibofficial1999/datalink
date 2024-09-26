<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'full_name', 'is_premium'];

    public function websiteUrls(): HasMany
    {
        return $this->hasMany(WebsiteUrl::class);
    }

    public function visitorInformation(): HasMany
    {
        return $this->hasMany(VisitorInformation::class);
    }
}
