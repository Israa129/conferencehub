<?php

namespace App\Logging;

use App\Models\MongoLog;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;

class MongoHandler extends AbstractProcessingHandler
{
    protected function write(LogRecord $record): void
    {
        MongoLog::create([
            'level'    => $record->level->name,
            'message'  => $record->message,
            'context'  => $record->context,
            'datetime' => $record->datetime->format('Y-m-d H:i:s'),
        ]);
    }
}