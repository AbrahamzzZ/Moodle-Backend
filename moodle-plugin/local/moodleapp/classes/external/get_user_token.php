<?php
namespace local_moodleapp\external;

defined('MOODLE_INTERNAL') || die();

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

/**
 * Permite al backend (con el token admin) obtener el token de un usuario concreto,
 * para que las respuestas a foros y las entregas queden a nombre de ese usuario.
 */
class get_user_token extends external_api {

    /** Shortname del servicio externo que usa el backend. */
    const SERVICE_SHORTNAME = 'moodle_app_backend';

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'userid' => new external_value(PARAM_INT, 'Id del usuario en Moodle'),
        ]);
    }

    public static function execute(int $userid): array {
        global $DB;

        ['userid' => $userid] = self::validate_parameters(self::execute_parameters(), ['userid' => $userid]);

        $context = \context_system::instance();
        self::validate_context($context);
        require_capability('moodle/site:config', $context);

        $user = \core_user::get_user($userid, '*', MUST_EXIST);
        \core_user::require_active_user($user);

        $service = $DB->get_record('external_services',
            ['shortname' => self::SERVICE_SHORTNAME, 'enabled' => 1], '*', MUST_EXIST);

        $token = $DB->get_field('external_tokens', 'token', [
            'userid' => $user->id,
            'externalserviceid' => $service->id,
            'tokentype' => EXTERNAL_TOKEN_PERMANENT,
        ], IGNORE_MULTIPLE);

        if (!$token) {
            $token = \core_external\util::generate_token(
                EXTERNAL_TOKEN_PERMANENT, $service, $user->id, $context);
        }

        return ['token' => $token];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'token' => new external_value(PARAM_ALPHANUM, 'Token del usuario'),
        ]);
    }
}
