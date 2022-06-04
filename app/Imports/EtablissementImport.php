<?php

namespace App\Imports;

use App\Models\Etablissement;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Illuminate\Database\QueryException;


class EtablissementImport implements ToModel,WithHeadingRow,SkipsEmptyRows
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        try{
            return new Etablissement([
                "codegresa" => $row['code_gresa'],
                "nomar" => $row['nom_detablissement_en_arabe'],
                "nomla" => $row['nom_detablisssement_en_francais'],
                "type" => $row['type'],
                "delegation" => $row['delegation'],
            ]);
        }catch(QueryException $e){
            if( $e->errorInfo[1] == 1062 )
                return response(['add_establishment_file/already_exist'], 500);
            else
                return response(['add_establishment_file/fields_required'], 500);
        }

    }
}
