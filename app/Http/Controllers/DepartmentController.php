<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Interfaces\DepartmentRepositoryInterface;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\DepartmentResource;
use App\Models\Departement;

class DepartmentController extends Controller
{

    private DepartmentRepositoryInterface $departmentRepository;

    public function __construct(DepartmentRepositoryInterface $departmentRepository) 
    {
        $this->departmentRepository = $departmentRepository;
    }

    public function index()
    {
        return $this->departmentRepository->getAll();
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->only(
            'nomAr',
            'nomLa',
            'delegation',
            'type',
            'file'
        );

        $validator = Validator::make($data, [
            'nomAr' => 'required_without:file',
            'nomLa' => 'required_without:file',
            'delegation' => 'required_without:file',
            'type' => 'required_without:file',
            'file' => 'required_without:nomAr',
        ]);

        if($validator->fails())
            return response(['add_department/fields_required'], 500);

        return $this->departmentRepository->create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->only('nomAr','nomLa','delegation','type');
        $validator = Validator::make($data, [
            'nomAr' => 'required|string',
            'nomLa' => 'required|string',
            'delegation' => 'required|string',
            'type' => 'required|string',
        ]);
        if($validator->fails())
            return response(['edit_department/fields_required'], 500);
        return $this->departmentRepository->update($data,$id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->departmentRepository->destroy($id);
    }
}
