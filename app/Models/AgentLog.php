<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgentLog extends Model
{
    use HasFactory;
    protected $guarded=[];
    // protected $appends=['created_at_date_only'];
    // public $created_at_date_only;

    public function user(){
        return $this->belongsTo(User::class);
    }


    public function status(){
        return $this->belongsTo(Status::class);
    }


    // public function getCreatedAtDateOnlyAttribute()
    // {
    //     return Carbon::parse($this->created_at)->format('Y-m-d');
    // }
}
