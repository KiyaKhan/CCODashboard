<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CallEmailLog extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['tag_id'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function driver_obj()
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    public function getTagIdAttribute()
    {
        return $this->driver_obj ? $this->driver_obj->tag_id : null;
    }
}
