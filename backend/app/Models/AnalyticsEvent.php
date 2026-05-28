<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class AnalyticsEvent extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'analytics_events';

    protected $fillable = [
        'user_id',
        'event_type',
        'page',
        'conference_id',
        'session_id',
        'metadata',
        'ip_address',
        'created_at',
    ];

    public $timestamps = false;
}