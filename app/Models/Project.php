<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $guarded = [];
    protected $with = [];
    use HasFactory;


    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function statuses()
    {
        return $this->hasMany(Status::class)->orderBy('position', 'asc');
    }

    public function drivers()
    {
        return $this->hasMany(Driver::class)->orderBy('position', 'asc');
    }
}