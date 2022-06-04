<?php

namespace App\Repositories;

use App\Interfaces\FeedbackRepositoryInterface;
use App\Models\FeedBack;
use Illuminate\Http\Response;
use Illuminate\Database\QueryException;
use App\Models\IncomingEmail;
use App\Notifications\FeedbackNotifications;
use App\Models\Mail;
use App\Http\Resources\UserResource;
use App\Http\Resources\IncomingEMailControllerResource;
use App\Models\User;
use Auth;

class FeedbackRepository implements FeedbackRepositoryInterface 
{
    public function create($data){
        try{
            $feedback = FeedBack::create([
                'idReceiver'=>$data['idReceiver'],
                'mail_id'=>$data['mail_id'],
                'idSender'=>$data['idSender'],
                'message'=>$data['message']??NULL,
                'isConfirmation'=>$data['isConfirmation']??0
            ]);
            if(!empty($data['file'])){
                foreach($data['file'] as $file){
                    $attachement = $file->store('feedback');
                    $feedback->Attachement()->create([
                        "attachement" => $attachement,
                        "filename" => $file->getClientOriginalName(),
                        "type" => $file->getClientOriginalExtension()
                    ]);
                }
            }
            $correspondanceSubject = Mail::where("id","=",$data['mail_id'])->pluck('number')[0];
            $notifiable_user = User::findOrfail(User::where('doti','=',$data['idReceiver'])->pluck('id')[0]);
            $feedback_sender = UserResource::collection(User::where('doti','=',$data['idSender'])->get());
            if($data['direction']=='export'){
                $notifiable_user->notify(new FeedbackNotifications('feedback',$feedback_sender,$data['mail_id'],$correspondanceSubject));
            }else if($data['direction']=='import'){
                $notifiable_user->notify(new FeedbackNotifications('feedback',NULL,$data['mail_id'],$correspondanceSubject));
            }
        }catch(QueryException $e){
            return response(["create_feedback/error_input"],500);
        }
        $feedback = $feedback->fresh();
        return response([$feedback],200);
    }
    public function getFeedbackByCorrespondence($mail_id){
        return FeedBack::where('mail_id','=',$mail_id)->get();
    }

    public function sent($mail_id,$idSender){
        return FeedBack::where([['mail_id','=',$mail_id],['idReceiver','=',$idSender]])->get();
    }

    public function received($mail_id,$idReceiver){
        return FeedBack::where([['mail_id','=',$mail_id],['idSender','=',$idReceiver]])->get();
    }

    public function updateFeedBackStatus($idReceiver,$mail_id){
        return FeedBack::where([['idReceiver','=',$idReceiver],["mail_id","=",$mail_id],["status","=",0]])->update(["status"=>1]);
    }

    public function getFeedbackByMailAndBySenderAndByReceiver($mail_id,$idReceiver,$idSender){
        return FeedBack::where([['mail_id','=',$mail_id],['idSender','=',$idSender],['idReceiver','=',$idReceiver]])->orWhere([['mail_id','=',$mail_id],['idSender','=',$idReceiver],['idReceiver','=',$idSender]])->get();
    }
    public function getLatestFeedbacks(){
         $data = IncomingEmail::with(['mail'])->whereHas('mail', function ($query) {
            $query->where('sender', '=', Auth::user()->doti);
        })->where([["receiverConfirmation","!=","pending"],["idReceiver","!=",Auth::user()->doti]])->orderBy('updated_at','desc')->take(5)->get();
        return IncomingEMailControllerResource::collection($data);
    }
    
}