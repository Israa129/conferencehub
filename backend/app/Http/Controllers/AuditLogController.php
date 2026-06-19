<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = ActivityLog::query();

        if ($request->filled('role')) {
            $logs->where('role', $request->role);
        }

        if ($request->filled('action')) {
            $logs->where('action', $request->action);
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $logs->where(function ($query) use ($search) {
                $query->where('user_email', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $logs->orderBy('created_at', 'desc')->paginate(15)
        );
    }

    public function actions()
    {
        return response()->json(
            ActivityLog::query()
                ->select('action')
                ->distinct()
                ->pluck('action')
        );
    }
}