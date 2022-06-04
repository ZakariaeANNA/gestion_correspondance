<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CorrespondenceToImportResource extends JsonResource
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
            'filename' => $this->fileName,
            'attachement' => $this->attachement,
            'type' => $this->type,
            'number' => $this->number,
            'references' => $this->references,
            'achevementdate' => $this->achevementdate,
            'concerned' => $this->concerned,
            'notes' => $this->notes,
            'message' => $this->message,
            'title' => $this->title,
            'created_at' => $this->created_at,
            'sender' => new UserResource($this->Sender),
        ];
    }
}
