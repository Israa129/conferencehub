<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\LoginLog;
use App\Models\FileMetadata;
use App\Models\AnalyticsEvent;
use App\Models\User;

class MongoLogService
{
    public static function activity($action, $description, $entityType = null, $entityId = null): void
    {
        $user = auth()->user();

        ActivityLog::create([
            'user_id'     => $user?->id,
            'user_email'  => $user?->email,
            'role'        => $user?->role,
            'action'      => $action,
            'description' => $description,
            'entity_type' => $entityType,
            'entity_id'   => $entityId,
            'ip_address'  => request()->ip(),
            'user_agent'  => request()->userAgent(),
            'created_at'  => now(),
        ]);
    }

    // ✅ Modifié : accepte désormais $user en paramètre optionnel.
    // Au moment du login, auth()->user() n'est pas encore fiable (token tout juste créé,
    // guard Sanctum pas encore résolu sur cette requête), donc on passe l'utilisateur trouvé
    // directement depuis le controller plutôt que de compter sur auth()->user().
    public static function login($email, $status, ?User $user = null): void
    {
        LoginLog::create([
            'user_id'    => $user?->id,
            'email'      => $email,
            'role'       => $user?->role,
            'status'     => $status,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'logged_at'  => now(),
        ]);
    }

    public static function file($file, $path, $relatedType = null, $relatedId = null): void
    {
        $user = auth()->user();

        FileMetadata::create([
            'user_id'       => $user?->id,
            'file_name'     => basename($path),
            'original_name' => $file->getClientOriginalName(),
            'file_type'     => $file->getClientMimeType(),
            'file_size'     => $file->getSize(),
            'file_path'     => $path,
            'related_type'  => $relatedType,
            'related_id'    => $relatedId,
            'uploaded_at'   => now(),
        ]);
    }

    public static function analytics($eventType, $page = null, $metadata = []): void
    {
        $user = auth()->user();

        AnalyticsEvent::create([
            'user_id'    => $user?->id,
            'event_type' => $eventType,
            'page'       => $page,
            'metadata'   => $metadata,
            'ip_address' => request()->ip(),
            'created_at' => now(),
        ]);
    }
}