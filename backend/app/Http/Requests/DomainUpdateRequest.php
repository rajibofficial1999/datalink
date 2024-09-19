<?php

namespace App\Http\Requests;

use App\Rules\ValidDomain;
use App\Rules\ValidSkypeUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DomainUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $domainId = $this->domain_id;

        return [
            'domain' => [
                'required',
                'max:255',
                Rule::unique('domains', 'name')->ignore($domainId),
                new ValidDomain
            ],
            'skype_url' => ['required','max:255', new ValidSkypeUrl],
            'screenshot' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'domain_id' => 'required|numeric|exists:domains,id',
        ];
    }
}
