<?php

namespace App\Services;

use App\Models\Article;

class ArticleService
{
    public function list(array $filters = [])
    {
        $query = Article::query();

        if (isset($filters['conferencier_id'])) {
            $query->byConferencier($filters['conferencier_id']);
        }
        if (isset($filters['statut'])) {
            $query->byStatut($filters['statut']);
        }
        if (isset($filters['conference_id'])) {
            $query->where('conference_id', $filters['conference_id']);
        }

        return $query->orderBy('created_at', 'desc')->get()->map(function ($article) {
            $data = $article->toArray();
            $data['_id'] = (string) $article->_id;
            return $data;
        });
    }

    public function find(string $id)
    {
        return Article::find($id);
    }

    public function create(array $data)
    {
        $article = Article::create($data);
        $result = $article->toArray();
        $result['_id'] = (string) $article->_id;
        return $result;
    }

    public function update(string $id, array $data)
    {
        $article = Article::find($id);
        if (!$article) return null;
        $article->update($data);
        return $article->fresh();
    }

    public function delete(string $id): bool
    {
        $article = Article::find($id);
        if (!$article) return false;
        return $article->delete();
    }
}