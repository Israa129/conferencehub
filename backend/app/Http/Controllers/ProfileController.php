<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    // Récupérer le profil
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    // Mettre à jour le profil
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'nom'    => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email'  => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'pays'   => 'nullable|string|max:255',
        ]);

        $user->update([
            'nom'    => $request->nom,
            'prenom' => $request->prenom,
            'email'  => $request->email,
            'pays'   => $request->pays,
        ]);

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user'    => $user->fresh()
        ]);
    }

    // Changer le mot de passe
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Mot de passe actuel incorrect.'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'Mot de passe modifié avec succès.'
        ]);
    }
}