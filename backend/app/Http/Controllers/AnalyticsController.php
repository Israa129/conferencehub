<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\LoginLog;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $jours = (int) $request->get('jours', 7);
        $depuis = Carbon::now()->subDays($jours);

        return response()->json([
            'connexions_par_jour' => $this->connexionsParJour(),
            'connexions_par_role' => $this->connexionsParRole($depuis),
            'actions_par_type'    => $this->actionsParType($depuis),
            'echecs_connexion'    => $this->echecsConnexion($depuis),
            'activite_recente'   => $this->activiteRecente(),
        ]);
    }

    private function connexionsParJour()
    {
        $logs = LoginLog::where('status', 'success')->get();

        $parJour = $logs->groupBy(function ($log) {
            return Carbon::parse($log->logged_at)->format('Y-m-d');
        })->map(fn($groupe) => $groupe->count());

        $resultat = [];
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays(6 - $i)->format('Y-m-d');
            $resultat[] = ['date' => $date, 'total' => $parJour[$date] ?? 0];
        }

        return $resultat;
    }

    private function connexionsParRole(Carbon $depuis)
    {
        $logs = LoginLog::where('status', 'success')->get();

        return $logs->groupBy('role')
            ->filter(fn($groupe, $role) => $role !== null)
            ->map(fn($groupe, $role) => ['role' => $role, 'total' => $groupe->count()])
            ->values();
    }

    private function actionsParType(Carbon $depuis)
    {
        $logs = ActivityLog::all();

        return $logs->groupBy('action')
            ->map(fn($groupe, $action) => ['action' => $action, 'total' => $groupe->count()])
            ->values();
    }

    private function echecsConnexion(Carbon $depuis)
    {
        return LoginLog::where('status', 'failed')->count();
    }

    private function activiteRecente()
    {
        return ActivityLog::all()
            ->sortByDesc(fn($log) => is_string($log->created_at) ? $log->created_at : $log->created_at->toIso8601String())
            ->take(10)
            ->map(fn($log) => [
                'description' => $log->description,
                'role'        => $log->role,
                'date'        => $log->created_at,
            ])
            ->values();
    }
}