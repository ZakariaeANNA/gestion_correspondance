<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mail;
use App\Models\FeedBack;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;


class incomingEmail extends Model
{
    use HasFactory,SoftDeletes;
    protected $with = ['Receiver'];
    protected $fillable = [
        'id',
        'mail_id',
        'senderConfirmation',
        'receiverConfirmation',
        'status',
        'idReceiver'
        
    ];
    public $timestamps = true;

    public function mail(){
        return $this->belongsTo(Mail::class,'mail_id','id');   
    }
    function Receiver(){
        return $this->hasMany(User::class,'doti','idReceiver');
    }
    public function FeedBack(){
        return $this->hasMany(FeedBack::class);
    }
}
