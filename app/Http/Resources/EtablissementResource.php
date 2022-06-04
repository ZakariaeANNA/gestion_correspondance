<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EtablissementResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->codegresa,
            'nomAr' => $this->nomAr,
            'nomLa' => $this->nomLa,
            'delegation' => $this->delegation,
            'type' => $this->type,
        ];
    }
}
