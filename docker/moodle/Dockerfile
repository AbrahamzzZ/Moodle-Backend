# Imagen oficial de Moodle HQ con PHP 8.3 + Apache y todas las extensiones que pide Moodle.
FROM moodlehq/moodle-php-apache:8.3

# Moodle 4.5 LTS
ARG MOODLE_TGZ_URL=https://download.moodle.org/download.php/direct/stable405/moodle-latest-405.tgz

# Lo define normalmente el entrypoint original de la imagen, que aquí reemplazamos.
ENV APACHE_DOCUMENT_ROOT=/var/www/html

RUN curl -fsSL "$MOODLE_TGZ_URL" -o /tmp/moodle.tgz \
    && rm -rf /var/www/html \
    && mkdir -p /var/www/html \
    && tar -xzf /tmp/moodle.tgz -C /var/www/html --strip-components=1 \
    && rm /tmp/moodle.tgz \
    && mkdir -p /var/www/moodledata \
    && chown -R www-data:www-data /var/www/html /var/www/moodledata

COPY docker/moodle/config.php /var/www/html/config.php
COPY docker/moodle/setup_webservices.php /opt/moodle-setup/setup_webservices.php
COPY docker/moodle/entrypoint.sh /usr/local/bin/moodle-entrypoint.sh
# Plugin propio: permite al backend obtener el token de cada usuario.
COPY moodle-plugin/local/moodleapp /var/www/html/local/moodleapp

# Por si el .sh se guarda con saltos de línea de Windows (CRLF).
RUN sed -i 's/\r$//' /usr/local/bin/moodle-entrypoint.sh \
    && chmod +x /usr/local/bin/moodle-entrypoint.sh \
    && chown -R www-data:www-data /var/www/html/config.php /var/www/html/local/moodleapp

ENTRYPOINT ["/usr/local/bin/moodle-entrypoint.sh"]
