<?php

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");
        // Payload is not send to $_POST Variable,
        // is send to php:input as a text
        $json = file_get_contents('php://input');
        //parse the Payload from text format to Object
        $params = json_decode($json);

        $email = $params->email;
        // Token für den Passwort-Zurücksetzungs-Link generieren
        $token = bin2hex(random_bytes(32));
        $resetLink = "https://dabubble.lars-schumacher.com/reset-password?token=" . urlencode($token);

        $recipient = $email;
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
        $headers = array();
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=utf-8';

        // Additional headers
        $headers[] = "From: noreply@dabubble.com";

        mail($recipient, $subject, $message, implode("\r\n", $headers));
        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}