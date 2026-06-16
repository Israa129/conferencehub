<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Models\Conference;
use App\Models\Article;
use App\Models\SessionConference;

class OrganisateurDashboardController extends Controller
{
    public function getDashboardStats(): JsonResponse
    {
        try {
            $totalConferences = Conference::count();
            $totalSessions    = SessionConference::count();
            // $totalArticles    = Article::count();

            return response()->json([
                'success' => true,
                'data' => [
                    'conferences' => $totalConferences,
                    'sessions'    => $totalSessions,
                    // 'articles'    => $totalArticles
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur au chargement du tableau de bord', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}