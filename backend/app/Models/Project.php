<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['title', 'description', 'image', 'category', 'client', 'url', 'published_at'];

    protected $casts = ['published_at' => 'datetime'];
}
