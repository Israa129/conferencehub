<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Conference;
use App\Models\Article;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Stats globales
    public function stats()
    {
        return response()->json([
            'utilisateurs_total'  => User::count(),
            'utilisateurs_mois'   => User::whereMonth('created_at', now()->month)->count(),
            'conferences_actives' => Conference::count(),
            'comptes_bloques'     => User::where('statut', 'bloque')->count(),
            'articles_total'      => Article::count(),
        ]);
    }

    // Liste des utilisateurs
    public function utilisateurs(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nom', 'ilike', "%{$request->search}%")
                  ->orWhere('prenom', 'ilike', "%{$request->search}%")
                  ->orWhere('email', 'ilike', "%{$request->search}%");
            });
        }

        if ($request->role) {
            $query->where('role', $request->role);
        }

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate(10)
        );
    }

    // Modifier le rôle
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:participant,conferencier,organisateur,admin'
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        return response()->json(['message' => 'Rôle mis à jour.', 'user' => $user]);
    }

    // Bloquer/débloquer un compte
    public function toggleStatut($id)
    {
        $user = User::findOrFail($id);
        $newStatut = $user->statut === 'bloque' ? 'actif' : 'bloque';
        $user->update(['statut' => $newStatut]);

        return response()->json(['message' => 'Statut mis à jour.', 'user' => $user]);
    }

    // Supprimer un compte
    public function deleteUser($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Compte supprimé.']);
    }
}