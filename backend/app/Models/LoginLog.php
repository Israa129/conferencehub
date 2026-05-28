<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class LoginLog extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'login_logs';

    protected $fillable = [
        'user_id',
        'email',
        'role',
        'status',
        'ip_address',
        'user_agent',
        'logged_at',
    ];

    public $timestamps = false;
}