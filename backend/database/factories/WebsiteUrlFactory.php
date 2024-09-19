<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WebsiteUrl>
 */
class WebsiteUrlFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::query()->inRandomOrder()->firstOrFail()->id,
            'category_id' => Category::query()->inRandomOrder()->firstOrFail()->id,
            'url' => $this->faker->url(),
        ];
    }
}
