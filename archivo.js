"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var fs_1 = require("fs");
var TOKEN_URL = 'https://challenge.bax-dev.com/challenge/token';
var WORD_URL = 'https://challenge.bax-dev.com/challenge/word';
var APPLY_URL = 'https://challenge.bax-dev.com/challenge/apply';
var AUTH_HEADER = 'Authorization';
var LOG_FILE = 'log.txt';
var SOURCE_FILE = './archivo.ts';
var NAME = 'Alan Geovanni Velázquez Valera';
var EMAIL = 'alangeovs@gmail.com';
function logToFile(step, result) {
    var timestamp = new Date().toISOString();
    var logMessage = "".concat(timestamp, " - Paso: ").concat(step, ", Resultado: ").concat(result, "\n");
    (0, fs_1.appendFileSync)(LOG_FILE, logMessage);
}
function getToken() {
    return __awaiter(this, void 0, void 0, function () {
        var response, token, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(TOKEN_URL)];
                case 1:
                    response = _a.sent();
                    token = response.data.token;
                    logToFile('Obtener Token', "Token obtenido con \u00E9xito: ".concat(token));
                    return [2 /*return*/, token];
                case 2:
                    error_1 = _a.sent();
                    logToFile('Obtener Token', "Error al obtener el token: ".concat(error_1));
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getWords(token) {
    return __awaiter(this, void 0, void 0, function () {
        var words, response, error_2, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    words = [];
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 6];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get(WORD_URL, {
                            headers: (_a = {}, _a[AUTH_HEADER] = "Bearer ".concat(token), _a),
                        })];
                case 3:
                    response = _b.sent();
                    words.push(response.data.word);
                    logToFile('Obtener Palabra', "Palabra obtenida: ".concat(response.data.word));
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    if (error_2.response && error_2.response.status === 404) {
                        logToFile('Obtener Palabras', 'No hay más palabras para el token');
                        return [3 /*break*/, 6];
                    }
                    else {
                        logToFile('Obtener Palabras', 'Error al obtener palabras');
                        throw error_2;
                    }
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 1];
                case 6: return [2 /*return*/, words];
                case 7:
                    error_3 = _b.sent();
                    throw error_3;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function generateAccessKey(words) {
    var sortedWords = words.sort(function (a, b) {
        return a.substring(1).localeCompare(b.substring(1));
    });
    logToFile('Ordenar Palabras', "Palabras ordenadas: ".concat(sortedWords.join(', ')));
    var allWordsStr = sortedWords.join('');
    logToFile('Juntar Palabras', "Palabras juntas: ".concat(allWordsStr));
    var fibonacciSequence = getFibonacciSequence(allWordsStr.length);
    var accessKey = fibonacciSequence.reduce(function (acc, curr) { return acc + (allWordsStr[curr] || ''); }, '');
    logToFile('Secuencia Fibonacci', "Secuencia Fibonacci aplicada: ".concat(accessKey));
    return accessKey;
}
function getFibonacciSequence(length) {
    var sequence = [0, 1];
    while (sequence[sequence.length - 1] < length - 1) {
        var nextFib = sequence[sequence.length - 1] + sequence[sequence.length - 2];
        if (nextFib < length) {
            sequence.push(nextFib);
        }
        else {
            break;
        }
    }
    return sequence;
}
function encodeSourceToBase64(filePath) {
    var source = (0, fs_1.readFileSync)(filePath, 'utf-8');
    return Buffer.from(source).toString('base64');
}
function applyChallenge(token, accessKey, sourceCodeBase64) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var payload, response, error_4, errorMessage;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    payload = {
                        name: 'Alan Geovanni Velázquez Valera',
                        email: 'alangeovs@gmail.com',
                        key: accessKey,
                        source: sourceCodeBase64,
                    };
                    return [4 /*yield*/, axios_1.default.post(APPLY_URL, payload, {
                            headers: (_c = {},
                                _c[AUTH_HEADER] = "Bearer ".concat(token),
                                _c['Content-Type'] = 'application/json',
                                _c),
                        })];
                case 1:
                    response = _d.sent();
                    logToFile('Enviar Aplicación', "Aplicaci\u00F3n enviada con \u00E9xito: ".concat(response.status));
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _d.sent();
                    if (axios_1.default.isAxiosError(error_4)) {
                        errorMessage = ((_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data.error) || error_4.message;
                        logToFile('Enviar Aplicación', "Error al enviar la aplicaci\u00F3n: ".concat(errorMessage));
                        console.error('Detalles del Error:', (_b = error_4.response) === null || _b === void 0 ? void 0 : _b.data);
                    }
                    else {
                        logToFile('Enviar Aplicación', "Error al enviar la aplicaci\u00F3n: ".concat(error_4));
                    }
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var token, words, accessKey, sourceCodeBase64, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getToken()];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, getWords(token)];
                case 2:
                    words = _a.sent();
                    accessKey = generateAccessKey(words);
                    logToFile('Generar Clave de Acceso', "Clave de acceso generada: ".concat(accessKey));
                    console.log('Clave de acceso:', accessKey);
                    if (!(0, fs_1.existsSync)(SOURCE_FILE)) {
                        throw new Error("El archivo ".concat(SOURCE_FILE, " no existe."));
                    }
                    sourceCodeBase64 = encodeSourceToBase64(SOURCE_FILE);
                    return [4 /*yield*/, applyChallenge(token, accessKey, sourceCodeBase64)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    logToFile('Proceso General', "Error en el proceso: ".concat(error_5 instanceof Error ? error_5.message : error_5));
                    console.error('Error en el proceso:', error_5);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
