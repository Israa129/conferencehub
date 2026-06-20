<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    /**
     * GET /api/conferencier/articles
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->header('X-User-Id');

        $query = Article::with(['conference', 'session'])
            ->where('user_id', $userId);

        if ($request->has('statut') && $request->statut !== 'tous') {
            $query->where('statut', $request->statut);
        }
        if ($request->has('conference_id')) {
            $query->where('conference_id', $request->conference_id);
        }

        $articles = $query->orderBy('created_at', 'desc')->get();

        $mapped = $articles->map(fn($a) => $this->formatArticle($a));

        $stats = [
            'total'          => $articles->count(),
            'en_revision'    => $articles->where('statut', 'en_revision')->count(),
            'accepte'        => $articles->where('statut', 'accepte')->count(),
            'refuse'         => $articles->where('statut', 'refuse')->count(),
            'par_conference' => $articles->groupBy('conference_id')
                ->map(fn($g) => $g->count())->toArray(),
        ];

        return response()->json(['success' => true, 'data' => $mapped, 'stats' => $stats]);
    }

    /**
     * POST /api/conferencier/articles
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'titre'         => 'required|string|max:255',
            'resume'        => 'required|string|max:2000',
            'mots_cles'     => 'required|array|min:1',
            'mots_cles.*'   => 'string|max:50',
            'conference_id' => 'required|integer|exists:conferences,id',
            'session_id'    => 'nullable|integer|exists:sessions_conference,id',
            'fichier_pdf'   => 'required|file|mimes:pdf|max:10240',
        ]);

        $userId = $request->header('X-User-Id');

        $fichier    = $request->file('fichier_pdf');
        $nomFichier = Str::uuid() . '_' . Str::slug($request->titre) . '.pdf';
        $chemin     = $fichier->storeAs('articles', $nomFichier, 'public');

        $article = Article::create([
            'user_id'       => $userId,
            'conference_id' => $request->conference_id,
            'session_id'    => $request->session_id ?? null,
            'titre'         => $request->titre,
            'resume'        => $request->resume,
            'mots_cles'     => $request->mots_cles,
            'fichier_pdf'   => $chemin,
            'statut'        => 'en_revision',
            'commentaires'  => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Article soumis avec succès.',
            'data'    => $this->formatArticle($article->load(['conference', 'session'])),
        ], 201);
    }

    /**
     * POST /api/conferencier/articles/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $userId  = $request->header('X-User-Id');
        $article = Article::where('id', $id)->where('user_id', $userId)->firstOrFail();

        if ($article->statut !== 'en_revision') {
            return response()->json(['success' => false, 'message' => 'Modification impossible.'], 403);
        }

        $request->validate([
            'titre'       => 'sometimes|string|max:255',
            'resume'      => 'sometimes|string|max:2000',
            'mots_cles'   => 'sometimes|array|min:1',
            'mots_cles.*' => 'string|max:50',
            'session_id'  => 'nullable|integer|exists:sessions_conference,id',
            'fichier_pdf' => 'sometimes|file|mimes:pdf|max:10240',
        ]);

        $data = $request->only(['titre', 'resume', 'mots_cles', 'session_id']);

        if ($request->hasFile('fichier_pdf')) {
            if ($article->fichier_pdf) Storage::disk('public')->delete($article->fichier_pdf);
            $fichier = $request->file('fichier_pdf');
            $nomFichier = Str::uuid() . '_' . Str::slug($request->titre ?? $article->titre) . '.pdf';
            $data['fichier_pdf'] = $fichier->storeAs('articles', $nomFichier, 'public');
        }

        $article->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Article mis à jour.',
            'data'    => $this->formatArticle($article->fresh()->load(['conference', 'session'])),
        ]);
    }

    /**
     * DELETE /api/conferencier/articles/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $userId  = $request->header('X-User-Id');
        $article = Article::where('id', $id)->where('user_id', $userId)->firstOrFail();

        if ($article->statut !== 'en_revision') {
            return response()->json(['success' => false, 'message' => 'Suppression impossible.'], 403);
        }

        if ($article->fichier_pdf) Storage::disk('public')->delete($article->fichier_pdf);
        $article->delete();

        return response()->json(['success' => true, 'message' => 'Article supprimé.']);
    }

    /**
     * GET /api/conferencier/articles/{id}/download
     */
    public function download(Request $request, string $id): mixed
    {
        $userId  = $request->header('X-User-Id');
        $article = Article::where('id', $id)->where('user_id', $userId)->firstOrFail();

        if (!$article->fichier_pdf || !Storage::disk('public')->exists($article->fichier_pdf)) {
            return response()->json(['message' => 'Fichier introuvable.'], 404);
        }

        return Storage::disk('public')->download($article->fichier_pdf, Str::slug($article->titre) . '.pdf');
    }

    /**
     * GET /api/conferencier/stats
     */
    public function stats(Request $request): JsonResponse
    {
        $userId   = $request->header('X-User-Id');
        $articles = Article::where('user_id', $userId)->get();

        return response()->json(['success' => true, 'data' => [
            'total'          => $articles->count(),
            'en_revision'    => $articles->where('statut', 'en_revision')->count(),
            'accepte'        => $articles->where('statut', 'accepte')->count(),
            'refuse'         => $articles->where('statut', 'refuse')->count(),
            'par_conference' => $articles->groupBy('conference_id')->map(fn($g) => $g->count())->toArray(),
        ]]);
    }

    /**
     * Formater un article pour Angular (noms de champs compatibles avec le dashboard)
     */
    private function formatArticle(Article $a): array
    {
        return [
            '_id'              => (string) $a->id,
            'titre'            => $a->titre,
            'resume'           => $a->resume,
            'mots_cles'        => $a->mots_cles ?? [],
            'fichier_pdf'      => $a->fichier_pdf,
            'statut'           => $a->statut,
            'commentaires'     => $a->commentaires,
            'conference_id'    => (string) $a->conference_id,
            'conference_nom'   => $a->conference?->titre ?? '',
            'conference_lieu'  => $a->conference?->lieu ?? '',
            'conferencier_id'  => (string) $a->user_id,
            'conferencier_nom' => $a->auteur?->name ?? '',
            'session_assignee' => $a->session?->titre ?? $a->session?->nom ?? '',
            'created_at'       => $a->created_at?->toISOString(),
            'updated_at'       => $a->updated_at?->toISOString(),
        ];
    }

    public function changerStatut(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'statut'       => 'required|in:en_revision,accepte,refuse',
            'commentaires' => 'nullable|string|max:2000',
        ]);

        $article = Article::findOrFail($id);

        $article->update([
            'statut'       => $request->statut,
            'commentaires' => $request->commentaires ?? $article->commentaires,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Le statut de l\'article a été mis à jour.',
            'data'    => $article,
        ]);
    }
}