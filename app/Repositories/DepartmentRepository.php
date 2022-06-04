<?php

namespace App\Repositories;

use App\Interfaces\DepartmentRepositoryInterface;
use App\Models\Departement;
use Illuminate\Http\Response;
use App\Http\Resources\DepartmentResource;
use App\Imports\DepartementImport;
use Maatwebsite\Excel\Facades\Excel;

class DepartmentRepository implements DepartmentRepositoryInterface 
{
    public function create($data) 
    {
        try{
            if(!array_key_exists("file",$data) == 1){
                $department = Departement::create([
                    'nomar' => $data['nomAr'],
                    'nomla' => $data['nomLa'],
                    'delegation' => $data['delegation'],
                    'type' =>$data['type'],
                ]);
            }else{
                try{
                    Excel::import(new DepartementImport,$data['file']);
                }catch(\Exception $e){
                    if($e->errorInfo[1] == 1048)
                        return response("add_department_file/fields_required",500);
                    if($e->errorInfo[1] == 1062)
                        return response("add_department_file/already_exist",500);
                }
            }
        }catch(QueryException $e){
            if( $e->errorInfo[1] == 1062 )
                return response("add_department/department_already_exist",500);
        }
        return response([]);
    }
    public function update($data,$id){
        try{
            $department = Departement::find($id)->update([
                "nomAr" => $data["nomAr"],
                "nomLa" => $data["nomLa"],
                "delegation" => $data["delegation"],
                "type" => $data["type"],
            ]);
        }catch(QueryException $e){
            if( $e->errorInfo[1] == 1062 )
                return response("edit_department/department_already_exist",500);
        }
        return response([]);
    }
    public function getAll()
    {
        return DepartmentResource::collection(Departement::all());
    }

    public function destroy($id){
        try{
            $department = Departement::find($id);
            $department->delete($id);
        }catch(QueryException $e){
            return response("departement_delete/notFound");
        }
    }

}