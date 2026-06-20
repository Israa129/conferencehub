<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // ── Notifications ────────────────────────────────────────────
            $table->boolean('notif_email_inscription')->default(true);
            $table->boolean('notif_email_conference')->default(true);
            $table->boolean('notif_email_newsletter')->default(false);
            $table->boolean('notif_push')->default(true);

            // ── Préférences d'affichage ──────────────────────────────────
            $table->string('theme', 10)->default('system');    // light | dark | system
            $table->string('langue', 5)->default('fr');        // fr | en | es
            $table->string('densite', 15)->default('confort'); // compact | confort | spacieux

            // ── Confidentialité ──────────────────────────────────────────
            $table->string('visibilite_profil', 10)->default('membres'); // public | membres | prive
            $table->boolean('afficher_email')->default(false);
            $table->boolean('afficher_pays')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'notif_email_inscription',
                'notif_email_conference',
                'notif_email_newsletter',
                'notif_push',
                'theme',
                'langue',
                'densite',
                'visibilite_profil',
                'afficher_email',
                'afficher_pays',
            ]);
        });
    }
};