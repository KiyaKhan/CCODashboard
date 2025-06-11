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
    public function tags()
    {
        return $this->hasMany(DriverTag::class);
    }
    public function drivers()
    {
        return $this->hasMany(Driver::class)->orderBy('position', 'asc');
    }
    public function settings()
    {
        return $this->hasOne(ProjectSettings::class);
    }
}