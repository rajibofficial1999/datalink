<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AccountInformation>
 */
class AccountInformationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "user_id" => User::query()->inRandomOrder()->first()->id,
            "category_id" => Category::factory(),
            "email" => fake()->email(),
            "password" => fake()->password(),
            "otp_code" => random_int(100000, 999999),
            "nid_front" => fake()->imageUrl(),
            "nid_back" => fake()->imageUrl(),
            "user_agent" => fake()->userAgent(),
        ];
    }
}
