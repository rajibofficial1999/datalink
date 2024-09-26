<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UrlType extends Model
{
    use HasFactory;

    protected $fillable = ['video_calling', 'login_page'];
}
