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
        $categories = Category::query()->paginate(10);

        return response()->json($categories, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Category::class);

        $data = $request->validate([
            'name' => 'required|string|unique:categories,name|max:255',
        ]);

        Category::create($data);

        return response()->json(['success' => 'Category has been created successfully.'], Response::HTTP_CREATED);
    }

    public function show(Category $category)
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
        Gate::authorize('update',$category);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($category->id),],
        ]);


        $category->update($data);

        return response()->json([
            'success' => 'Category has been updated successfully.',
            'category' => $category,
        ], Response::HTTP_OK);
    }
}
