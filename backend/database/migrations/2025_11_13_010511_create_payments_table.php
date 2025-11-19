<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Relasi ke orders
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');

            // Data utama transaksi
            $table->string('transaction_id')->unique(); // ID transaksi dari Midtrans
            $table->string('payment_type')->nullable(); // credit_card, gopay, bank_transfer, dll
            $table->string('transaction_status')->default('pending'); // pending, settlement, capture, cancel, expire
            $table->string('fraud_status')->nullable(); // accept, challenge, deny (optional untuk credit card)

            // Detail pembayaran
            $table->string('bank')->nullable(); // untuk transfer bank
            $table->string('va_number')->nullable(); // nomor virtual account
            $table->string('store')->nullable(); // untuk pembayaran di convenience store
            $table->string('payment_code')->nullable(); // kode pembayaran alternatif

            // Nominal
            $table->decimal('gross_amount', 15, 2)->default(0);
            $table->string('currency', 10)->default('IDR');

            // Status dan waktu transaksi
            $table->timestamp('transaction_time')->nullable();
            $table->timestamp('settlement_time')->nullable();
            $table->timestamp('expiry_time')->nullable();

            // Meta data tambahan
            $table->json('metadata')->nullable(); // simpan data full JSON dari Midtrans callback

            // Status backend
            $table->string('status_code')->nullable(); // HTTP status dari Midtrans
            $table->string('signature_key')->nullable(); // untuk verifikasi callback

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
