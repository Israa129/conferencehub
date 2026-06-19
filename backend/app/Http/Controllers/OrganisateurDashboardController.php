<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use App\Models\SessionConference;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class OrganisateurDashboardController extends Controller
{
    public function getDashboardStats(int $organisateur_id): JsonResponse
    {
        try {
            // 1. Compte uniquement les conférences de cet organisateur
            $totalConferences = Conference::where('organisateur_id', $organisateur_id)->count();

            // 2. Compte uniquement les sessions de cet organisateur via la relation propre
            $totalSessions = SessionConference::whereHas('conference', function ($query) use ($organisateur_id) {
                $query->where('organisateur_id', $organisateur_id);
            })->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'conferences' => $totalConferences,
                    'sessions'    => $totalSessions,
                ]
            ], 200);

        } catch (Exception $e) {
            Log::error('Erreur au chargement du tableau de bord', [
                'organisateur_id' => $organisateur_id,
                'message'         => $e->getMessage(),
                'trace'           => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}