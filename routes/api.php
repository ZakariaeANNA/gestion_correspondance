<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FeedBackController;
use App\Http\Controllers\EtablishmentController;
use App\Http\Controllers\CorrespondenceController;
use App\Http\Controllers\NotificationController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::resource('etablishments', EtablishmentController::class);     
Route::resource('departments', DepartmentController::class);      
Route::get('/mail/{filepath}/{name}',[StorageController::class,'downloadMail']);
Route::get('/feedback/{filepath}/{name}',[StorageController::class,'downloadFeedback']);
//just a test route
Route::get('/correspondences/TestFunction',[CorrespondenceController::class , 'TestFunction']);
////////////////////////////////


Route::middleware(['cors'])->group(function () {   
    Route::GET('/parc-informatique', function(){
        return "hi";
    });
    Route::post('/users/login', [UserController::class, 'login']);
    Route::group(['middleware' => ['jwt.verify']], function() {
        Route::post('/users/logout', [UserController::class, 'logout'])->name('logout');
        Route::post('/users/refresh', [UserController::class, 'refreshToken'])->name('refresh');
        Route::get('/correspondences/checkmail/{id}/{doti}',[CorrespondenceController::class , 'checkIfUserInMail']);
        Route::get('/correspondences/senders/{id}/{receiver}',[CorrespondenceController::class , 'getReceiverByMailIdAndDoti']);   
        Route::get('/correspondences/receivers/{id}',[CorrespondenceController::class , 'getReceivers']);
        Route::get('/feedbacks/getlatestfeedbacks',[FeedbackController::class, 'getLatestFeedbacks']);
        Route::get('/correspondences/importrecords', [CorrespondenceController::class, 'getLatestImportRecords']);
        Route::get('/correspondences/exportrecords', [CorrespondenceController::class, 'getLatestExportRecords']);
        Route::get('/correspondences/sender/{doti}', [CorrespondenceController::class, 'MailBySenderByDoti']);
        Route::get('/correspondences/receiver/{doti}', [CorrespondenceController::class, 'MailByReceiverByDoti']);
        Route::put('/correspondences/confirm/sender/{idReceiver}/{mail_id}/{state}', [CorrespondenceController::class, 'ConfirmMailBySender']);
        Route::put('/correspondences/confirm/receiver/{idReceiver}/{mail_id}/{state}', [CorrespondenceController::class, 'ConfirmMailByReceiver']);
        Route::put('/correspondences/update/{mail_id}/{state}', [CorrespondenceController::class, 'UpdateMailByStatus']);
        Route::get('/feedbacks/mail/{mail_id}',[FeedBackController::class, 'feedbackBycorrespondence']);
        Route::get('/feedbacks/sender/{mail_id}/{idsender}',[FeedBackController::class, 'feedbackSent']);
        Route::put('/feedbacks/{idReceiver}/{mail_id}',[FeedBackController::class, 'UpdateFeedBackStatus']);
        Route::get('/feedbacks/received/{mail_id}/{idReceiver/}',[FeedBackController::class, 'feedbackReceived']);
        Route::get('/feedbacks/{mail_id}/{idSender}/{idReceiver}',[FeedBackController::class, 'feedbackByMail']);
        Route::put('/users/changepassword/{doti}/{password}/{currentpassword}', [UserController::class,'ChangePassword']);            
        Route::post('/users/resetpassword/{doti}/{cin}', [UserController::class,'ResetPassword'])->middleware(['auth.role:admin,chefDep']);           
        Route::post("/users",[UserController::class,'store'])->middleware(['auth.role:admin,chefDep']);
        Route::get('/users/notifications',[NotificationController::class,'getUnreadNotifications']);
        Route::post('/users/notifications/{id}',[NotificationController::class,'DeleteNotification']);
        Route::delete('/users/notifications/delete',[NotificationController::class,'ClearNotification']);
        Route::resource('correspondences', CorrespondenceController::class);       
        Route::delete('/correspondences/delete/{id}', [CorrespondenceController::class,"DeleteImportation"]);       
        Route::resource('feedbacks', FeedBackController::class);         
        Route::resource('users', UserController::class);
    });
});