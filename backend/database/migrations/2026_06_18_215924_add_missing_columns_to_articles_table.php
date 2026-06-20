<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('articles', function (Blueprint $table) {
            $table->foreignId('conference_id')
                  ->nullable()
                  ->after('user_id')
                  ->constrained('conferences')
                  ->nullOnDelete();
            $table->json('mots_cles')->nullable()->after('resume');
            $table->text('commentaires')->nullable()->after('statut');
        });
    }

    public function down(): void {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['conference_id']);
            $table->dropColumn(['conference_id', 'mots_cles', 'commentaires']);
        });
    }
};