<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Interfaces\FeedbackRepositoryInterface;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    private FeedbackRepositoryInterface $feedbackRepository;

    public function __construct(FeedbackRepositoryInterface $feedbackRepository) 
    {
        $this->feedbackRepository = $feedbackRepository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->only('idSender','idReceiver','mail_id','message','file','isConfirmation','direction');
        $validator = Validator::make($data,[   
            'idSender'=>'required|string',
            'idReceiver'=>'required|string',
            'mail_id'=>'required',
            'message'=>'required_without:file',
            'file'=>'required_without:message',
        ]);
        if($validator->fails())
            return response("create_feedback/fields_required",500);
        return $this->feedbackRepository->create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
    public function UpdateFeedBackStatus($idReceiver,$mail_id){
        return $this->feedbackRepository->updateFeedBackStatus($idReceiver,$mail_id);
    }

    public function feedbackBycorrespondence($mail_id){
        return $this->feedbackRepository->getFeedbackByCorrespondence($mail_id);
    }

    public function feedbackSent($mail_id,$idsender){
        return $this->feedbackRepository->sent($mail_id,$idsender);
    }

    public function feedbackReceived($mail_id,$idReceiver){
        return $this->feedbackRepository->received($mail_id,$idReceiver);
    }

    public function feedbackByMail($mail_id,$idReceiver,$idSender){
        return $this->feedbackRepository->getFeedbackByMailAndBySenderAndByReceiver($mail_id,$idReceiver,$idSender);
    }
    public function getLatestFeedbacks(){
        return $this->feedbackRepository->getLatestFeedbacks();
    }
}
