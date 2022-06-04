<?php

namespace App\Repositories;

use App\Interfaces\EtablishmentRepositoryInterface;
use App\Models\Etablissement;
use App\Resources\EtablissementResource;
use Illuminate\Http\Response;
use Illuminate\Database\QueryException;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\EtablissementImport;

class EtablishmentRepository implements EtablishmentRepositoryInterface 
{
    
    public function create($data) 
    {
        try{
            if(!array_key_exists("file",$data) == 1){
                $etablissement = Etablissement::create([
                    'codegresa'=>$data['codegresa'],
                    'nomar'=>$data['nomar'],
                    'nomla'=>$data['nomla'],
                    'delegation'=>$data['delegation'],
                    'type'=>$data['type'],
                ]);
            }else{
                try{
                    Excel::import(new EtablissementImport,$data['file']);
                }catch(\Exception $e){
                    if($e->errorInfo[1] == 1048)
                        return response("add_establishment_file/fields_required",500);
                    if($e->errorInfo[1] == 1062)
                        return response("add_establishment_file/already_exist",500);
                }
            }
        }catch(QueryException $e){
            if( $e->errorInfo[1] == 1062 )
                return response("add_establishment/establishment_already_exist",500);
        }
        return response([]);
    }
    public function update($data,$id){
        try{
            $etablissement = Etablissement::find($id)->update([
                "codegresa" => $data["codegresa"],
                "nomar" => $data["nomar"],
                "nomla" => $data["nomla"],
                "delegation" => $data["delegation"],
                "type" => $data["type"],
            ]);
        }catch(QueryException $e){
            if( $e->errorInfo[1] == 1062 )
                return response("edit_establishment/establishment_already_exist",500);
        }
        return response([]);
    }
    public function index(){
        $etablissement = Etablissement::all();
        return $etablissement;
    }
    public function destroy($id){
        try{
            $etablissement = Etablissement::find($id);
            $etablissement->delete($id);
        }catch(QueryException $e){
            return response("establishment_delete/notFound");
        }
    }
}
