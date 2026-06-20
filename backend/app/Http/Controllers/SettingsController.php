<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class SettingsController extends Controller
{
    // ── GET /api/settings ─────────────────────────────────────────────────
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'notifications' => [
                'notif_email_inscription' => (bool) $user->notif_email_inscription,
                'notif_email_conference'  => (bool) $user->notif_email_conference,
                'notif_email_newsletter'  => (bool) $user->notif_email_newsletter,
                'notif_push'              => (bool) $user->notif_push,
            ],
            'display' => [
                'theme'   => $user->theme   ?? 'system',
                'langue'  => $user->langue  ?? 'fr',
                'densite' => $user->densite ?? 'confort',
            ],
            'privacy' => [
                'visibilite_profil' => $user->visibilite_profil ?? 'membres',
                'afficher_email'    => (bool) $user->afficher_email,
                'afficher_pays'     => (bool) $user->afficher_pays,
            ],
        ]);
    }

    // ── PUT /api/settings/password ────────────────────────────────────────
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password'      => 'required|string',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }

    // ── PUT /api/settings/notifications ───────────────────────────────────
    public function updateNotifications(Request $request)
    {
        $request->validate([
            'notif_email_inscription' => 'boolean',
            'notif_email_conference'  => 'boolean',
            'notif_email_newsletter'  => 'boolean',
            'notif_push'              => 'boolean',
        ]);

        $request->user()->update($request->only([
            'notif_email_inscription',
            'notif_email_conference',
            'notif_email_newsletter',
            'notif_push',
        ]));

        return response()->json(['message' => 'Préférences de notifications sauvegardées.']);
    }

    // ── PUT /api/settings/display ─────────────────────────────────────────
    public function updateDisplay(Request $request)
    {
        $request->validate([
            'theme'   => 'string|in:light,dark,system',
            'langue'  => 'string|in:fr,en,es',
            'densite' => 'string|in:compact,confort,spacieux',
        ]);

        $request->user()->update($request->only(['theme', 'langue', 'densite']));

        return response()->json(['message' => "Préférences d'affichage sauvegardées."]);
    }

    // ── PUT /api/settings/privacy ─────────────────────────────────────────
    public function updatePrivacy(Request $request)
    {
        $request->validate([
            'visibilite_profil' => 'string|in:public,membres,prive',
            'afficher_email'    => 'boolean',
            'afficher_pays'     => 'boolean',
        ]);

        $request->user()->update($request->only([
            'visibilite_profil',
            'afficher_email',
            'afficher_pays',
        ]));

        return response()->json(['message' => 'Paramètres de confidentialité sauvegardés.']);
    }

    // ── DELETE /api/settings/account ──────────────────────────────────────
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Mot de passe incorrect.'],
            ]);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Compte supprimé définitivement.']);
    }
}