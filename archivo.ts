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

function logToFile(step: string, result: string): void {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - Paso: ${step}, Resultado: ${result}\n`;
  appendFileSync(LOG_FILE, logMessage);
}

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

async function getWords(token: string): Promise<string[]> {
  try {
    const words: string[] = [];
    while (true) {
      try {
        const response = await axios.get(WORD_URL, {
          headers: { [AUTH_HEADER]: `Bearer ${token}` },
        });

        words.push(response.data.word);
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

function generateAccessKey(words: string[]): string {
  const sortedWords = words.sort((a, b) =>
    a.substring(1).localeCompare(b.substring(1))
  );

  logToFile(
    'Ordenar Palabras',
    `Palabras ordenadas: ${sortedWords.join(', ')}`
  );

  const allWordsStr = sortedWords.join('');
  logToFile('Juntar Palabras', `Palabras juntas: ${allWordsStr}`);

  const fibonacciSequence = getFibonacciSequence(allWordsStr.length);
  const accessKey = fibonacciSequence.reduce(
    (acc, curr) => acc + (allWordsStr[curr] || ''),
    ''
  );

  logToFile(
    'Secuencia Fibonacci',
    `Secuencia Fibonacci aplicada: ${accessKey}`
  );

  return accessKey;
}

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

function encodeSourceToBase64(filePath: string): string {
  const source = readFileSync(filePath, 'utf-8');
  return Buffer.from(source).toString('base64');
}

async function applyChallenge(
  token: string,
  accessKey: string,
  sourceCodeBase64: string
): Promise<void> {
  try {
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
    } else {
      logToFile('Enviar Aplicación', `Error al enviar la aplicación: ${error}`);
    }
    throw error;
  }
}

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

    if (!existsSync(SOURCE_FILE)) {
      throw new Error(`El archivo ${SOURCE_FILE} no existe.`);
    }

    const sourceCodeBase64 = encodeSourceToBase64(SOURCE_FILE);
    await applyChallenge(token, accessKey, sourceCodeBase64);
  } catch (error) {
    logToFile(
      'Proceso General',
      `Error en el proceso: ${error instanceof Error ? error.message : error}`
    );
    console.error('Error en el proceso:', error);
  }
}

main();
