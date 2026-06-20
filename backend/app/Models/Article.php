<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    protected $connection = 'pgsql';
    protected $table = 'articles';

    protected $fillable = [
        'user_id',
        'conference_id',
        'session_id',
        'titre',
        'resume',
        'mots_cles',
        'fichier_pdf',
        'statut',
        'commentaires',
    ];

    protected $casts = [
        'mots_cles'  => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function auteur(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function conference(): BelongsTo {
        return $this->belongsTo(Conference::class, 'conference_id');
    }

    public function session(): BelongsTo {
        return $this->belongsTo(SessionConference::class, 'session_id');
    }

    public function scopeByConferencier($query, $userId) {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatut($query, $statut) {
        return $query->where('statut', $statut);
    }
}