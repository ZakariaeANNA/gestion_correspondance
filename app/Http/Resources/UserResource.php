<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'fullnamear' => $this->fullnamear,
            'fullnamela' => $this->fullnamela,
            'doti' => $this->doti,
            'cin' => $this->cin,
            'email' => $this->email,
            'phone' => $this->phone,
            'roles' => $this->roles,
            'departement' => $this->when($this->departement != null, $this->departement),
            'etablissement' => $this->when($this->etablissement != null, $this->etablissement),
        ];
    }
}
