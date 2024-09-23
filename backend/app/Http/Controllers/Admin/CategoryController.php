<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::paginate(10);

        return response()->json($categories, Response::HTTP_OK);
    }

    public function store(Request $request): JsonResponse
    {
        Gate::authorize('create', Category::class);

        $data = $this->validateCategory($request);

        Category::create($data);

        return response()->json(['success' => 'Category has been created successfully.'], Response::HTTP_CREATED);
    }

    public function show(Category $category): JsonResponse
    {
        Gate::authorize('view', $category);

        return response()->json($category, Response::HTTP_OK);
    }

    public function destroy(Category $category): JsonResponse
    {
        Gate::authorize('delete', $category);

        $category->delete();

        return response()->json(['success' => 'Category has been deleted successfully.'], Response::HTTP_OK);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        Gate::authorize('update', $category);

        $data = $this->validateCategory($request, $category);

        $category->update($data);

        return response()->json([
            'success' => 'Category has been updated successfully.',
            'category' => $category,
        ], Response::HTTP_OK);
    }

    protected function validateCategory(Request $request, ?Category $category = null): array
    {
        $uniqueRule = Rule::unique('categories', 'name');

        if ($category) {
            $uniqueRule->ignore($category->id);
        }

        return $request->validate([
            'name' => ['required', 'string', 'max:255', $uniqueRule],
        ]);
    }
}
