<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\CorrespondenceResource;

class IncomingResource extends JsonResource
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
            'id' => $this->id,
            'senderConfirmation' => $this->senderConfirmation,
            'receiverConfirmation' => $this->receiverConfirmation,
            'status' => $this->status,
            'receiver' => $this->when($this->Receiver != null, UserResource::collection($this->Receiver)),
        ];
    }
}
