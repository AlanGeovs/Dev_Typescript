Prueba para posición de Desarrollador de Apis en BAX con Typescript 


De acuerdo con las instrucciones proporcionadas en la página del reto de BAX.mx, para completar el desafío debes seguir los siguientes pasos utilizando cURL o cualquier otro método para hacer llamadas HTTP POST y GET​​:

Crear un código en TypeScript que realice automáticamente los siguientes pasos.
1. Realizar una petición GET al endpoint /challenge/token para obtener un token de desafío, el cual solo es válido por 30 segundos.
2. Después de obtener el token, realizar solicitudes GET al endpoint /challenge/word para obtener palabras. Debes continuar haciendo solicitudes a este endpoint hasta que recibas un código HTTP 404, lo que indica que no hay más palabras para tu token.
3. Generar la clave de acceso utilizando las palabras obtenidas. Para ello debes:
	- a. Ordenar las palabras alfabéticamente ignorando su primera letra.
	- b. Juntar todas las cadenas en una sola.
	- c. Obtener una cadena seleccionando las letras en posiciones según la secuencia de Fibonacci; [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...]. La longitud de esta cadena depende del total de letras de la cadena inicial.
	- d. La cadena resultante es tu clave de acceso.
4. Enviar una petición POST al endpoint /challenge/apply con un JSON que incluya tu nombre completo, email, la clave de acceso generada y el código fuente de tu script en TypeScript codificado en BASE64.
- Debes asegurarte de agregar tu token como un HEADER "Authorization" del tipo Bearer en todas las solicitudes que realices después de obtener el token.

A continuación, te proporciono un ejemplo de cómo podrías usar cURL para realizar el primer paso, que es obtener el token:


Compilar TypeScript a JavaScript: Puedes compilar manualmente tu archivo TypeScript a JavaScript usando el compilador de TypeScript:
 
tsc challenge.ts
Esto generará un archivo challenge.js en el mismo directorio.

Ejecutar el Script: Una vez que tengas el archivo JavaScript, puedes ejecutarlo con Node.js:

node challenge.js






achelorism
acreous
allow
arries
aundy

achelorismacreousallowarriesaundy

accheo


---
$ curl https://challenge.bax-dev.com
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3033  100  3033    0     0   2909      0  0:00:01  0:00:01 --:--:--  2916
    # Bienvenido al reto automatizado de BAX.mx.

    Para poder finalizar este reto debes seguir las instrucciones que te damos a continuación:

    El reto consiste en hacer llamadas POST y GET con la información necesaria para poder generar la llave.
    Una vez que tengas la llave, deberás enviar un último POST request con esa llave y otros datos para poder
    continuar con el proceso de reclutamiento.

    Las instrucciones para obtener la llave es la siguiente:

    1. Debes realizar un código en *TypeScript* que realice de manera automática los pasos siguientes.
    2. Primero, deberás hacer un GET request al endpoint `/challenge/token` para obtener un challenge-token.
       este token solo será válido por 30 segundos. Por lo que tu código debe poder llevar a cabo los siguientes
       pasos antes de que termine el tiempo.
    4. Al hacer todos los siguientes requests asegúrate de agregar tu token como un HEADER "Authorization"
       del tipo Bearer  (e.g. `Authorization: Bearer TU_TOKEN`)
    3. Después de obtener el token, deberás hacer GET requests al endpoint `/challenge/word` para obtener
       la siguiente palabra. Guarda esta palabra. Deberás seguir haciendo requests a este endpont hasta que te regrese un
       HTTP code 404. Esto significa que no hay más palabras para ttu token
    4. A continuación deberás generar la clave utilizando todas las palabras que te regresaron los pasos anteriores
       para esto deberás procesar las palabra de la siguiente manera:
          a) Primero ordena la lista de palabras alfabéticamente ignorando su primera letra (por ejemplo, para las palabras
             [ARBOL, FUENTE, CASA]  debess ordenarlas como:  [CASA, ARBOL, FUENTE] ya que ignorando la C, A y F quedan ordenadas
             alfabéticamente)
          b) Después, junta todas las cadenas en una sola
          c) Obten una cadena seleccionando las letras en la posición según la secuencia de fibonnaci ;
             [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...]. El largo de esta cadena dependerá del total de letras de la cadena inicial.
          d) Esa cadena es tu clave de acceso.
     5. Una vez que tengas tu clave de acceso, envía un POST request al endpoint: `/challenge/apply` con un Body de tipo JSON
     con los siguientes values:
        ```
          {
            "name": "Tu Nombre Completo",
            "email" : "tu-email@dominio.com",
            "key" : "tu-clave-de-acceso-generada",
            "source": "El código fuente de tu script codificado en BASE64"
          }
        ```
        Nota que tienes que incluir tu código fuente TypeScript como UN solo archivo que pueda ser ejecutado `ts-node archivo.ts`
        y debes enviarlo codificado en BASE64

      Si todo salió bien, recibirás una respuesta 200 OK de tu último POST y podrás pasar a la siguiente etapa. A nosotros nos llegará
      una notifiación automática de que terminaste el challenge y te contactaremos por email para el siguiente paso.



      NOTA:
      No logré completar la prueba ya que el envío del Cödigo fuente por el API me generaba un error en el último paso.
      Todos los puntos los completé de forma satisfactoria
      
