<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;

class ApiPostRegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'first_name' => ['string', 'max:255','required'],
            'last_name' => ['string', 'max:255','required'],
            'company_id' => ['string', 'max:255','unique:users','required'],
            'password' => ['string', 'confirmed','required','min:6'],
            'team_id' => ['required','exists:App\Models\Team,id'],
            'site'=> ['required',Rule::in(['Manila', 'Leyte'])]
        ];
    }

    public function failedValidation(Validator $validator){

        throw new HttpResponseException(response()->json([

            'success'   => false,

            'message'   => 'Validation errors',

            'data'      => $validator->errors()

        ]));

    }
    

    

    
}
