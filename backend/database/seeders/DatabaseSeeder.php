<?php

namespace Database\Seeders;

use App\Models\AccountInformation;
use App\Models\Category;
use App\Models\Domain;
use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\WebsiteUrl;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
//         User::factory(10)->create();
//         Category::factory(5)->create();
//         Domain::factory(30)->create();
//         WebsiteUrl::factory(50)->create();

        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@admin.com',
            'two_step_auth' => true,
            "status" => 'approved',
            'access_token' => Str::random(8),
        ]);

        $adminUser = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            "status" => 'approved',
            'access_token' => Str::random(8),
        ]);

        $normalUser = User::factory()->create([
            'name' => 'Normal User',
            'email' => 'user@user.com',
            "status" => 'approved',
            'team_id' => $adminUser->id,
            'access_token' => Str::random(8),
        ]);

        $superAdminRole = Role::create(['name' => 'super-admin']);
        $adminUserRole = Role::create(['name' => 'admin-user']);
        $normalUserRole = Role::create(['name' => 'normal-user']);

        $superAdmin->roles()->attach($superAdminRole);
        $adminUser->roles()->attach($adminUserRole);
        $normalUser->roles()->attach($normalUserRole);

        AccountInformation::factory(50)->create();
    }
}
