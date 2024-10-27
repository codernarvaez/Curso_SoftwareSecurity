# Curso_SoftwareSecurity
Curso de prácticas para el desarrollo de Software Seguro

## Iniciar la Base de Datos y el Microservicio de Login

Este proyecto incluye un microservicio de login y una base de datos configurada para ejecutarse con Docker y Docker Compose. A continuación, se indican los pasos para iniciar los servicios.

### Requisitos previos

- **Docker**: Asegúrate de tener Docker instalado. Puedes [descargarlo aquí](https://www.docker.com/get-started).
- **Docker Compose**: Docker Compose generalmente se incluye con Docker Desktop, pero si necesitas instalarlo por separado, sigue las instrucciones en la [documentación oficial](https://docs.docker.com/compose/install/).
- **Node.js**: Asegúrate de tener Node.js instalado para ejecutar el backend. Puedes [descargarlo aquí](https://nodejs.org/).

### Pasos para iniciar los servicios

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/usuario/Curso_SoftwareSecurity.git
   cd Curso_SoftwareSecurity/login-microservice
   ```

2. **Iniciar los servicios con Docker Compose**:

   Desde el directorio `login-microservice`, ejecuta el siguiente comando:

   ```bash
   docker-compose up -d
   ```

   Esto creará y ejecutará los contenedores en segundo plano.

3. **Iniciar el backend del servicio**:

   Una vez que la base de datos esté en ejecución, inicia el backend con el siguiente comando:

   ```bash
   node index.js
   ```

   Este comando ejecutará el backend y lo conectará a la base de datos en ejecución en el contenedor.

4. **Verificar el estado de los contenedores**:

   Para asegurarte de que los contenedores están en ejecución, usa:

   ```bash
   docker ps
   ```

   Este comando mostrará los contenedores en ejecución y te permitirá verificar que tanto la base de datos como el microservicio de login estén activos.

### Información adicional

- **Detener los contenedores**: Para detener los servicios en cualquier momento, ejecuta:

  ```bash
  docker-compose down
  ```

- **Datos persistentes**: Si el archivo `docker-compose.yml` incluye un volumen para la base de datos, los datos se mantendrán en tu máquina local, incluso si detienes o eliminas los contenedores.

### Estructura del Proyecto

- `login-microservice/docker-compose.yml`: Contiene la configuración de los servicios (base de datos y microservicio de login) necesarios para el proyecto.
- Otros archivos y carpetas específicos del proyecto están organizados en el repositorio.
