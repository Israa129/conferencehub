<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscription;
use App\Models\Conference;
use Carbon\Carbon;

class ParticipantController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        $inscriptions = Inscription::with('conference')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $inscriptionActive = $inscriptions->first();

        // ── Stepper basé sur les vraies colonnes ──
        $inscriptionFaite  = $inscriptionActive !== null;
        $qrGenere          = $inscriptionFaite;
        $attestationDispo  = $inscriptionActive?->pdf_inscription !== null;

        $steps = [
            [
                'label'  => 'Compte créé',
                'date'   => Carbon::parse($user->created_at)->format('d M Y'),
                'done'   => true,
                'active' => false,
            ],
            [
                'label'  => 'Inscription confirmée',
                'date'   => $inscriptionFaite
                    ? Carbon::parse($inscriptionActive->created_at)->format('d M Y')
                    : null,
                'done'   => $inscriptionFaite,
                'active' => false,
            ],
            [
                'label'  => 'QR Code généré',
                'date'   => $qrGenere
                    ? Carbon::parse($inscriptionActive->updated_at)->format('d M Y')
                    : null,
                'done'   => $qrGenere,
                'active' => false,
            ],
            [
                'label'  => 'Attestation PDF',
                'date'   => $attestationDispo
                    ? Carbon::parse($inscriptionActive->updated_at)->format('d M Y')
                    : 'Après la conférence',
                'done'   => $attestationDispo,
                'active' => false,
            ],
        ];

        // ── Prochain événement ──
        $prochainEvenement = null;
        $conferencesAVenir = $inscriptions
            ->filter(fn($i) => $i->conference &&
                Carbon::parse($i->conference->date_debut)->isFuture())
            ->sortBy(fn($i) => $i->conference->date_debut)
            ->first();

        if ($conferencesAVenir) {
            $conf = $conferencesAVenir->conference;
            $diff = Carbon::now()->diff(Carbon::parse($conf->date_debut));
            $prochainEvenement = [
                'conferenceId' => $conf->id,
                'nom'          => $conf->titre,
                'ville'        => $conf->lieu,
                'description'  => $conf->description,
                'adresse'      => $conf->lieu,
                'date_debut'   => $conf->date_debut,
                'date_fin'     => $conf->date_fin,
                'countdown'    => [
                    'jours'   => $diff->days,
                    'heures'  => $diff->h,
                    'minutes' => $diff->i,
                ],
            ];
        }

        $profilPct = $this->calculerProfilPct($user);

        return response()->json([
            'user' => [
                'id'            => $user->id,
                'nom'           => $user->nom,
                'prenom'        => $user->prenom,
                'email'         => $user->email,
                'initiales'     => strtoupper(substr($user->prenom, 0, 1) . substr($user->nom, 0, 1)),
                'participantId' => 'CHB-' . date('Y') . '-' . strtoupper(substr($user->prenom, 0, 2)) . '-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'profilComplet' => $profilPct >= 100,
                'profilPct'     => $profilPct,
            ],
            'inscriptions' => $inscriptions->map(fn($i) => [
                'id'     => $i->id,
                'statut' => 'confirmé',
                'conference' => $i->conference ? [
                    'nom'   => $i->conference->titre,
                    'dates' => Carbon::parse($i->conference->date_debut)->format('d M') .
                               ' – ' .
                               Carbon::parse($i->conference->date_fin)->format('d M Y'),
                    'ville' => $i->conference->lieu,
                ] : null,
            ]),
            'inscriptionActive' => $inscriptionActive ? [
                'id'     => $inscriptionActive->id,
                'statut' => 'confirmé',
                'qrCode' => null,
                'conference' => $inscriptionActive->conference ? [
                    'nom'         => $inscriptionActive->conference->titre,
                    'description' => $inscriptionActive->conference->description,
                    'lieu'        => $inscriptionActive->conference->lieu,
                    'ville'       => $inscriptionActive->conference->lieu,
                    'dates'       => Carbon::parse($inscriptionActive->conference->date_debut)->format('d M') .
                                     ' – ' .
                                     Carbon::parse($inscriptionActive->conference->date_fin)->format('d M Y'),
                    'adresse'     => $inscriptionActive->conference->lieu,
                ] : null,
            ] : null,
            'steps'             => $steps,
            'prochainEvenement' => $prochainEvenement,
        ]);
    }

    private function calculerProfilPct($user): int
    {
        $champs  = ['nom', 'prenom', 'email', 'pays'];
        $remplis = collect($champs)->filter(fn($c) => !empty($user->$c))->count();
        return (int) round(($remplis / count($champs)) * 100);
    }

    public function qrCode(Request $request)
    {
        $user = $request->user();

        $inscription = Inscription::with('conference')
            ->where('user_id', $user->id)
            ->latest()
            ->first();

        if (!$inscription) {
            return response()->json(['message' => 'Aucune inscription'], 404);
        }

        return response()->json([
            'qrData' => json_encode([
                'participantId' => 'CHB-' . date('Y') . '-' . strtoupper(substr($user->prenom, 0, 2)) . '-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'userId'        => $user->id,
                'nom'           => $user->nom . ' ' . $user->prenom,
                'conference'    => $inscription->conference->titre,
                'conferenceId'  => $inscription->conference_id,
                'statut'        => 'confirmé',
            ]),
            'participant' => $user->prenom . ' ' . $user->nom,
            'conference'  => $inscription->conference->titre,
            'statut'      => 'Actif',
        ]);
    }

   public function inscriptions(Request $request)
{
    $user = $request->user();

    $inscriptions = Inscription::with('conference')
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json([
        'inscriptions' => $inscriptions->map(fn($i) => [
            'id'               => $i->id,
            'statut'           => 'confirmé',
            'date_inscription' => Carbon::parse($i->date_inscription ?? $i->created_at)->format('d M Y'),
            'pdf_url'          => $i->pdf_inscription
                ? asset('storage/' . $i->pdf_inscription)
                : null, // null = pas encore disponible
            'conference' => $i->conference ? [
                'id'          => $i->conference->id,
                'nom'         => $i->conference->titre,
                'lieu'        => $i->conference->lieu,
                'dates'       => Carbon::parse($i->conference->date_debut)->format('d M') .
                                 ' – ' .
                                 Carbon::parse($i->conference->date_fin)->format('d M Y'),
            ] : null,
        ]),
    ]);
}

    public function inscription(Request $request, $id)
    {
        $user = $request->user();

        $inscription = Inscription::with('conference')
            ->where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$inscription) {
            return response()->json(['message' => 'Inscription introuvable'], 404);
        }

        return response()->json([
            'id'     => $inscription->id,
            'statut' => 'confirmé',
            'date_inscription' => Carbon::parse($inscription->date_inscription ?? $inscription->created_at)->format('d M Y'),
            'conference' => $inscription->conference ? [
                'id'          => $inscription->conference->id,
                'nom'         => $inscription->conference->titre,
                'description' => $inscription->conference->description,
                'lieu'        => $inscription->conference->lieu,
                'dates'       => Carbon::parse($inscription->conference->date_debut)->format('d M') .
                                 ' – ' .
                                 Carbon::parse($inscription->conference->date_fin)->format('d M Y'),
                'date_debut'  => $inscription->conference->date_debut,
                'date_fin'    => $inscription->conference->date_fin,
            ] : null,
        ]);
    }
}