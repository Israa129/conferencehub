<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; 

class MongoLog extends Model
{
    protected $connection = 'mongodb'; 
    
    protected $collection = 'application_logs'; 

    protected $fillable = ['level', 'message', 'context', 'datetime'];
}