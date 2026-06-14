<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Conference;
use App\Models\Article;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // ── Dashboard unifié (stats + utilisateurs en 1 seul appel) ──
    public function dashboard(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nom',    'ilike', "%{$request->search}%")
                  ->orWhere('prenom', 'ilike', "%{$request->search}%")
                  ->orWhere('email',  'ilike', "%{$request->search}%");
            });
        }

        if ($request->role)   $query->where('role',   $request->role);
        if ($request->statut) $query->where('statut', $request->statut);

        return response()->json([
            'stats' => [
                'utilisateurs_total'  => User::count(),
                'utilisateurs_mois'   => User::whereMonth('created_at', now()->month)->count(),
                'conferences_actives' => Conference::count(),
                'comptes_bloques'     => User::where('statut', 'bloque')->count(),
                'articles_total'      => Article::count(),
            ],
            'utilisateurs' => $query->orderBy('created_at', 'desc')->paginate(10)
        ]);
    }

    // Stats seules (gardées pour compatibilité)
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

    // Liste des utilisateurs (gardée pour le filtre dynamique)
    public function utilisateurs(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nom',    'ilike', "%{$request->search}%")
                  ->orWhere('prenom', 'ilike', "%{$request->search}%")
                  ->orWhere('email',  'ilike', "%{$request->search}%");
            });
        }

        if ($request->role)   $query->where('role',   $request->role);
        if ($request->statut) $query->where('statut', $request->statut);

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate(10)
        );
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:participant,conferencier,organisateur,admin'
        ]);
        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);
        return response()->json(['message' => 'Rôle mis à jour.', 'user' => $user]);
    }

    public function toggleStatut($id)
    {
        $user = User::findOrFail($id);
        $user->update(['statut' => $user->statut === 'bloque' ? 'actif' : 'bloque']);
        return response()->json(['message' => 'Statut mis à jour.', 'user' => $user]);
    }

    public function deleteUser($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Compte supprimé.']);
    }
}