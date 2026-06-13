<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f0f2f5; padding: 20px; }
    .card {
      background: white;
      max-width: 500px;
      margin: auto;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h2 { color: #2563eb; margin-bottom: 0.5rem; }
    p  { color: #555; line-height: 1.6; }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 1.5rem 0;
    }
    .footer { color: #999; font-size: 0.8rem; margin-top: 1.5rem; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🏛️ ConférenceHub</h2>
    <h3>Réinitialisation de mot de passe</h3>
    <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
    <a href="{{ $resetUrl }}" class="btn">Réinitialiser mon mot de passe</a>
    <p>Ce lien expire dans <strong>1 heure</strong>.</p>
    <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    <div class="footer">© 2026 ConférenceHub - UTBM</div>
  </div>
</body>
</html>