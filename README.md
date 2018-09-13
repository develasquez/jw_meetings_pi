# Teleview - Like Chromecast System.

## Detalles

Teleview te permimte crear un centro multimedia para reproducir en tu televisor o monitor y controlarlo mediante tu telefono móvil, similar al uso de Google Chrome Cast.

## Instalacion

	$ git clone https://github.com/develasquez/TeleView.git
	$ cd Teleview
    $ npm install

Esto iniciará un servidor en el puerto 3000 al cual puedes acceder desde el navegador Google Chrome preferentemente.

[http://localhost:3000](http://localhost:3000)

![Home](https://github.com/develasquez/TeleView/blob/master/images/1.png?raw=true)


Para acceder al control remoto desde tu celular ingresa con la IP de tu PC/RaspBerry 

Si tienes un lector de códigos QR en tu dispositivo puedes acceder más fácilmente al control remoto.

[http://192.168.1.123:3000/remoto](http://127.0.0.1:3000/remoto)

![Control Remoto](https://github.com/develasquez/TeleView/blob/master/images/2.png?raw=true)

## Funciones

![Funciones](https://github.com/develasquez/TeleView/blob/master/images/3.png?raw=true)

* __Share Screen__ : Aun se encuentra en desarrollo. Permite compartir el escritorio o una ventana en particular para visualizar en la TV
* __Canales__: Permite ver una lista de canales de televisión de Chile y del mundo directamente en la tv. 
    - Para poder utilizar este funcion debes tener en el chrome conectado a la TV instalada la siguente extensión. [TV Chile](https://chrome.google.com/webstore/detail/monkibu-tv-y-radios-onlin/phimhnckkaofkllcoledjilakgbeohli)
* __Youtube__: Permite buscar y enviar a reproducir videos desde youtube al Televisor
* __Peliculas__: Recibe la url de una pelicula o video en formato mp4 y la reproduce en el televisor. Esta funcinalidad aun se encuentra en desarrollo.
* __Pause__: Permite enviar una señal de pause al vide que se esta reproduciendo.
    - Canales: Aun no funciona en todos los canales.
    - Youtube: Funciona para todos los videos
    - Peliculas: Funciona para todo video en mp4.


![Funciones](https://github.com/develasquez/TeleView/blob/master/images/4.png?raw=true)

* __Compartir Imagen__: Puedes seleccionar una imagen dede el dispositivo del control remoto, ya sea de la camara o de la galeria y se desplegará en la TV.
    Si el control remoto esta siendo utilizado desde un pc puedes hacer Drag and Drop de la imagen sobre el control remoto.
    La imagenes mayores a 5MB son inestables y puede fallar su envio.

