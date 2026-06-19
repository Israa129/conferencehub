<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Conference;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Services\MongoLogService;

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
        $ancienRole = $user->role;
        $user->update(['role' => $request->role]);

        // ✅ Log MongoDB
        MongoLogService::activity(
            'role_update',
            "Rôle changé de {$ancienRole} à {$request->role} pour {$user->prenom} {$user->nom}",
            'User',
            $user->id
        );

        return response()->json(['message' => 'Rôle mis à jour.', 'user' => $user]);
    }

    public function toggleStatut($id)
    {
        $user = User::findOrFail($id);
        $user->update(['statut' => $user->statut === 'bloque' ? 'actif' : 'bloque']);

        // ✅ Log MongoDB
        MongoLogService::activity(
            'statut_toggle',
            "Statut changé en {$user->statut} pour {$user->prenom} {$user->nom}",
            'User',
            $user->id
        );

        return response()->json(['message' => 'Statut mis à jour.', 'user' => $user]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $nomComplet = "{$user->prenom} {$user->nom}";
        $userId = $user->id;

        $user->delete();

        // ✅ Log MongoDB (après suppression, on garde les infos déjà récupérées)
        MongoLogService::activity('user_delete', "Compte supprimé : {$nomComplet}", 'User', $userId);

        return response()->json(['message' => 'Compte supprimé.']);
    }
}