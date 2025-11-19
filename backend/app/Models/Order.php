<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'created_by', 'price_list_id', 'order_number',
        'status', 'total_amount', 'notes', 'deadline', 'completed_at'
    ];

    // 🔗 Relasi
    public function user() { return $this->belongsTo(User::class); }
    public function createdBy() { return $this->belongsTo(User::class, 'created_by'); }
    public function priceList() { return $this->belongsTo(PriceList::class); }

    public function payments() { return $this->hasMany(Payment::class); }
    public function complaints() { return $this->hasMany(Complaint::class); }
    public function rating() { return $this->hasOne(Rating::class); }
    public function progressLogs() { return $this->hasMany(ProgressLog::class); }
}
