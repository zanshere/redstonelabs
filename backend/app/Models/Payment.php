<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id', 'transaction_id', 'payment_type', 'transaction_status',
        'fraud_status', 'bank', 'va_number', 'store', 'payment_code',
        'gross_amount', 'currency', 'transaction_time', 'settlement_time',
        'expiry_time', 'metadata', 'status_code', 'signature_key'
    ];

    protected $casts = [
        'metadata' => 'array',
        'transaction_time' => 'datetime',
        'settlement_time' => 'datetime',
        'expiry_time' => 'datetime',
    ];

    public function order() { return $this->belongsTo(Order::class); }
}
