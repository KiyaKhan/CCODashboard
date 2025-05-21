<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;
    protected $fillable = ['driver', 'project_id'];
    protected $with = [];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}