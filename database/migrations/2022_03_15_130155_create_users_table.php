<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('fullnamear',120)->index();
            $table->string('fullnamela',120)->index();
            $table->string('codegresa',120)->index()->nullable();
            $table->string('doti',120)->unique();
            $table->string('password',300);
            $table->string('roles');
            $table->string('cin');
            $table->unsignedBigInteger('idDepartement')->index()->nullable();
            $table->foreign('idDepartement')->references('id')->on('departements')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('codegresa')->references('codegresa')->on('etablissements')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users',function(Blueprint $table){
            $table->dropForeign('users_idDepartement_foreign');
            $table->dropIndex('users_idDepartement_index');
            $table->dropColumn('idDepartement');
            $table->dropForeign('users_codegresa_foreign');
            $table->dropIndex('users_codegresa_index');
            $table->dropColumn('codegresa');
        });
    }
}
