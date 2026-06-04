<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FileMetadata extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'file_metadata';

    protected $fillable = [
        'user_id',
        'file_name',
        'original_name',
        'file_type',
        'file_size',
        'file_path',
        'related_type',
        'related_id',
        'uploaded_at',
    ];

    public $timestamps = false;
}