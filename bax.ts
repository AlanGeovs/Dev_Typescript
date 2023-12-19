import axios from 'axios';
import { appendFileSync, readFileSync, existsSync } from 'fs';

const TOKEN_URL = 'https://challenge.bax-dev.com/challenge/token';
const WORD_URL = 'https://challenge.bax-dev.com/challenge/word';
const APPLY_URL = 'https://challenge.bax-dev.com/challenge/apply';
const AUTH_HEADER = 'Authorization';
const LOG_FILE = 'log.txt';
const SOURCE_FILE = './archivo.ts';
const NAME = 'Alan Geovanni Velázquez Valera';
const EMAIL = 'alangeovs@gmail.com';
const filePath = 'E:\\Documentos\\NetBeansProjects\\2023_tsc_bax\\archivo.ts';

// Función para registrar en el archivo log
function logToFile(step: string, result: string): void {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - Paso: ${step}, Resultado: ${result}\n`;
  appendFileSync(LOG_FILE, logMessage);
}

// 1. Realizar una petición GET al endpoint /challenge/token - Función para obtener el token de desafío
async function getToken(): Promise<string> {
  try {
    const response = await axios.get(TOKEN_URL);
    const token = response.data.token; //  token viene en un campo 'token'
    logToFile('Obtener Token', `Token obtenido con éxito: ${token}`);
    return token;
  } catch (error) {
    logToFile('Obtener Token', `Error al obtener el token: ${error}`);
    throw error;
  }
}

//2. Solicitudes a este endpoint hasta que recibir un código HTTP 404 - Función para obtener todas las palabras hasta recibir un 404
async function getWords(token: string): Promise<string[]> {
  try {
    const words: string[] = [];
    while (true) {
      try {
        const response = await axios.get(WORD_URL, {
          headers: { [AUTH_HEADER]: `Bearer ${token}` },
        });
        // Ajusta la siguiente línea según la estructura real de la respuesta:
        words.push(response.data.word); // Si la API devuelve un objeto con una propiedad 'word'
        logToFile('Obtener Palabra', `Palabra obtenida: ${response.data.word}`);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          logToFile('Obtener Palabras', 'No hay más palabras para el token');
          break;
        } else {
          logToFile('Obtener Palabras', 'Error al obtener palabras');
          throw error;
        }
      }
    }
    return words;
  } catch (error) {
    throw error;
  }
}

// 3.    Generar la clave de acceso utilizando las palabras obtenidas - Función para generar la clave de acceso
// 3. a. Ordenar las palabras alfabéticamente ignorando su primera letra.
// 3. b. Juntar todas las cadenas en una sola.
function generateAccessKey(words: string[]): string {
  // Paso a: Ordenar las palabras alfabéticamente ignorando su primera letra
  const sortedWords = words.sort((a, b) =>
    a.substring(1).localeCompare(b.substring(1))
  );

  // Log del resultado después de ordenar
  logToFile(
    'Ordenar Palabras',
    `Palabras ordenadas: ${sortedWords.join(', ')}`
  );

  // Paso b: Juntar todas las cadenas en una sola, después de haberlas ordenado
  const allWordsStr = sortedWords.join('');
  logToFile('Juntar Palabras', `Palabras juntas: ${allWordsStr}`);

  // Paso c: Obtener una cadena seleccionando las letras en posiciones según la secuencia de Fibonacci
  const fibonacciSequence = getFibonacciSequence(allWordsStr.length);
  const accessKey = fibonacciSequence.reduce(
    (acc, curr) => acc + (allWordsStr[curr] || ''),
    ''
  );

  // Log del resultado de la secuencia de Fibonacci
  logToFile(
    'Secuencia Fibonacci',
    `Secuencia Fibonacci aplicada: ${accessKey}`
  );

  return accessKey;
}

// 3. c. Obtener una cadena seleccionando las letras en posiciones según la secuencia de Fibonacci - Función para obtener la secuencia de Fibonacci
function getFibonacciSequence(length: number): number[] {
  let sequence = [0, 1];
  while (sequence[sequence.length - 1] < length - 1) {
    let nextFib = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    if (nextFib < length) {
      sequence.push(nextFib);
    } else {
      break;
    }
  }
  return sequence;
}

//4. a Enviar una petición POST al endpoint /challenge/apply con un JSON  -  Función para enviar la solicitud POST al endpoint /challenge/apply
async function applyChallenge(
  token: string,
  accessKey: string,
  sourceCodeBase64: string
): Promise<void> {
  try {
    // Solicitud con el código fuente como archivo
    const payload = {
      name: 'Alan Geovanni Velázquez Valera',
      email: 'alangeovs@gmail.com',
      key: accessKey,
      source: sourceCodeBase64,
    };

    const response = await axios.post(APPLY_URL, payload, {
      headers: {
        [AUTH_HEADER]: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    logToFile(
      'Enviar Aplicación',
      `Aplicación enviada con éxito: ${response.status}`
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data.error || error.message;
      logToFile(
        'Enviar Aplicación',
        `Error al enviar la aplicación: ${errorMessage}`
      );
      console.error('Detalles del Error:', error.response?.data);
      // Podrías también registrar error.response?.data.errors si está presente para más detalles
    } else {
      logToFile('Enviar Aplicación', `Error al enviar la aplicación: ${error}`);
    }
    throw error;
  }
}

// 4. b Código fuente en TypeScript codificado en BASE64. -  Función para codificar el código fuente a BASE64 y adjuntarlo como un archivo
function encodeSourceToBase64(filePath: string): string {
  const source = readFileSync(filePath, 'utf-8');
  return Buffer.from(source).toString('base64');
}

// Función principal que ejecuta el flujo completo
// Optimiza la función main para una mejor verificación de archivos y manejo de errores
async function main() {
  try {
    const token = await getToken();
    const words = await getWords(token);
    const accessKey = generateAccessKey(words);
    logToFile(
      'Generar Clave de Acceso',
      `Clave de acceso generada: ${accessKey}`
    );
    console.log('Clave de acceso:', accessKey);

    // Revisa  si el archivo fuente existe antes de proceder
    if (!existsSync(SOURCE_FILE)) {
      throw new Error(`El archivo ${SOURCE_FILE} no existe.`);
    }

    const sourceCodeBase64 = encodeSourceToBase64(SOURCE_FILE);
    await applyChallenge(token, accessKey, sourceCodeBase64);
  } catch (error) {
    // Maneja y registra errores específicos para cada paso del proceso
    logToFile(
      'Proceso General',
      `Error en el proceso: ${error instanceof Error ? error.message : error}`
    );
    console.error('Error en el proceso:', error);
  }
}

main();
