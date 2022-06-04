<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\IncomingEmail;
use App\Notifications\CorrespondanceNotifications;



class ProcessSend implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    protected $mail;
    protected $codegresa;
    protected $department;
    protected $departementRoles;
    protected $department_or_establishment_names;

    public function __construct($codegresa,$department,$mail,$departementRoles,$department_or_establishment_names)
    {
        $this->mail = $mail;
        $this->department = $department;
        $this->codegresa = $codegresa;
        $this->departementRoles = $departementRoles;
        $this->department_or_establishment_names = $department_or_establishment_names;
    }
    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if(!empty($this->codegresa)){
            $codegresaArray = explode(',',$this->codegresa);
            foreach($codegresaArray as &$codegresa)
            {
                $i = 0;
                $ecoles = array("primaire", "college", "lycee");
                if($codegresa == "all"){
                    $user = User::where([['codegresa','!=','NULL'],['doti','!=',$this->mail->sender]])->pluck('doti')->toArray();
                }else if(in_array($codegresa,$ecoles)){
                    $user = User::whereRelation('Etablissement','type', '=', $codegresa)->pluck("doti");
                }else{
                    $user = User::where([['codegresa','=',$codegresa],['doti','!=',$this->mail->sender]])->pluck('doti')->toArray();
                }
                foreach($user as &$usr){
                    if($usr==$this->mail->sender)continue;
                    $usersEta[$i] = ["idReceiver"=>$usr];
                    $i=$i+1;
                }
                $this->mail->IncomingEmail()->createMany($usersEta);
                foreach($user as &$usrnotif){
                    if($usrnotif==$this->mail->sender)continue;
                    $usernotifdata = User::where('doti',"=",$usrnotif)->firstOrFail();
                    $usernotifdata->notify(new CorrespondanceNotifications($this->department_or_establishment_names,'correspondance'));
                }
            }
        }
        if(!empty($this->department)){
            $departmentArray = explode(',',$this->department);

            foreach($departmentArray as &$department){
                if($department=="all"){
                    if($this->departementRoles == "tous")
                        $userdoti = User::where([['idDepartement','!=','NULL'],['doti','!=',$this->mail->sender]])->pluck('doti')->toArray();
                    else
                        $userdoti = User::where([['idDepartement','!=','NULL'],['doti','!=',$this->mail->sender],["roles","=",$this->departementRoles]])->pluck('doti')->toArray();
                }else{
                    if($this->departementRoles == "tous"){
                        $userdoti = User::where([['idDepartement','=',$department],['doti','!=',$this->mail->sender]])->pluck('doti')->toArray();
                    
                    }else
                        $userdoti = User::where([['idDepartement','=',$department],['doti','!=',$this->mail->sender],["roles","=",$this->departementRoles]])->pluck('doti')->toArray();
                }
                $i = 0;
                foreach($userdoti as &$usr){
                    $usersDep[$i] = ["idReceiver"=>$usr];
                    $i=$i+1;
                }
                if(!empty($userdoti)){
                    $this->mail->IncomingEmail()->createMany($usersDep);
                    foreach($userdoti as &$usrnotif){
                        $usernotifdata = User::where('doti',"=",$usrnotif)->firstOrFail();
                        $usernotifdata->notify(new CorrespondanceNotifications($this->department_or_establishment_names,'correspondance'));
                    }
                }
            }
        }
    }
}
