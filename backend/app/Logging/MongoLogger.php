<?php

namespace App\Logging;

use Monolog\Logger;

class MongoLogger
{
    public function __invoke(array $config): Logger
    {
        return new Logger('mongodb', [
            new MongoHandler(),
        ]);
    }
}