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
        Schema::create('url_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_url_id')->constrained('website_urls')->cascadeOnDelete();
            $table->boolean('login_page')->default(true);
            $table->boolean('video_calling')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('url_types');
    }
};
