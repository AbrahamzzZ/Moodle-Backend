#!/bin/bash
set -e

MOODLE_DIR=/var/www/html
run_as_www() { su -s /bin/bash www-data -c "$1"; }

chown -R www-data:www-data /var/www/moodledata

echo "[moodle] Esperando la base de datos ${MOODLE_DB_HOST}..."
until php -r '
  $m = @new mysqli(getenv("MOODLE_DB_HOST"), getenv("MOODLE_DB_USER"), getenv("MOODLE_DB_PASS"), getenv("MOODLE_DB_NAME"));
  exit($m->connect_errno ? 1 : 0);'; do
  sleep 2
done

INSTALLED=$(php -r '
  $m = new mysqli(getenv("MOODLE_DB_HOST"), getenv("MOODLE_DB_USER"), getenv("MOODLE_DB_PASS"), getenv("MOODLE_DB_NAME"));
  $r = $m->query("SHOW TABLES LIKE \"mdl_config\"");
  echo $r->num_rows;')

if [ "$INSTALLED" = "0" ]; then
  echo "[moodle] Instalando Moodle (solo la primera vez, tarda unos minutos)..."
  run_as_www "php $MOODLE_DIR/admin/cli/install_database.php \
    --agree-license \
    --adminuser='${MOODLE_ADMIN_USER}' \
    --adminpass='${MOODLE_ADMIN_PASS}' \
    --adminemail='${MOODLE_ADMIN_EMAIL}' \
    --fullname='${MOODLE_SITE_NAME}' \
    --shortname='moodle'"
else
  echo "[moodle] Moodle ya está instalado."
fi

# Instala/actualiza plugins nuevos (p. ej. local_moodleapp). Si no hay nada que hacer, termina rápido.
run_as_www "php $MOODLE_DIR/admin/cli/upgrade.php --non-interactive" > /dev/null

echo "[moodle] Configurando servicios web y token..."
run_as_www "php /opt/moodle-setup/setup_webservices.php"

# Cron de Moodle cada minuto (tareas programadas, notificaciones, etc.)
(
  while true; do
    run_as_www "php $MOODLE_DIR/admin/cli/cron.php" > /dev/null 2>&1 || true
    sleep 60
  done
) &

echo "[moodle] Listo: http://localhost:8080"
exec apache2-foreground
