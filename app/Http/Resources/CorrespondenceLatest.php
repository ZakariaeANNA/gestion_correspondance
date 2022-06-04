<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\IncomingResource;

class CorrespondenceLatest extends JsonResource
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
            'number' => $this->number,
            'achevementdate' => $this->achevementdate,
            'title' => $this->title,
            'created_at' => $this->created_at,
            'sender' => new UserResource($this->Sender),
        ];
    }
}
