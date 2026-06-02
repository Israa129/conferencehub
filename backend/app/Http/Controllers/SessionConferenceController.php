<?php

namespace App\Http\Controllers;

use App\Models\SessionConference;
use Illuminate\Http\Request;

class SessionConferenceController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('conference_id')) {
            return response()->json(
                SessionConference::where('conference_id', $request->conference_id)->get()
            );
        }
        return response()->json(SessionConference::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'         => 'required|string',
            'type'          => 'required|string',
            'horaire_debut' => 'required|date',
            'horaire_fin'   => 'required|date|after:horaire_debut',
            'capacite'      => 'required|integer|min:1',
            'conference_id' => 'required|exists:conferences,id',
        ]);

        return response()->json(SessionConference::create($data), 201);
    }

    public function show(SessionConference $sessionConference)
    {
        return response()->json($sessionConference->load('articles'));
    }

    public function update(Request $request, SessionConference $sessionConference)
    {
        $data = $request->validate([
            'titre'         => 'sometimes|string',
            'type'          => 'sometimes|string',
            'horaire_debut' => 'sometimes|date',
            'horaire_fin'   => 'sometimes|date|after:horaire_debut',
            'capacite'      => 'sometimes|integer|min:1',
            'conference_id' => 'sometimes|exists:conferences,id',
        ]);

        $sessionConference->update($data);
        return response()->json($sessionConference);
    }

    public function destroy(SessionConference $sessionConference)
    {
        $sessionConference->delete();
        return response()->noContent();
    }
}