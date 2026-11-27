<?php  // Moodle configuration file (generado para Docker)

unset($CFG);
global $CFG;
$CFG = new stdClass();

$CFG->dbtype    = 'mariadb';
$CFG->dblibrary = 'native';
$CFG->dbhost    = getenv('MOODLE_DB_HOST') ?: 'moodle-db';
$CFG->dbname    = getenv('MOODLE_DB_NAME') ?: 'moodle';
$CFG->dbuser    = getenv('MOODLE_DB_USER') ?: 'moodle';
$CFG->dbpass    = getenv('MOODLE_DB_PASS') ?: 'moodle';
$CFG->prefix    = 'mdl_';
$CFG->dboptions = array(
  'dbpersist' => 0,
  'dbport' => '',
  'dbsocket' => '',
  'dbcollation' => 'utf8mb4_unicode_ci',
);

// SOLO PARA DESARROLLO: la URL se toma del host con el que se accede (localhost:8080 desde el PC, 192.168.x.x:8080 desde el celular).
if (!empty($_SERVER['HTTP_HOST'])) {
  $CFG->wwwroot = 'http://' . $_SERVER['HTTP_HOST'];
} else {
  $CFG->wwwroot = getenv('MOODLE_WWWROOT') ?: 'http://localhost:8080';
}

$CFG->dataroot  = '/var/www/moodledata';
$CFG->admin     = 'admin';

$CFG->directorypermissions = 02777;

require_once(__DIR__ . '/lib/setup.php');