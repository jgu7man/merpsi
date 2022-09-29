# Merpsi

Sistema ERP para el consumo y administración de inventario multiempresa

## Proceso de instalación de entorno de desarrollo

1. Instalar `nvm` en windows [click aqui](https://github.com/coreybutler/nvm-windows/releases) para descargar.

2. Instalar node e angular version 12 mediante `nvm`

      - al instalar `nvm` ejecutar el siguiente comando para instalar node


      ```shell
        nvm install --lts
      ```
      - luego elije la instalacion de node

      
      ```shell
        nvm list
      ```
      - selecciona la version a usar

      ```shell
        nvm use <version_a_usar>
      ``` 
      - instalar angular 12
      
      ```shell
        npm install -g @angular/cli@12
      ``` 
        

3. Loguearse en Jfrog y configurar el archivo .npmrc deberia quedar un arechivo similar al siguiente formato
  
  
  ```code 
  
  email= josbor.dev@gmail.com
  always-auth= true
  @marxa:registry=https://marxa.jfrog.io/artifactory/api/npm/marxa-npm/
  //marxa.jfrog.io/artifactory/api/npm/marxa-npm/:_authToken=eyJ2ZXIiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYiLCJraWQiOiJLbS13dHN2akVjcUw4WGUybUdhUTgwVUtpeGZleGJEVEhuVV9PdjBURzJFIn0.eyJzdWIiOiJqZnJ0QDAxZzN5eHJuN3hmcWRnMXpoNGJ6emgxaGJhXC91c2Vyc1wvamJvcnJlZ28iLCJzY3AiOiJtZW1iZXItb2YtZ3JvdXBzOioiLCJhdWQiOiJqZnJ0QDAxZzN5eHJuN3hmcWRnMXpoNGJ6emgxaGJhIiwiaXNzIjoiamZydEAwMWczeXhybjd4ZnFkZzF6aDRienpoMWhiYVwvdXNlcnNcL2pib3JyZWdvIiwiaWF0IjoxNjY0MjIwNzgwLCJqdGkiOiIyN2FkNTVhZS1lYzg1LTQwNDQtYjcwZS0wMDU5NGI4ZTFjM2UifQ.oDJju1zKOz_ARlInHhqdwVaIVph38DsHRvLSQgsTt9TKafjIb7BnKX8ItHoLuNHMm-qXbg-N9mKXgGz_M97eV9zZOqUeIWJCsN6xt7xyTwXaoeawxeQIpVXAYEclYDGaRJKr_kuSoUPJu3k9YLe1bNgT0n69PtsRmyimLtryf22wYwT1TWRBrZ_1ImAXYY5zqQMklfU1kX9tZVQgQAa_NotkquEkuoIiGwE7l7ogymP8AcWh6BNy5656iInojAwiWzF-JrkR7uyAho5JDFB8ku4YmxyIKLctxrqAcEL2GnRyHuW8V8fRUfO4zVPZnqo-viMsTLR-Z9VaY4-f_JnWsA

  ```

4. Clonar repositorio merpsi

5. Posicionarse en la rama dev del proyecto y hacer pull de los cambios
    
     ```shell
        git checkout dev
      ``` 

     ```shell
        git pull
      ``` 

6. Ejecutar en la ventana de comando y luego ejecutar los siguientes comandos de git 

    ```shell
        git submodule init
      ``` 
    ```shell
        git submodule update
      ``` 

7. Una vez clonado el proyecto e isntalado los submodulos , realizar el siguiente comando para descargar las depoendencias

    ```bash
        npm i --legacy-peer-deps 
    ``` 
9. Hacer build e Instalar las librerias con el siguiente comando  de `GIT bash` 
    
     ```bash
        LIB=(nombre de la libreria) npm run lib-build 
    ```   
10. Obtener las credenciales de [firebase](https://console.firebase.google.com/u/0/project/merpsi/overview) del proyecto en los environments.
  
      - Iniciar sesión con una cuenta de firebase con permisos para este proyecto.

      - Darle click al engrane ⚙ debajo del logo de firebase y seguido de **Configuración del proyecto**
      
      - Dar scroll hasta la parte inferior y copiar el objeto `firebaseConfig`.
      
      - Copiar el mismo objeto en `environment.ts` y `environment.prod.ts` con la propiedad `firebaseConfig`

      ```ts
        export const environment = {
          production: false,
          firebaseConfig: {
            apiKey: "AIza**************",
            authDomain: "merpsi.firebaseapp.com",
            projectId: "merpsi",
            storageBucket: "merpsi.appspot.com",
            messagingSenderId: "*********",
            appId: "1:769**********************",
            measurementId: "G-**********"
          }
        };
      ```
      - Corre `ng serve` para correr en tu computadora. En tu navegador favorito, ve a `http://localhost:4200/`.


## Ayuda
Háblenle a Mariana