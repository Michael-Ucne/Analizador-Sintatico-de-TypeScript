import { TokenType } from "../types/token";
import type { Token, ParseError } from "../types/token";

export function parse(tokens: Token[]): ParseError | null {
    let current = 0;

    const peek = () => tokens[current]!;
    const consume = () => tokens[current++]!;


    try {
        while (peek().type !== TokenType.EOF) {
            if (peek().type === TokenType.Keyword && peek().value === "let") {
                consume();

                const idToken = peek();
                if (idToken.type !== TokenType.Identifier) {
                    return {
                        message: `Se esperaba un identificador despues de 'let', pero se encontro '${idToken.value}'`,
                        line: idToken.line,
                        column: idToken.column
                    };
                }
                consume();

                const opToken = peek();
                if (opToken.type !== TokenType.Operator || opToken.value !== "=") {
                    return {
                        message: `Se esperaba '=' en la asignacion, pero se encontro '${opToken.value}'`,
                        line: opToken.line,
                        column: opToken.column
                    };
                }
                consume();

                const valToken = peek();
                if (valToken.type !== TokenType.Identifier) {
                    return {
                        message: `Se esperaba un valor o identificador, pero se encontro '${valToken.value}'`,
                        line: valToken.line,
                        column: valToken.column
                    };
                }
                consume();

                const semiToken = peek();
                if (semiToken.type !== TokenType.Semicolon) {
                    return {
                        message: `Falta punto y coma ';' al final de la sentencia`,
                        line: semiToken.line,
                        column: semiToken.column
                    };
                }
                consume();
            } else {

                const unknownToken = peek();
                return {
                    message: `Sentencia no reconocida: '${unknownToken.value}'`,
                    line: unknownToken.line,
                    column: unknownToken.column
                };
            }
        }
    } catch (e) {
        const errorToken = tokens[current] || tokens[tokens.length - 1];
        return {
            message: "Error inesperado durante el analisis",
            line: errorToken?.line || 0,
            column: errorToken?.column || 0
        };
    }

    return null;
}
