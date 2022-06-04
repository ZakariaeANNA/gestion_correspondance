<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;


class Departement extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable = [
        'id',
        'nomar',
        'nomla',
        'delegation',
        'type',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    public function User(){
        return $this->hasMany(User::class,'idDepartement','id');
    }
}
