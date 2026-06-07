<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\SessionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
// Test
Route::get('/test', function () {
    return response()->json(['message' => 'ConférenceHub API fonctionne !', 'status' => 'ok']);
});

// Auth publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::apiResource('conferences', ConferenceController::class);
Route::apiResource('sessions', SessionController::class);

// Auth protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
Route::prefix('conferencier')->group(function () {
    Route::get('/stats',                  [ArticleController::class, 'stats']);
    Route::get('/articles',               [ArticleController::class, 'index']);
    Route::post('/articles',              [ArticleController::class, 'store']);
    Route::get('/articles/{id}',          [ArticleController::class, 'show']);
    Route::post('/articles/{id}',         [ArticleController::class, 'update']);
    Route::delete('/articles/{id}',       [ArticleController::class, 'destroy']);
    Route::get('/articles/{id}/download', [ArticleController::class, 'download']);
});