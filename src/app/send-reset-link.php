<?php
// CORS-Header hinzufügen
header("Access-Control-Allow-Origin: *"); // Erlaube Anfragen von allen Ursprüngen
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Erlaube POST, GET und OPTIONS Methoden
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Erlaube Content-Type und Authorization Header

// Überprüfe, ob die Anfrage eine OPTIONS-Anfrage ist
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    // Beende die Verarbeitung für OPTIONS-Anfragen und sende nur die Header zurück
    exit(0);
}

// Rest des Codes...
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Überprüfe, ob die E-Mail-Adresse im POST-Body existiert
    if (isset($_POST['email'])) {
        $email = $_POST['email'];

        // Token für den Passwort-Zurücksetzungs-Link generieren
        $token = bin2hex(random_bytes(32));
        $resetLink = "https://dabubble.lars-schumacher.com/reset-password?token=" . urlencode($token);

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

        // Kopfzeilen für die HTML-E-Mail
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-Type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: noreply@dabubble.com" . "\r\n";

        // E-Mail senden
        if (mail($to, $subject, $message, $headers)) {
            echo json_encode(["status" => "success", "message" => "E-Mail wurde gesendet."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Fehler beim Versenden der E-Mail."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Ungültige E-Mail-Adresse."]);
    }
}
?>
