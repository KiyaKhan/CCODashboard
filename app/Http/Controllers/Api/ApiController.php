<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\APi\ApiPostRegisterRequest;

class ApiController extends Controller
{
    public function register(ApiPostRegisterRequest $request){
        return $request;
    }
}
