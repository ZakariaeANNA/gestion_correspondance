<?php

namespace App\Interfaces;

interface DepartmentRepositoryInterface 
{
    public function create($data);
    public function getAll();
}