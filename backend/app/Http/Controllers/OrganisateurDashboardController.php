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
    public function getDashboardStats(Request $request): JsonResponse
    {
        try {
            $organisateur_id = $request->input('organisateur_id') 
                ?? ($request->user()->id ?? $request->header('X-User-Id'));

            if (!$organisateur_id) {
                return response()->json([
                    'success' => false,
                    'message' => "L'identifiant de l'organisateur est manquant."
                ], 400);
            }

            $totalConferences = Conference::where('organisateur_id', $organisateur_id)->count();

            $totalSessions = SessionConference::whereIn('conference_id', function($query) use ($organisateur_id) {
                $query->select('id')
                      ->from('conferences')
                      ->where('organisateur_id', $organisateur_id);
            })->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'conferences' => $totalConferences,
                    'sessions'    => $totalSessions,
                    // 'articles'   => $totalArticles
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur au chargement du tableau de bord organisateur', [
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