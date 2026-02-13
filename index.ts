import { lex } from "./src/lexer/lexer";
import { parse } from "./src/parser/parser";
import { reportError } from "./src/utils/error-handler";

const files = Bun.argv.slice(2);

if (files.length === 0) {
    console.log("Uso: bun run index.ts <archivo.ts>");
}

for (const path of files) {
    const file = Bun.file(path);
    if (!(await file.exists())) {
        console.error(`Archivo no encontrado: ${path}`);
        continue;
    }

    const code = await file.text();
    const tokens = lex(code);
    const errors = parse(tokens);

    console.log(`\nAnalisis: ${path}`);
    if (errors.length > 0) {
        for (const error of errors) {
            error.snippet = code.split("\n")[error.line - 1];
            reportError(error);
        }
    } else {
        console.log("Exito! Sin errores.");
    }
}