<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Interfaces\CorrespondenceRepositoryInterface;

class CorrespondenceController extends Controller
{
    private CorrespondenceRepositoryInterface $correspondenceRepository;

    public function __construct(CorrespondenceRepositoryInterface $correspondenceRepository) 
    {
        $this->correspondenceRepository = $correspondenceRepository;
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
        $data = $request->only(
            'title',
            'message',
            'sender',
            'receiver',
            'references',
            'concerned',
            'notes',
            'number',
            'file',
            'dateachevement',
            'department',
            'codegresa',
            'depRoles'
        );
        if(!empty($request->receiver))
        {
            $receiver = json_decode($request->receiver,true);
        }
        $validator = Validator::make($data,[
            'title' => 'required|string',
            'sender' => 'required|string', 
            'file' => 'mimes:pdf,png,jpg,jpeg,gif,docx,doc,xls,txt|max:10000',
        ]);
        if($validator->fails()){
            return response(["correspondance_add/fields_required"],500);
        }
        return $this->correspondenceRepository->create($data,$receiver??NULL);
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
        return $this->correspondenceRepository->destroy($id);
    }

    public function MailBySenderByDoti($doti){
        return $this->correspondenceRepository->getMailBySenderByDoti($doti);
    }
    
    public function MailByReceiverByDoti($doti){
        return $this->correspondenceRepository->getMailByReceiverByDoti($doti);
    }

    public function ConfirmMailBySender($idReceiver,$mail_id,$state){
        return $this->correspondenceRepository->confirmMailBySender($idReceiver,$mail_id,$state);
    }

    public function ConfirmMailByReceiver($idReceiver,$mail_id,$state){
        return $this->correspondenceRepository->confirmMailByReceiver($idReceiver,$mail_id,$state);
    }

    public function DeleteImportation($id){
        return $this->correspondenceRepository->DeleteImportation($id);
    }

    public function getReceivers($id){
        return $this->correspondenceRepository->getReceiversbyMail($id);
    }
    public function getReceiverByMailIdAndDoti($id,$receiver){
        return $this->correspondenceRepository->getReceiverByMailIdAndDoti($id,$receiver);
    }

    public function checkIfUserInMail($id,$doti){
        return $this->correspondenceRepository->checkIfUserInMail($id,$doti);
    }
    //just a test function
    public function TestFunction(){
        $user = User::whereRelation('Etablissement','type', '=','lycee')->pluck('doti');
        return  response($user);
    }
    public function getLatestExportRecords(){
        return $this->correspondenceRepository->getLatestExportRecords();
    }
    public function getLatestImportRecords(){
        return $this->correspondenceRepository->getLatestImportRecords();
    }
}
