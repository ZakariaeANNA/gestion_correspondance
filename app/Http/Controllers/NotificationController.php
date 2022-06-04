<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class NotificationController extends Controller
{
    public function getUnreadNotifications(){
        $notifications = array([
            "notification"=>Auth::user()->notifications()->get(),
            "count"=>Auth::user()->unreadNotifications()->count()
        ]); 
        return $notifications;
    }
    public function DeleteNotification($id){
        $ids_array = explode(",",$id);
        foreach($ids_array as $ids){
            Auth::user()->notifications()->where('id',$ids)->delete();
        }
        return response(["succes"],200);
    }
    public function ClearNotification(){
        Auth::user()->notifications()->delete();
    }
}

