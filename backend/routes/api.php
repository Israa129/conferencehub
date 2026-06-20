<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\SessionConferenceController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrganisateurDashboardController;
use App\Http\Controllers\ParticipantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\SettingsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test', function () {
    return response()->json(['message' => 'ConférenceHub API fonctionne !', 'status' => 'ok']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::apiResource('conferences', ConferenceController::class);
Route::apiResource('sessions',    SessionConferenceController::class);
Route::post('/conferencier/articles/{id}/statut', [ArticleController::class, 'changerStatut']);
Route::get('/conferences/organisateur/{organisateur_id}', [ConferenceController::class, 'getByOrganisateur']);
Route::get('/dashboard/stats/{organisateur_id}', [OrganisateurDashboardController::class, 'getDashboardStats']);
Route::get('/conferencier/articles-organisateur', [ArticleController::class, 'byOrganisateur']);
Route::get('organisateur/dashboard-stats', [OrganisateurDashboardController::class, 'getDashboardStats']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::prefix('admin')->group(function () {
        Route::get('/dashboard',                [AdminController::class, 'dashboard']);
        Route::get('/stats',                    [AdminController::class, 'stats']);
        Route::get('/utilisateurs',             [AdminController::class, 'utilisateurs']);
        Route::put('/utilisateurs/{id}/role',   [AdminController::class, 'updateRole']);
        Route::put('/utilisateurs/{id}/statut', [AdminController::class, 'toggleStatut']);
        Route::delete('/utilisateurs/{id}',     [AdminController::class, 'deleteUser']);
        Route::get('/analytics',                [AnalyticsController::class, 'index']);
        Route::get('/audit-logs',               [AuditLogController::class, 'index']);
        Route::get('/audit-logs/actions',       [AuditLogController::class, 'actions']);
    });

   Route::prefix('settings')->group(function () {
    Route::get('/',                  [SettingsController::class, 'index']);
    Route::put('/password',          [SettingsController::class, 'updatePassword']);
    Route::put('/notifications',     [SettingsController::class, 'updateNotifications']);
    Route::put('/display',           [SettingsController::class, 'updateDisplay']);
    Route::put('/privacy',           [SettingsController::class, 'updatePrivacy']);
    Route::delete('/account',        [SettingsController::class, 'deleteAccount']);
});
    Route::prefix('participant')->group(function () {
        Route::get('/dashboard',           [ParticipantController::class, 'dashboard']);
        Route::get('/qr-code',             [ParticipantController::class, 'qrCode']);
        Route::get('/inscriptions',        [ParticipantController::class, 'inscriptions']);
        Route::get('/inscriptions/{id}',   [ParticipantController::class, 'inscription']);
    });

    Route::get('/profile',          [ProfileController::class, 'show']);
    Route::put('/profile',          [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
});
// Routes conférencier (pas encore protégées par auth:sanctum)
Route::prefix('conferencier')->group(function () {
    Route::get('/stats',                  [ArticleController::class, 'stats']);
    Route::get('/articles',               [ArticleController::class, 'index']);
    Route::post('/articles',              [ArticleController::class, 'store']);
    Route::get('/articles/{id}',          [ArticleController::class, 'show']);
    Route::post('/articles/{id}',         [ArticleController::class, 'update']);
    Route::delete('/articles/{id}',       [ArticleController::class, 'destroy']);
    Route::get('/articles/{id}/download', [ArticleController::class, 'download']);
});
Route::get('/users/{id}/name', [AuthController::class, 'getNameById']);
Route::get('/organisateur/dashboard-stats/logs/{organisateur_id}', [ConferenceController::class, 'statsParOrganisateur']);