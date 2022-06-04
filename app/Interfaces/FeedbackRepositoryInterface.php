<?php

namespace App\Interfaces;

interface FeedbackRepositoryInterface 
{
    public function create($data);
    public function getFeedbackByCorrespondence($mail_id);
    public function sent($mail_id,$idSender);
    public function received($mail_id,$idReceiver);
    public function getFeedbackByMailAndBySenderAndByReceiver($mail_id,$idReceiver,$idSender);
}