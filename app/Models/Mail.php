<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\IncomingEmail;
use App\Models\FeedBack;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;


class Mail extends Model
{
    use HasFactory,SoftDeletes;
    protected $with = ['sender'];
    protected $fillable = [
        'id',
        'title',
        'fileName',
        'achevementdate',
        'message',
        'attachement',
        'type',
        'number',
        'references',
        'concerned',
        'notes',
        'sender',
        'achevementdate'
    ];
    protected $hidden = ['deleted_at'];
    public function FeedBack(){
        return $this->hasMany(FeedBack::class);
    }
    public function IncomingEmail(){
        return $this->hasMany(IncomingEmail::class,'mail_id','id');
    }
    public function Sender(){
        return $this->belongsTo(User::class,'sender','doti');
    }
    
}
