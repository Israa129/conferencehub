<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SessionConference extends Model
{
    protected $table = 'sessions_conference';

    protected $fillable = [
        'titre',
        'type',
        'horaire_debut',
        'horaire_fin',
        'capacite',
        'conference_id',
    ];

    public function conference()
    {
        return $this->belongsTo(Conference::class);
    }

    public function articles()
    {
        return $this->hasMany(Article::class, 'session_id');
    }
}