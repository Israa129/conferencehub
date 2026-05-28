<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conference extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'theme',
        'lieu',
        'date_debut',
        'date_fin',
        'organisateur_id',
    ];

    public function organisateur()
    {
        return $this->belongsTo(User::class, 'organisateur_id');
    }

    public function sessionsConference()
    {
        return $this->hasMany(SessionConference::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }
}