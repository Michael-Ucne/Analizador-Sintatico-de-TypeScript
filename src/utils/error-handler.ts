import type { ParseError } from "../types/token";

export function reportError(error: ParseError): void {
    console.error(`\x1b[31mError Sintactico:\x1b[0m ${error.message}`);
    console.error(`\x1b[33mUbicacion:\x1b[0m Linea ${error.line}, Columna ${error.column}`);
    if (error.snippet) {
        console.error(`\x1b[36mCodigo:\x1b[0m ${error.snippet}`);
        console.error(" ".repeat(error.snippet.indexOf(error.snippet.trim())) + "^");
    }
}
