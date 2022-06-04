<?php

namespace App\Interfaces;

interface UserRepositoryInterface 
{
    public function create($data);
    public function login($data);
    public function logout($data);
    public function ChangePassword($doti,$password,$currentPassword);
}