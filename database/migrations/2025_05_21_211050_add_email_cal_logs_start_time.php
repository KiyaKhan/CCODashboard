<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
        Schema::table('call_email_logs', function (Blueprint $table) {
            $table->timestamp('start_time')->default(DB::raw("'0000-00-00 00:00:00'"));;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('call_email_logs', function (Blueprint $table) {
            $table->dropColumn('start_time');
        });
    }
};