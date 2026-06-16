<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; 
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

        $conference = Conference::create($data);

        Log::info('Conférence créée avec succès', [
            'id' => $conference->id,
            'titre' => $conference->titre,
            'organisateur_id' => $conference->organisateur_id
        ]);

        return response()->json($conference, 201);
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

        Log::info('Conférence mise à jour', [
            'id' => $conference->id,
            'champs_modifies' => array_keys($data)
        ]);

        return response()->json($conference);
    }

    public function destroy(Conference $conference)
    {
        $oldId = $conference->id;
        $oldTitre = $conference->titre;

        $conference->delete();

        Log::warning('Conférence supprimée', [
            'id' => $oldId,
            'titre' => $oldTitre
        ]);

        return response()->noContent();
    }
}