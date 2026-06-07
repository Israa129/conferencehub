<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; // <-- Déjà correct !

class Article extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'articles';

    protected $fillable = [
        'titre',
        'resume',
        'mots_cles',
        'fichier_pdf',
        'statut',           // 'en_revision' | 'accepte' | 'refuse'
        'commentaires',
        'conference_id',
        'conference_nom',
        'conference_lieu',
        'conferencier_id',
        'conferencier_nom',
        'session_assignee',
        'date_presentation',
    ];

    protected $casts = [
        'mots_cles' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Scope par conférencier
    public function scopeByConferencier($query, $conferencierId)
    {
        return $query->where('conferencier_id', $conferencierId);
    }

    // Scope par statut
    public function scopeByStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }
}