<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeedback extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('feed_backs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger("mail_id")->index()->nullable();
            $table->string("idSender",120)->nullable();
            $table->string("idReceiver",120)->nullable();
            $table->boolean('status')->index()->default(0);
            $table->longtext("message");
            $table->boolean('isConfirmation')->index()->default(0);
            $table->foreign("mail_id")->references("id")->on("mails")->onDelete("cascade");
            $table->foreign("idSender")->references("doti")->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign("idReceiver")->references("doti")->on('users')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('feed_backs',function(Blueprint $table){
            $table->dropForeign('feed_backs_mail_id_foreign');
            $table->dropIndex('feed_backs_mail_id_index');
            $table->dropColumn('mail_id');
            $table->dropForeign('feed_backs_idSender_foreign');
            $table->dropIndex('feed_backs_idSender_index');
            $table->dropColumn('idSender');    
            $table->dropForeign('feed_backs_idReceiver_foreign');
            $table->dropIndex('feed_backs_idReceiver_index');
            $table->dropColumn('idReceiver');
        });
    }
}
