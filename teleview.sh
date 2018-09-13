#!/bin/bash
### BEGIN INIT INFO
# Provides:          @desamovil
# Required-Start:    $syslog
# Required-Stop:     $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: teleview
# Description:
#
### END INIT INFO

pm2 kill && 
pm2 start /opt/node/TeleView/bin/www --name=teleview
