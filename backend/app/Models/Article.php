<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'titre',
        'resume',
        'mots_cles',
        'fichier_pdf',
        'statut',
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

    public function scopeByConferencier($query, $id)
    {
        return $query->where('conferencier_id', $id);
    }

    public function scopeByStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }
}