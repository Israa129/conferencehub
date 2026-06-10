<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ── Test ────────────────────────────────────────
Route::get('/test', function () {
    return response()->json([
        'message' => 'ConférenceHub API fonctionne !',
        'status'  => 'ok'
    ]);
});

// ── Auth publiques ──────────────────────────────
Route::post('/register',        [AuthController::class, 'register']);
Route::post('/login',           [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);

// ── Publiques ───────────────────────────────────
Route::apiResource('conferences', ConferenceController::class);
Route::apiResource('sessions',    SessionController::class);

// ── Auth protégées ──────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Conférencier
    Route::prefix('conferencier')->group(function () {
        Route::get('/stats',                  [ArticleController::class, 'stats']);
        Route::get('/articles',               [ArticleController::class, 'index']);
        Route::post('/articles',              [ArticleController::class, 'store']);
        Route::get('/articles/{id}',          [ArticleController::class, 'show']);
        Route::post('/articles/{id}',         [ArticleController::class, 'update']);
        Route::delete('/articles/{id}',       [ArticleController::class, 'destroy']);
        Route::get('/articles/{id}/download', [ArticleController::class, 'download']);
    });

    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::get('/stats',                    [AdminController::class, 'stats']);
        Route::get('/utilisateurs',             [AdminController::class, 'utilisateurs']);
        Route::put('/utilisateurs/{id}/role',   [AdminController::class, 'updateRole']);
        Route::put('/utilisateurs/{id}/statut', [AdminController::class, 'toggleStatut']);
        Route::delete('/utilisateurs/{id}',     [AdminController::class, 'deleteUser']);
    });

});