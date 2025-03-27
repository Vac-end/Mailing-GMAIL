# Proyecto de Mensajería

## Descripción
Este proyecto utiliza Docker para gestionar los contenedores de RabbitMQ, la API y el consumidor. 

## Requisitos
Antes de ejecutar el proyecto, asegúrate de tener instalado:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuración de Gmail
Para el envío de correos mediante Gmail, es necesario utilizar una contraseña de terceros. Puedes obtenerla siguiendo las instrucciones en el siguiente enlace: [Cómo generar una contraseña de aplicación en Gmail](https://support.google.com/accounts/answer/185833?hl=es-419).

Configura las siguientes variables de entorno en el archivo correspondiente:
```
{
    "email": "tu-email@gmail.com",
    "password": "tu-contraseña-de-aplicación"
}
```

## Ejecución del Proyecto
Para levantar los contenedores del proyecto, ejecuta el siguiente comando en la raíz del proyecto:
```sh
docker-compose up --build
```
Este comando construirá las imágenes y levantará los contenedores correspondientes a:
- **RabbitMQ** (Mensajería)
- **API** (Servicio principal)
- **Consumidor** (Procesamiento de mensajes)

Si deseas ejecutar los contenedores en segundo plano, usa:
```sh
docker-compose up --build -d
```
### ¿Qué hace este comando?
- **`--build`**: Fuerza la reconstrucción de las imágenes antes de iniciar los contenedores.
- **`-d`**: Inicia los contenedores en segundo plano para que la terminal siga disponible.

Para ver los logs después de ejecutar en modo `detached`, usa:
```sh
docker-compose logs -f
```

## Apagado de los Contenedores
Para detener y eliminar los contenedores, ejecuta:
```sh
docker-compose down
```

## Contacto
Si tienes dudas o problemas, revisa la documentación oficial de Docker o consultame a mi discord: "san.vacation".

