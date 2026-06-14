<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'titre',
        'resume',
        'mots_cles',
        'fichier_pdf',
        'statut',           // 'en_revision' | 'accepte' | 'refuse'
        'commentaires',
        'user_id',
        'session_id',
        'date_presentation',
    ];

    protected $casts = [
        'mots_cles'  => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ── Relations ──────────────────────────────────────────────
    public function auteur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function sessionConference()
    {
        return $this->belongsTo(SessionConference::class, 'session_id');
    }

    // ── Scopes ─────────────────────────────────────────────────
    public function scopeByConferencier($query, $conferencierId)
    {
        return $query->where('user_id', $conferencierId);
    }

    public function scopeByStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }
}