<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'titre',
        'resume',
        'statut',
        'user_id',
        'session_id',
    ];

    public function auteur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function sessionConference()
    {
        return $this->belongsTo(SessionConference::class, 'session_id');
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