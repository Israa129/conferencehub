<?php

namespace App\Http\Controllers;

use App\Models\SessionConference;
use Illuminate\Http\Request;

class SessionConferenceController extends Controller
{
    private function normalizeKeys(array $input): array
    {
        $map = [
            'horaireDebut' => 'horaire_debut',
            'horaireFin'   => 'horaire_fin',
            'conferenceId' => 'conference_id',
        ];

        foreach ($map as $camel => $snake) {
            if (isset($input[$camel])) {
                $input[$snake] = $input[$camel];
                unset($input[$camel]);
            }
        }

        return $input;
    }

    public function index(Request $request)
    {
        $conferenceId = $request->input('conferenceId') ?? $request->input('conference_id');

        if ($conferenceId) {
            return response()->json(
                SessionConference::where('conference_id', $conferenceId)->get()
            );
        }

        return response()->json(SessionConference::all());
    }

    public function store(Request $request)
    {
        $input = $this->normalizeKeys($request->all());

        $data = validator($input, [
            'titre'         => 'required|string',
            'type'          => 'required|string',
            'horaire_debut' => 'required|date',
            'horaire_fin'   => 'required|date|after:horaire_debut',
            'capacite'      => 'required|integer|min:1',
            'conference_id' => 'required|exists:conferences,id',
        ])->validate();

        return response()->json(SessionConference::create($data), 201);
    }

    public function show(SessionConference $sessionConference)
    {
        return response()->json($sessionConference->load('articles'));
    }

    public function update(Request $request, SessionConference $sessionConference)
    {
        $input = $this->normalizeKeys($request->all());

        $data = validator($input, [
            'titre'         => 'required|string',
            'type'          => 'required|string',
            'horaire_debut' => 'required|date',
            'horaire_fin'   => 'required|date|after:horaire_debut',
            'capacite'      => 'required|integer|min:1',
            'conference_id' => 'required|exists:conferences,id',
        ])->validate();

        $sessionConference->update($data);
        return response()->json($sessionConference);
    }

    public function destroy(SessionConference $sessionConference)
    {
        $sessionConference->delete();
        return response()->noContent();
    }
    protected function serializeDate(\DateTimeInterface $date): string
{
    return $date->format('Y-m-d\TH:i:s.u\Z');
}

public function toArray()
{
    $array = parent::toArray();

    return [
        'id'           => $array['id'],
        'titre'        => $array['titre'],
        'type'         => $array['type'],
        'horaireDebut' => $array['horaire_debut'],
        'horaireFin'   => $array['horaire_fin'],
        'capacite'     => $array['capacite'],
        'conferenceId' => $array['conference_id'],
        'createdAt'    => $array['created_at'] ?? null,
        'updatedAt'    => $array['updated_at'] ?? null,
    ];
}
}