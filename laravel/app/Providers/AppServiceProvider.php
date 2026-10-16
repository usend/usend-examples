public function register(): void
{
    $this->app->singleton(\Usend\Client::class, fn () => new \Usend\Client(config('services.usend.key')));
}
