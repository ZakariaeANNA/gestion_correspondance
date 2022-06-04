<?php

namespace App\Imports;

use App\Models\Departement;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Illuminate\Database\QueryException;


class DepartementImport implements ToModel,WithHeadingRow,SkipsEmptyRows
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        try{
            return new Departement([
                "nomar" => $row['nom_de_departement_en_arabe'],
                "nomla" => $row['nom_de_departement_en_francais'],
                "delegation" => $row['delegation'],
                "type" => $row['type'],
            ]);
        }catch(QueryException $e){
            if( $e->errorInfo[1] == 1062 )
                return response(['add_department_file/already_exist'], 500);
            else
                return response(['add_department_file/fields_required'], 500);
        }
       
    }
}
