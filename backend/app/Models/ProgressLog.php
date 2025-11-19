<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgressLog extends Model
{
    protected $fillable = ['order_id', 'status', 'description', 'logged_at'];

    protected $casts = ['logged_at' => 'datetime'];

    public function order() { return $this->belongsTo(Order::class); }
}
