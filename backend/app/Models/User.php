<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
        'pays',
        'statut', 
        'last_login_at',
            'notif_email_inscription',
            'notif_email_conference',
            'notif_email_newsletter',
            'notif_push',
            'theme',
            'langue',
            'densite',
            'visibilite_profil',
            'afficher_email',
            'afficher_pays',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
    public function conferences()
    {
        return $this->hasMany(Conference::class, 'organisateur_id');
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isOrganisateur()
    {
        return $this->role === 'organisateur';
    }

    public function isConferencier()
    {
        return $this->role === 'conferencier';
    }

    public function isParticipant()
    {
        return $this->role === 'participant';
    }

    public function getName()
    {
        return $this->prenom . ' ' . $this->nom;
    }
}