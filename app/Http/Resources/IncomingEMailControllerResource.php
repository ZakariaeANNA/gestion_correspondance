<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserControllerResource;
use App\Http\Resources\MailControllerResource;

class IncomingEMailControllerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "receiverConfirmation" => $this->receiverConfirmation,
            "receiver" => $this->when($this->Receiver != null, UserControllerResource::collection($this->Receiver)),
            "Mail" => new MailControllerResource($this->mail),
            'update_at' => $this->updated_at
        ];
    }
}
