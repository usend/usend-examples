use Usend\Client;

final class Welcome
{
    public function __construct(private Client $usend) {}

    public function send(string $to): void
    {
        $this->usend->emails->send([
            'from' => 'Acme <hello@acme.com>',
            'to' => [$to],
            'subject' => 'Welcome',
            'html' => '<p>It works!</p>',
        ], 'welcome-' . md5($to));
    }
}
