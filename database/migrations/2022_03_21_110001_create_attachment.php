<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttachment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attachements', function (Blueprint $table) {
            $table->id();
            $table->string("attachement")->nullable();
            $table->string("type")->nullable();
            $table->string("filename")->nullable();
            $table->unsignedBigInteger('idFeedBack');
            $table->foreign('idFeedBack')->references('id')->on('feed_backs')->onDelete('cascade');
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
        Schema::dropIfExists('attachements',function(Blueprint $table){
            $table->dropForeign('attachements_idFeedBack_foreign');
            $table->dropIndex('attachements_idFeedBack_index');
            $table->dropColumn('idFeedBack');
        });
    }
}
