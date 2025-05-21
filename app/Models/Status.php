<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected $guarded = [];
    protected $with = [];
    protected $fillable = ['name', 'project_id'];
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
