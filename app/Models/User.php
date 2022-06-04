<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Support\Facades\DB;
use App\Models\Departement;
use App\Models\IncomingEmail;
use App\Models\FeedBack;
use Illuminate\Database\Eloquent\SoftDeletes;


class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable,SoftDeletes;

    /*
    *
     * The attributes that are mass assignable.
     *
     * @var array
     * 
     * 
    */
    protected $fillable = [
        'id',
        'doti',
        'fullnamear',
        'fullnamela',
        'codegresa',
        'idDepartement',
        'cin',
        'password',
        'profile',
        'email',
        'birthday',
        'phone',
        'online',
        'roles'
    ];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     * 
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    protected $with = ['Departement','Etablissement'];

    public function getJWTIdentifier(){
        return $this->getKey();
    }

    public function getJWTCustomClaims(){
        return [
            'role' => $this->roles , 
            'fullnamear' => $this->fullnamear,
            'fullnamela' => $this->fullnamela,
            'doti' => $this->doti
        ];
    }
    public function UserFeedBack(){
        return $this->hasOne(FeedBack::class,'codeGRESA');
    }
    public function Departement(){
        return $this->belongsTo(Departement::class,'idDepartement','id');
    }
    public function Etablissement(){
        return $this->belongsTo(Etablissement::class,'codegresa','codegresa');
    }
    public function IncomingEmail(){
        return $this->hasMany(IncomingEmail::class);
    }
}
