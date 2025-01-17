<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email']; // Die E-Mail-Adresse des Benutzers

    // Generiere den Reset-Link
    $token = bin2hex(random_bytes(32)); // Token generieren (32 Bytes)
    $resetLink = "https://dabubble.com/reset-password?token=" . urlencode($token);

    // E-Mail-Details
    $to = $email;
    $subject = "Passwort zurücksetzen";
    $message = "
    <html>
    <head>
    <title>Passwort zurücksetzen</title>
    </head>
    <body>
    <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
    <p>Um fortzufahren, klicken Sie auf den folgenden Link:</p>
    <a href='$resetLink'>$resetLink</a>
    </body>
    </html>
    ";

    // Kopfzeilen für HTML-E-Mail
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: noreply@dabubble.com" . "\r\n";

    // Versenden der E-Mail
    if (mail($to, $subject, $message, $headers)) {
        echo "Passwort-Zurücksetzungs-E-Mail wurde gesendet.";
    } else {
        echo "Fehler beim Versenden der E-Mail.";
    }
}
?>
