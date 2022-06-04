<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CorrespondenceToImportResource;

class ImportResource extends JsonResource
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
            'mail' => new CorrespondenceToImportResource($this->Mail),
            'senderConfirmation' => $this->senderConfirmation,
            'receiverConfirmation' => $this->receiverConfirmation,
            'status' => $this->status,
        ];
    }
}
