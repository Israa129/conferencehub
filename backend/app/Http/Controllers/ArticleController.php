<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Services\ArticleService; // On importe ton service !
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    protected $articleService;

    // 1. On injecte proprement ton ArticleService via le constructeur
    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * GET /api/conferencier/articles
     * Liste tous les articles filtrés du conférencier connecté
     */
    public function index(Request $request): JsonResponse
    {
        $conferencier_id = $request->user()->id ?? $request->header('X-User-Id');

        // On prépare les filtres pour le Service
        $filters = [
            'conferencier_id' => $conferencier_id
        ];

        if ($request->has('statut') && $request->statut !== 'tous') {
            $filters['statut'] = $request->statut;
        }
        if ($request->has('conference_id')) {
            $filters['conference_id'] = $request->conference_id;
        }

        // 2. On utilise TON service pour récupérer la liste filtrée
        $articles = $this->articleService->list($filters);

        // Statistiques calculées à la volée pour Angular
        $stats = [
            'total'       => $articles->count(),
            'en_revision' => $articles->where('statut', 'en_revision')->count(),
            'accepte'     => $articles->where('statut', 'accepte')->count(),
            'refuse'      => $articles->where('statut', 'refuse')->count(),
        ];

        return response()->json([
            'success' => true,
            'data'    => $articles,
            'stats'   => $stats,
        ]);
    }

    /**
     * GET /api/conferencier/articles/{id}
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $conferencier_id = $request->user()->id ?? $request->header('X-User-Id');
        
        // Sécurité : On s'assure que l'article appartienne bien au conférencier connecté
        $article = Article::where('id', $id)->where('conferencier_id', $conferencier_id)->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => $article,
        ]);
    }

    /**
     * POST /api/conferencier/articles
     * Soumettre un nouvel article
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'titre'         => 'required|string|max:255',
            'resume'        => 'required|string|max:2000',
            'mots_cles'     => 'required|array|min:1|max:10',
            'mots_cles.*'   => 'string|max:50',
            'conference_id' => 'required|string',
            'fichier_pdf'   => 'required|file|mimes:pdf|max:10240', // 10MB max
        ]);

        // Upload PDF
        $fichier = $request->file('fichier_pdf');
        $nomFichier = Str::uuid() . '_' . Str::slug($request->titre) . '.pdf';
        $chemin = $fichier->storeAs('articles', $nomFichier, 'public');

        $conferencier_id = $request->user()->id ?? $request->header('X-User-Id');

        // 3. On passe par ton service pour la création
        $article = $this->articleService->create([
            'titre'            => $request->titre,
            'resume'           => $request->resume,
            'mots_cles'        => $request->mots_cles,
            'fichier_pdf'      => $chemin,
            'statut'           => 'en_revision',
            'conference_id'    => $request->conference_id,
            'conference_nom'   => $request->conference_nom ?? '',
            'conference_lieu'  => $request->conference_lieu ?? '',
            'conferencier_id'  => $conferencier_id,
            'conferencier_nom' => $request->user()->name ?? $request->header('X-User-Name'),
            'commentaires'     => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Article soumis avec succès.',
            'data'    => $article,
        ], 201);
    }

    /**
     * POST /api/conferencier/articles/{id} (Utilisé pour l'update multipart)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $conferencier_id = $request->user()->id ?? $request->header('X-User-Id');
        
        // Sécurité : Vérifier le propriétaire
        $article = Article::where('id', $id)->where('conferencier_id', $conferencier_id)->firstOrFail();

        if ($article->statut !== 'en_revision') {
            return response()->json([
                'success' => false,
                'message' => 'Modification impossible : l\'article n\'est plus en révision.',
            ], 403);
        }

        $request->validate([
            'titre'       => 'sometimes|string|max:255',
            'resume'      => 'sometimes|string|max:2000',
            'mots_cles'   => 'sometimes|array|min:1|max:10',
            'mots_cles.*' => 'string|max:50',
            'fichier_pdf' => 'sometimes|file|mimes:pdf|max:10240',
        ]);

        $data = $request->only(['titre', 'resume', 'mots_cles']);

        // Nouveau PDF si fourni
        if ($request->hasFile('fichier_pdf')) {
            if ($article->fichier_pdf) {
                Storage::disk('public')->delete($article->fichier_pdf);
            }
            $fichier    = $request->file('fichier_pdf');
            $nomFichier = Str::uuid() . '_' . Str::slug($request->titre ?? $article->titre) . '.pdf';
            $data['fichier_pdf'] = $fichier->storeAs('articles', $nomFichier, 'public');
        }

        // 4. On passe par ton service pour l'update
        $updatedArticle = $this->articleService->update($id, $data);

        return response()->json([
            'success' => true,
            'message' => 'Article mis à jour.',
            'data'    => $updatedArticle,
        ]);
    }

    /**
     * DELETE /api/conferencier/articles/{id}
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $conferencier_id = $request->user()->id ?? $request->header('X-User-Id');
        $article = Article::where('id', $id)->where('conferencier_id', $conferencier_id)->firstOrFail();

        if ($article->statut !== 'en_revision') {
            return response()->json([
                'success' => false,
                'message' => 'Suppression impossible : seuls les articles en révision peuvent être supprimés.',
            ], 403);
        }

        if ($article->fichier_pdf) {
            Storage::disk('public')->delete($article->fichier_pdf);
        }

        // 5. On utilise ton service pour supprimer
        $this->articleService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Article supprimé.',
        ]);
    }

    /**
     * GET /api/conferencier/articles/{id}/download
     */
    public function download(Request $request, string $id): mixed
    {
        $conferencier_id = $request->user()->id ?? $request->header('X-User-Id');
        $article = Article::where('id', $id)->where('conferencier_id', $conferencier_id)->firstOrFail();

        if (!$article->fichier_pdf || !Storage::disk('public')->exists($article->fichier_pdf)) {
            return response()->json(['success' => false, 'message' => 'Fichier introuvable.'], 404);
        }

        return Storage::disk('public')->download($article->fichier_pdf, Str::slug($article->titre) . '.pdf');
    }

    /**
     * GET /api/conferencier/stats
     */
    public function stats(Request $request): JsonResponse
    {
        $conferencier_id = $request->user()->id ?? $request->header('X-User-Id');

        // On utilise ton service avec le filtre du conférencier
        $articles = $this->articleService->list(['conferencier_id' => $conferencier_id]);

        $stats = [
            'total'          => $articles->count(),
            'en_revision'    => $articles->where('statut', 'en_revision')->count(),
            'accepte'        => $articles->where('statut', 'accepte')->count(),
            'refuse'         => $articles->where('statut', 'refuse')->count(),
            'par_conference' => $articles->groupBy('conference_nom')
                ->map(fn($g) => $g->count())
                ->toArray(),
        ];

        return response()->json(['success' => true, 'data' => $stats]);
    }
}