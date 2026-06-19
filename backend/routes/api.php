<?php

use Illuminate\Http\Request;
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
<<<<<<< Updated upstream
Route::apiResource('sessions', SessionController::class);

// Auth protégées
=======
Route::apiResource('sessions',    SessionConferenceController::class);
Route::post('/conferencier/articles/{id}/statut', [ArticleController::class, 'changerStatut']);
Route::get('/conferences/organisateur/{organisateur_id}', [ConferenceController::class, 'getByOrganisateur']);
Route::get('/dashboard/stats/{organisateur_id}', [OrganisateurDashboardController::class, 'getDashboardStats']);
>>>>>>> Stashed changes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
});