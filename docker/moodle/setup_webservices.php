<?php
define('CLI_SCRIPT', true);
require('/var/www/html/config.php');
require_once($CFG->dirroot . '/webservice/lib.php');

const SERVICE_SHORTNAME = 'moodle_app_backend';
const SERVICE_NAME = 'Moodle App Backend';

$functions = [
    'core_course_create_courses',
    'core_course_get_contents',
    'core_course_get_courses',
    'core_course_get_enrolled_courses_by_timeline_classification',
    'core_enrol_get_enrolled_users',
    'core_enrol_get_users_courses',
    'core_files_upload',
    'core_user_get_users',
    'core_user_get_users_by_field',
    'core_user_update_users',
    'core_user_update_picture',
    'gradereport_overview_get_course_grades',
    'gradereport_user_get_grade_items',
    'mod_assign_get_assignments',
    'mod_assign_get_submission_status',
    'mod_assign_get_user_assignments',
    'mod_assign_save_submission',
    'mod_assign_submit_for_grading',
    'mod_forum_add_discussion',
    'mod_forum_add_discussion_post',
    'mod_forum_get_discussion_posts',
    'mod_forum_get_forum_discussions',
    'mod_forum_get_forums_by_courses',
    // Plugin local_moodleapp (moodle-plugin/local/moodleapp).
    'local_moodleapp_get_user_token',
];

// 1. Activar servicios web y el protocolo REST.
set_config('enablewebservices', 1);
$protocols = empty($CFG->webserviceprotocols) ? [] : explode(',', $CFG->webserviceprotocols);
if (!in_array('rest', $protocols)) {
    $protocols[] = 'rest';
    set_config('webserviceprotocols', implode(',', $protocols));
}

// Los estudiantes/docentes llaman a la API con su propio token: necesitan poder usar REST.
assign_capability('webservice/rest:use', CAP_ALLOW, $CFG->defaultuserroleid,
    context_system::instance()->id, true);

// 2. Crear (o actualizar) el servicio externo.
$webservice = new webservice();
$service = $DB->get_record('external_services', ['shortname' => SERVICE_SHORTNAME]);
if (!$service) {
    $service = (object) [
        'name' => SERVICE_NAME,
        'shortname' => SERVICE_SHORTNAME,
        'enabled' => 1,
        'restrictedusers' => 0,
        'downloadfiles' => 1,
        'uploadfiles' => 1,
        'requiredcapability' => '',
    ];
    $service->id = $webservice->add_external_service($service);
    $service = $DB->get_record('external_services', ['id' => $service->id]);
} else {
    $service->enabled = 1;
    $service->downloadfiles = 1;
    $service->uploadfiles = 1;
    $webservice->update_external_service($service);
}

// 3. Añadir las funciones al servicio.
foreach ($functions as $function) {
    if (!$DB->record_exists('external_functions', ['name' => $function])) {
        mtrace("  [aviso] La función $function no existe en esta versión de Moodle, se omite.");
        continue;
    }
    if (!$webservice->service_function_exists($function, $service->id)) {
        $webservice->add_external_function_to_service($function, $service->id);
    }
}

// 4. Token permanente para el administrador.
$admin = get_admin();
$token = $DB->get_field('external_tokens', 'token', [
    'userid' => $admin->id,
    'externalserviceid' => $service->id,
    'tokentype' => EXTERNAL_TOKEN_PERMANENT,
], IGNORE_MULTIPLE);

if (!$token) {
    $token = \core_external\util::generate_token(
        EXTERNAL_TOKEN_PERMANENT,
        $service,
        $admin->id,
        context_system::instance()
    );
}

$url = rtrim($CFG->wwwroot, '/') . '/webservice/rest/server.php';
mtrace('');
mtrace('==================================================================');
mtrace(' Servicios web de Moodle configurados.');
mtrace(' Copia esto en el .env del backend:');
mtrace('');
mtrace(" MOODLE_URL=$url");
mtrace(" MOODLE_TOKEN=$token");
mtrace('==================================================================');
mtrace('');
