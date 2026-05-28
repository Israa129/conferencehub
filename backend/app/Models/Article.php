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
    }
}