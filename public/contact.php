<?php
// Contact form handler for Plesk (PHP 8). Emails each message from /contact to info@twinlink.eu.
// The page posts here with JavaScript and gets JSON back; without JavaScript the visitor is sent
// back to /contact?sent=1 (or ?sent=0). On the Netlify preview, Netlify Forms catches the post instead.

const TO = 'info@twinlink.eu';
const FROM = 'website@twinlink.eu'; // must be an address on this domain, so the mail is not marked as spam

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function reply(bool $ok, string $error = ''): never {
    global $wantsJson;
    if ($wantsJson) {
        http_response_code($ok ? 200 : 400);
        header('Content-Type: application/json');
        echo json_encode(['ok' => $ok, 'error' => $error]);
    } else {
        header('Location: /contact?sent=' . ($ok ? '1' : '0'), true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(false, 'method');

// Bots fill in the hidden field; pretend it worked.
if (trim($_POST['company-website'] ?? '') !== '') reply(true);

$clean = fn (string $key, int $max) => mb_substr(trim((string) ($_POST[$key] ?? '')), 0, $max);
$name = $clean('name', 200);
$email = $clean('email', 200);
$subject = $clean('subject', 200);
$message = $clean('message', 5000);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) reply(false, 'fields');

// No line breaks in anything that ends up in a mail header.
$oneLine = fn (string $s) => preg_replace('/[\r\n]+/', ' ', $s);
$name = $oneLine($name);
$subject = $oneLine($subject);

$mailSubject = 'Website contact: ' . ($subject !== '' ? $subject : $name);
$body = "Name: {$name}\nE-mail: {$email}\nSubject: {$subject}\n\n{$message}\n\n--\nSent with the contact form on twinlink.eu";
$headers = [
    'From' => 'twinlink.eu website <' . FROM . '>',
    'Reply-To' => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'twinlink.eu contact form',
];

$sent = mail(TO, '=?UTF-8?B?' . base64_encode($mailSubject) . '?=', $body, $headers, '-f' . FROM);
reply($sent, $sent ? '' : 'mail');
