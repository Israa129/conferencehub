<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\MongoLogService;

class AuthController extends Controller
{
    // Register
    public function register(Request $request)
    {
        $request->validate([
            'nom'      => 'required|string',
            'prenom'   => 'required|string',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
            'pays'     => 'nullable|string',
        ]);

        $user = User::create([
            'nom'      => $request->nom,
            'prenom'   => $request->prenom,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'pays'     => $request->pays,
            'role'     => 'participant',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ Log : nouvelle inscription
        MongoLogService::activity('user_register', "Nouveau compte créé : {$user->prenom} {$user->nom}", 'User', $user->id);

        return response()->json([
            'user'  => $user,
            'token' => $token
        ], 201);
    }

    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // ✅ Log : échec de connexion
            MongoLogService::login($request->email, 'failed');

            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ Log : connexion réussie (on passe $user explicitement)
        MongoLogService::login($user->email, 'success', $user);

        return response()->json([
            'user'  => $user,
            'token' => $token
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    // Me
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function getNameById($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        return response()->json([
            'id'   => $user->id,
            'name' => $user->getName(),
        ]);
    }
}