<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    private UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository) 
    {
        $this->userRepository = $userRepository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return  $this->userRepository->index();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->only(
                        'doti','fullnamear','fullnamela',
                        'codegresa','password','idDepartement',
                        'email','CIN','online',
                        'roles','phone');
        $validator = Validator::make($data, [
            'password' => 'string|min:6|max:50',
            'fullnamear' => 'required|string',
            'fullnamela' => 'required|string',
            'email' => 'required|string|email',
            'online' => 'required',
            'roles' => 'string',
            'doti' => 'required|string',
            'CIN'=>'required|string'
        ]);
            //Send failed response if request is not valid
        if ($validator->fails())
            return response()->json("register/fields_required", 500);
    
        return $this->userRepository->create($data);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($doti)
    {
        return $this->userRepository->show($doti);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->only(
            'doti','fullnamear','fullnamela',
            'codegresa','password','idDepartement',
            'email','CIN',
            'roles','phone');
        $validator = Validator::make($data, [
            'fullnamear' => 'required|string',
            'fullnamela' => 'required|string',
            'email' => 'required|string|email',
            'roles' => 'string',
            'doti' => 'required|string',
            'CIN'=>'required|string',
            'phone'=>"required|string"
        ]);
        if ($validator->fails())
            return response()->json(["edit_user/fields_required"], 500);
        return $this->userRepository->update($data,$id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->userRepository->destroy($id);
    }

    /**
     * Authentification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        error_log("hi");
        $credentials = $request->only('doti', 'password');
        //valid credential
        $validator = Validator::make($credentials, [
            'doti' => 'required',
            'password' => 'required|string|min:6|max:50'
        ]);
        //Send failed response if request is not valid
        if ($validator->fails())
            return response()->json('credentials/empty', 500);
        
        return $this->userRepository->login($credentials);
    }
    /**
     * Logout.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $validator = Validator::make($request->only('token'), [
            'token' => 'required'
        ]);

        //Send failed response if request is not valid
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 200);
        }
        return $this->userRepository->logout($request->token);
    }
    public function ChangePassword($doti,$password,$currentPassword){
        return $this->userRepository->ChangePassword($doti,$password,$currentPassword);
    }
    public function ResetPassword($doti,$cin){
        return $this->userRepository->ResetPassword($doti,$cin);
    }
    public static function refreshToken($token){
        error_log("f");
        return response()->json($token);
    }
}
