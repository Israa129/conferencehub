<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token'      => Hash::make($token),
                'created_at' => Carbon::now()
            ]
        );

        $resetUrl = "http://localhost:4200/reset-password?token={$token}&email={$request->email}";

        try {
            Mail::send(
                'emails.reset_password',
                ['resetUrl' => $resetUrl],
                function ($message) use ($request) {
                    $message->to($request->email)
                            ->subject('Réinitialisation - ConférenceHub');
                }
            );
        } catch (\Exception $e) {
            \Log::error('Email error: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Un lien de réinitialisation a été envoyé à votre email.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'token'    => 'required',
            'password' => 'required|min:6|confirmed'
        ]);

        $record = DB::table('password_reset_tokens')
                    ->where('email', $request->email)
                    ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Token invalide ou expiré.'], 400);
        }

        if (Carbon::parse($record->created_at)->addHour()->isPast()) {
            return response()->json(['message' => 'Le lien a expiré.'], 400);
        }

        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password)
        ]);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }
}