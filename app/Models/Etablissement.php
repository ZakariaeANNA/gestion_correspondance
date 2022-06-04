<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;


class Etablissement extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = ['id','codegresa','nomar','nomla','type','delegation'];
    protected $hidden = ['created_at','updated_at','deleted_at'];
    public function users(){
        return $this->hasMany(User::class,'codegresa','codegresa');
    }

}
