<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionConference extends Model
{
<<<<<<< Updated upstream
    protected $table = 'sessions_conference';
=======
    protected $table = 'session_conferences'; 
>>>>>>> Stashed changes

    protected $fillable = [
        'titre',
        'type',
        'horaire_debut',
        'horaire_fin',
        'capacite',
        'conference_id',
    ];

<<<<<<< Updated upstream
    public function conference()
=======

    public function conference(): BelongsTo
    {
        return $this->belongsTo(Conference::class, 'conference_id');
    }

    public function fill(array $attributes)
>>>>>>> Stashed changes
    {
        return $this->belongsTo(Conference::class);
    }

    public function articles()
    {
        return $this->hasMany(Article::class, 'session_id');
    }
}