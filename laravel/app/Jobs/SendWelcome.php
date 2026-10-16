public function handle(\Usend\Client $usend): void
{
    $usend->emails->send([
        'from' => 'Acme <hello@acme.com>',
        'to' => [$this->user->email],
        'subject' => 'Welcome',
        'html' => view('emails.welcome', ['user' => $this->user])->render(),
    ], "welcome-{$this->user->id}");
}
