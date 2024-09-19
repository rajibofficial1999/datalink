<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DomainStatus;
use App\Http\Controllers\Controller;
use App\Models\Domain;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PendingDomainController extends Controller
{
    public function index(Request $request)
    {

        $authUser = $request->user();

        $domains = [];
        if($authUser->isAdmin || $authUser->isSuperAdmin) {
            $domains = Domain::query()
                ->with('user')
                ->where('status', DomainStatus::PENDING)
                ->when($authUser->isAdmin, function ($query) use ($authUser) {
                    return $authUser->domains()
                        ->with('user')
                        ->where('status', DomainStatus::PENDING);
                })
                ->latest()
                ->paginate(10);
        }


        return response()->json([
            'domains' => $domains,
            'status' => DomainStatus::cases()
        ], Response::HTTP_OK);
    }
}
