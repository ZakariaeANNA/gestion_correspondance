<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\Mail;
use App\Models\attachement;
use App\Models\IncomingEmail;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;


class FeedBack extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = [
        'id',
        'message',
        'mail_id',
        'status',
        'idSender',
        'idReceiver',
        'isConfirmation'
    ];
    protected $with = ['Attachement'];
    protected $hidden = ['deleted_at'];
    public function Sender(){
        return $this->belongsTo(User::class,'idSender','doti');
    }   
    public function Receiver(){
        return $this->belongsTo(User::class,'idReceiver','doti');
    }
    public function mail(){
        return $this->belongsTo(Mail::class,'mail_id','id');
    }
    public function Attachement(){
        return $this->hasMany(Attachement::class,'idFeedBack','id');
    }
    function IncomingEmail(){
        return $this->belongsTo(IncomingEmail::class,'mail_id');
    }
}
