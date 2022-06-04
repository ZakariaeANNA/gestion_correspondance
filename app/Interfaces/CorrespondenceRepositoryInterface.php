<?php

namespace App\Interfaces;

interface CorrespondenceRepositoryInterface 
{
    public function create($data,$receiver);
    public function getMailBySenderByDoti($doti);
    public function getMailByReceiverByDoti($doti);
    public function confirmMailBySender($idReceiver,$mail_id,$state);
    public function confirmMailByReceiver($idReceiver,$mail_id,$state);
    public function updateMailByStatus($mail_id);
    public function getReceiversbyMail($id);
    public function checkIfUserInMail($id,$doti);
    public function getReceiverByMailIdAndDoti($id,$receiver);
}