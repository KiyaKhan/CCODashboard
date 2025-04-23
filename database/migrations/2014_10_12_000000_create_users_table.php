<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('project_id')->index()->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->tinyInteger('is_resigned')->default(0);
            $table->time('shift_start')->default('20:00');
            $table->time('shift_end')->default('05:00');;
            $table->string('company_id')->unique()->index();
            $table->string('email')->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('user_level')->default(3);
            $table->string('site')->default('Manila');
            $table->tinyInteger('is_sync')->default('0');
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
