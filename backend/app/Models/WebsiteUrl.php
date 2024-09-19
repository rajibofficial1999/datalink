<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteUrl extends Model
{
    use HasFactory;

    protected $fillable = ['domain_id', 'user_id', 'category_id', 'url'];
}
