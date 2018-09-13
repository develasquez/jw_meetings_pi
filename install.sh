#!/bin/bash

mkdir -p ~/.config/autostart/

cat >~/.config/autostart/autoChromium.desktop << EOL
[Desktop Entry]
Type=Application
Exec=/usr/bin/chromium-browser --noerrdialogs --disable-session-crashed-bubble --disable-infobars --kiosk http://www.website.com
Hidden=false
X-GNOME-Autostart-enabled=true
Name[en_US]=AutoChromium
Name=AutoChromium
Comment=Start Chromium when GNOME starts
EOL


sudo cp teleview.sh /etc/init.d/teleview.sh


