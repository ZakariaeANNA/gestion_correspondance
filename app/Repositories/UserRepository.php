<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;
use App\Http\Resources\UserResource;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;


class UserRepository implements UserRepositoryInterface 
{
    public function show($doti){
        $user = User::where('doti','=',$doti)->get();
        return $user;
    }
    public function update($data,$id){
        try{
            $user = User::find($id)->update([
                "fullnamela" => $data["fullnamela"],
                "fullnamear" => $data["fullnamear"],
                "phone" => $data["phone"],
                "email" => $data["email"],
                "doti" => $data["doti"],
                "cin" => $data["CIN"],
                "roles" => $data["roles"],
                "codegresa" => $data["codegresa"] ?? null,
                "idDepartement" => $data["idDepartement"] ?? null
            ]);
        }catch(QueryException $e){
            error_log($e->errorInfo[1]);
            if( $e->errorInfo[1] == 1062 )
                return response("edit_user/user_already_exist",500);
            else if( $e->errorInfo[1] == 1452 )
                return response("edit_user/foreign_not_exist",500);
        }
        return response([]);
    }
    public function index(){
        $users = UserResource::collection(User::all());
        return $users;
    }
    public function create($data) 
    {
        try{
            $user = User::create([
                'idDepartement' => $data['idDepartement'] ?? null,
                'doti' => $data['doti'],
                'online' => $data['online'],
                'codegresa' => $data['codegresa'] ?? null,
                'password' => bcrypt(strtolower($data['CIN'])),
                'fullnamear'  => $data['fullnamear'],
                'fullnamela'  => $data['fullnamela'],
                'email' => $data['email'],
                'phone'=> $data['phone'],
                'roles'=> $data['roles'],
                'cin'=>$data['CIN']
            ]);
        }catch(QueryException $e){
            if( $e->errorInfo[1] == 1062 )
                return response("register/user_already_exist",500);
            else if( $e->errorInfo[1] == 1452 )
                return response("register/foreign_not_exist",500);
        }
        
        return response([]);
    }
    public function destroy($id){
        $user = User::find($id);
        $user->delete();
    }
    public function login($data){
        try {
            if (! $token = JWTAuth::attempt($data)) {
                return response()->json('credentials/false', 500);
            }
        } catch (JWTException $e) {
    	    return $credentials;
            return response()->json([
                	'success' => false,
                	'message' => 'Could not create token.',
                ], 500);
        }	
 		//Token created, return with success response and jwt token
        return response()->json($token);
    }
    
    public function logout($data){
        try {
            JWTAuth::parseToken()->invalidate();
            return response()->json(200);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, user cannot be logged out'
            ], 200);
        }
    }
    public function ChangePassword($doti,$password,$currentPassword){
        $hashPassword = User::where('doti','=',$doti)->pluck("password");
        if(Hash::check($currentPassword,$hashPassword[0])){
            return User::where('doti','=',$doti)->update(["password"=>bcrypt($password)]);
        }
        return response()->json('password/false', 500);
    }
    public function ResetPassword($doti,$cin){
        return User::where("doti","=",$doti)->update(["password"=>bcrypt(strtolower($cin))]);
    }

    public function refreshToken($token){
        try {
            JWTAuth::parseToken()->refresh();
            return response()->json($token);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, token cannot be refreshed'
            ], 200);
        }
    }
}