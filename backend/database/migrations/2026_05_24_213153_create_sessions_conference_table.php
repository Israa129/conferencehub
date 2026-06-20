<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sessions_conferences', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('type');
            $table->dateTime('horaire_debut');
            $table->dateTime('horaire_fin');
            $table->integer('capacite');
            $table->foreignId('conference_id')
                  ->constrained('conferences')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions_conferences');
    }
};