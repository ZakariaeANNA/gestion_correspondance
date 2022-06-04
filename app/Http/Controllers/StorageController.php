<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class StorageController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function downloadMail($filepath,$name)
    {
        $path = "mail/{$filepath}";
        if(Storage::exists($path)){
            return Storage::download($path,$name);
        }
    }
    public function downloadFeedback($filepath,$name)
    {
        $path = "feedback/{$filepath}";
        if(Storage::exists($path)){
            return Storage::download($path,$name);
        }
    }
}
