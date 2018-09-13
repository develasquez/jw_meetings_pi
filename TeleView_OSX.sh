#!/bin/bash
echo Cerraremos Google Chrome

killall Google\ Chrome

open -a Google\ Chrome --args --disable-web-security --allow-insecure-localhost --allow-running-insecure-content --reduce-security-for-testing --app="http://localhost:3000" --start-fullscreen


echo Abrimos Chrome en modo Promiscuo

bin/OSX/node bin/www