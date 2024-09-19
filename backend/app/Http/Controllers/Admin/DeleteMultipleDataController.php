<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AccountInformation;
use App\Models\Category;
use App\Models\Domain;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DeleteMultipleDataController extends Controller
{
    public function __invoke(Request $request, $table) {

        // Check if table exists
        if (!Schema::hasTable($table)) {
            throw ValidationException::withMessages([
                'errors' => ["Table '{$table}' not found."]
            ]);
        }

        // Validate the request data
        $data = $request->validate([
            'data_ids' => 'required|array',
            'data_ids.*' => ['required', 'numeric', "exists:{$table},id"],
        ]);

        // Get the model class for the table
        $model = $this->getModelByTableName($table);

        // Check if model class exists
        if (!$model) {
            throw ValidationException::withMessages([
                'errors' => ["Model for table '{$table}' not found."]
            ]);
        }

        //  Delete all child Data like image. file,
        $this->deleteModelData($model, $table,  $data['data_ids']);

        //  Delete all selected records,
        $model::whereIn('id', $data['data_ids'])->delete();

        // Return a response indicating success
        return response()->json([
            'success' => 'Records deleted successfully',
        ], Response::HTTP_OK);
    }

    protected function getModelByTableName(string $tableName): ?string
    {
        $mapping = [
            'users' => User::class,
            'categories' => Category::class,
            'domains' => Domain::class,
            'account_information' => AccountInformation::class,
        ];

        return $mapping[$tableName] ?? null;
    }

    protected function deleteModelData(string $model, string $table, array $ids): void
    {
        if($table == 'domains'){
            $domains = $model::whereIn('id', $ids)->get();
            foreach ($domains as $domain) {
                if(Storage::disk('public')->exists($domain->screenshot)){
                    Storage::disk('public')->delete($domain->screenshot);
                }
            }
        }

        if($table == 'users'){
            $users = $model::whereIn('id', $ids)->get();
            foreach ($users as $user) {
                if(Storage::disk('public')->exists($user->avatar)){
                    Storage::disk('public')->delete($user->avatar);
                }
            }
        }

        if($table == 'account_information'){
            $accounts = $model::whereIn('id', $ids)->get();
            foreach ($accounts as $account) {
                if(Storage::disk('public')->exists($account->nid_front)){
                    Storage::disk('public')->delete($account->nid_front);
                }

                if(Storage::disk('public')->exists($account->nid_back)){
                    Storage::disk('public')->delete($account->nid_back);
                }

                if(Storage::disk('public')->exists($account->selfie)){
                    Storage::disk('public')->delete($account->selfie);
                }
            }
        }
    }
}
