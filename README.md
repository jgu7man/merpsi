# Merpsi

Sistema ERP para el consumo y administración de inventario multiempresa

## Proceso de instalación de entorno de desarrollo

1. Una vez clonado el proyecto, hacer `npm i` para descargar las dependencias
2. Obtener las credenciales de [firebase](https://console.firebase.google.com/u/0/project/merpsi/overview) del proyecto en los environments.
  1. Iniciar sesión con una cuenta de firebase con permisos para este proyecto.
  2. Darle click al engrane ⚙ debajo del logo de firebase y seguido de **Configuración del proyecto**
  3. Dar scroll hasta la parte inferior y copiar el objeto `firebaseConfig`.
  4. Copiar el mismo objeto en `environment.ts` y `environment.prod.ts` con la propiedad `firebaseConfig`
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
  5. Corre `ng serve` para correr en tu computadora. En tu navegador favorito, ve a `http://localhost:4200/`.


## Ayuda
Háblenle a Mariana