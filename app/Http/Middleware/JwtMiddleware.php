<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
use JWTAuth;
use Exception;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use App\Http\Controllers\UserController;
use Illuminate\Http\Response;



class JwtMiddleware extends BaseMiddleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, ...$roles)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return response()->json(['status' => 'Token is Invalid'],403);
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                if ($request->url() === route('refresh') && $e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                    try {
                        $token = JWTAuth::refresh();
                    } catch (TokenBlacklistedException $exception) {
                        return response()->json(['error' => $exception->getMessage()], Response::HTTP_UNAUTHORIZED);
                    }
                    return UserController::refreshToken($token);
                }else if ($request->url() === route('logout') && $e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                    return $next($request);
                }
                return response()->json(['status' => 'Token is Expired'],401);
            }else{
                return response()->json(['status' => 'Authorization Token not found'],403);
            }
        }
        return $next($request);
    }
}
