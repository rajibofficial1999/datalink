<?php

namespace App\Providers;

use App\Models\AccountInformation;
use App\Models\Category;
use App\Models\Domain;
use App\Models\User;
use App\Models\WebsiteUrl;
use App\Policies\AccountInformationPolicy;
use App\Policies\CategoryPolicy;
use App\Policies\DomainPolicy;
use App\Policies\UserPolicy;
use App\Policies\WebsiteUrlPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(Domain::class, DomainPolicy::class);
        Gate::policy(WebsiteUrl::class, WebsiteUrlPolicy::class);
        Gate::policy(AccountInformation::class, AccountInformationPolicy::class);
    }
}
