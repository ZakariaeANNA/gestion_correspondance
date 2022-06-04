<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\FeedBack;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attachement extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = [
        'id',
        'idFeedBack',
        'attachement',
        'type',
        'filename'
    ];
    public $timestamps = false;
    public function FeedBack(){
        return $this->belongsTo(FeedBack::class,'idFeedBack','id');
    }
}
