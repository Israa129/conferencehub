<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use Illuminate\Http\Request;

class ConferenceController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('search')) {
            return Conference::where('titre', 'like', '%' . $request->search . '%')
                ->orWhere('theme', 'like', '%' . $request->search . '%')
                ->get();
        }
        return Conference::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'          => 'required|string',
            'description'    => 'required|string',
            'theme'          => 'required|string',
            'lieu'           => 'required|string',
            'date_debut'     => 'required|date',
            'date_fin'       => 'required|date|after:date_debut',
            'organisateur_id'=> 'required|exists:users,id',
        ]);

        return response()->json(Conference::create($data), 201);
    }

    public function show(Conference $conference)
    {
        return response()->json($conference->load(['sessionsConference', 'inscriptions']));
    }

    public function update(Request $request, Conference $conference)
    {
        $data = $request->validate([
            'titre'          => 'sometimes|string',
            'description'    => 'sometimes|string',
            'theme'          => 'sometimes|string',
            'lieu'           => 'sometimes|string',
            'date_debut'     => 'sometimes|date',
            'date_fin'       => 'sometimes|date|after:date_debut',
            'organisateur_id'=> 'sometimes|exists:users,id',
        ]);

        $conference->update($data);
        return response()->json($conference);
    }

    public function destroy(Conference $conference)
    {
        $conference->delete();
        return response()->noContent();
    }
    public function getByOrganisateur($organisateur_id)
    {
        $conferences = Conference::where('organisateur_id', $organisateur_id)->get();

         Log::info('Récupération des conférences pour l\'organisateur', [
            'organisateur_id' => $organisateur_id,
            'nombre_conferences' => $conferences->count()
        ]);
        
        return response()->json($conferences);
    }
}