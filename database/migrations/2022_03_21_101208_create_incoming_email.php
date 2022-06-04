<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncomingEmail extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incoming_emails', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("mail_id")->index()->nullable();
            $table->string('senderConfirmation')->index()->default("pending");
            $table->string('receiverConfirmation')->index()->default("pending");
            $table->boolean('status')->index()->default(0);
            $table->string('idReceiver',120)->index();
            $table->foreign("mail_id")->references("id")->on("mails")->onDelete("cascade");
            $table->foreign("idReceiver")->references("doti")->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->dateTime('updated_at')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * 
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('incoming_emails',function(Blueprint $table){
            $table->dropForeign('incoming_emails_idReceiver_foreign');
            $table->dropIndex('incoming_emails_idReceiver_index');
            $table->dropColumn('idReceiver');
            $table->dropForeign('incoming_emails_mail_id_foreign');
            $table->dropIndex('incoming_emails_mail_id_index');
            $table->dropColumn('mail_id'); 
        });
    }

}
