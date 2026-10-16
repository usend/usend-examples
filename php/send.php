<?php
require 'vendor/autoload.php';

$usend = new Usend\Client(getenv('USEND_API_KEY'));

try {
    $email = $usend->emails->send([
        'from' => 'Acme <hello@acme.com>',
        'to' => ['ann@example.com'],
        'subject' => 'Hello from usend',
        'html' => '<p>It works!</p>',
    ], 'welcome-ann-1'); // optional idempotency key
    echo "queued {$email['id']}\n";
} catch (Usend\UsendException $e) {
    fwrite(STDERR, "{$e->getStatusCode()} {$e->getErrorName()}: {$e->getMessage()}\n");
    exit(1);
}
