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
        #ADD NECESSARY COLUMN FOR SETTINGS.
        /**
         * DIDN'T MAKE IT SCALABLE (Collections) difficult to access attributes
         * and cost too much processing time to access.
         */

        Schema::create('project_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id')->unique()->index();
            $table->tinyInteger('is_monitored');
            $table->timestamps();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('project_settings');
    }
};