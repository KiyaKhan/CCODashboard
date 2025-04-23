<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntranetTeam extends Model
{
    use HasFactory;
    protected $connection = 'ams_mysql';
    protected $table = 'teams';
    protected $with = [];
    public function user()
    {
        return $this->belongsTo(IntranetUser::class);
    }

    public function users()
    {
        return $this->hasMany(IntranetUser::class, 'team_id');
    }
}
