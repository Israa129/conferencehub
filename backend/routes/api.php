<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;

Route::prefix('conferencier')->group(function () {
    Route::get('/stats',                  [ArticleController::class, 'stats']);
    Route::get('/articles',               [ArticleController::class, 'index']);
    Route::post('/articles',              [ArticleController::class, 'store']);
    Route::get('/articles/{id}',          [ArticleController::class, 'show']);
    Route::post('/articles/{id}',         [ArticleController::class, 'update']);
    Route::delete('/articles/{id}',       [ArticleController::class, 'destroy']);
    Route::get('/articles/{id}/download', [ArticleController::class, 'download']);
});