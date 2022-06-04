<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserControllerResource extends JsonResource
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
            'fullnamear' => $this->fullnamear,
            'fullnamela' => $this->fullnamela,
            'departement' => $this->when($this->departement != null, $this->departement),
            'etablissement' => $this->when($this->etablissement != null, $this->etablissement),
        ];
    }
}
