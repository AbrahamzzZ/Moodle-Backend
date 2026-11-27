<?php
defined('MOODLE_INTERNAL') || die();

$functions = [
    'local_moodleapp_get_user_token' => [
        'classname'    => 'local_moodleapp\external\get_user_token',
        'description'  => 'Devuelve (o crea) el token del servicio de la app para un usuario. Solo administradores.',
        'type'         => 'write',
        'capabilities' => 'moodle/site:config',
    ],
];
