<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionConference extends Model
{
    protected $table = 'sessions_conferences';

    protected $fillable = [
        'titre',
        'type',
        'horaire_debut',
        'horaire_fin',
        'capacite',
        'conference_id',
    ];


    public function conference(): BelongsTo
    {
        return $this->belongsTo(Conference::class, 'conference_id');
    }

    public function fill(array $attributes)
    {
        $mapped = [
            'horaireDebut'  => 'horaire_debut',
            'horaireFin'    => 'horaire_fin',
            'conferenceId'  => 'conference_id',
        ];

        foreach ($mapped as $camel => $snake) {
            if (isset($attributes[$camel])) {
                $attributes[$snake] = $attributes[$camel];
                unset($attributes[$camel]);
            }
        }

        return parent::fill($attributes);
    }
}