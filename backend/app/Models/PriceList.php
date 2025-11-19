<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceList extends Model
{
    protected $fillable = ['title', 'description', 'price', 'category', 'duration', 'is_active'];

    public function orders() { return $this->hasMany(Order::class); }
}
