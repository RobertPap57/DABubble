<?php
switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"):
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"):
        header("Access-Control-Allow-Origin: *");
        $json = file_get_contents('php://input');
        $params = json_decode($json);
        $email = $params->email;
        $token = $params->token;
        $resetLink = "https://dabubble.lars-schumacher.com/reset-password/" . urlencode($token);
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
        $headers[] = "From: noreply@dabubble.com";
        mail($recipient, $subject, $message, implode("\r\n", $headers));
        break;
    default:
        header("Allow: POST", true, 405);
        exit;
}