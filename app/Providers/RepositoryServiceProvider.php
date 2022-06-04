<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\DepartmentRepositoryInterface;
use App\Repositories\DepartmentRepository;
use App\Interfaces\EtablishmentRepositoryInterface;
use App\Repositories\EtablishmentRepository;
use App\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;
use App\Interfaces\CorrespondenceRepositoryInterface;
use App\Repositories\CorrespondenceRepository;
use App\Interfaces\FeedbackRepositoryInterface;
use App\Repositories\FeedbackRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(DepartmentRepositoryInterface::class, DepartmentRepository::class);
        $this->app->bind(EtablishmentRepositoryInterface::class, EtablishmentRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(CorrespondenceRepositoryInterface::class, CorrespondenceRepository::class);
        $this->app->bind(FeedbackRepositoryInterface::class, FeedbackRepository::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
