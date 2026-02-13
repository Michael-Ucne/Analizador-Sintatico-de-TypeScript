import { TokenType } from "../types/token";
import type { Token, ParseError } from "../types/token";

export function parse(tokens: Token[]): ParseError[] {
    let current = 0;
    const errors: ParseError[] = [];

    const peek = () => tokens[current]!;
    const consume = () => tokens[current++]!;
    const isAtEnd = () => peek().type === TokenType.EOF;


    function synchronize() {
        consume();
        while (!isAtEnd()) {
            if (tokens[current - 1]?.type === TokenType.Semicolon) return;

            switch (peek().type) {
                case TokenType.Keyword:
                case TokenType.OpenBrace:
                case TokenType.CloseBrace:
                    return;
            }
            consume();
        }
    }

    function parseStatement(): void {
        const token = peek();

        try {

            if (token.type === TokenType.OpenBrace) {
                consume();
                while (peek().type !== TokenType.CloseBrace && !isAtEnd()) {
                    parseStatement();
                }
                if (peek().type !== TokenType.CloseBrace) {
                    errors.push({
                        message: "Se esperaba '}' para cerrar el bloque",
                        line: peek().line,
                        column: peek().column
                    });
                } else {
                    consume();
                }
                return;
            }


            if (token.type === TokenType.Keyword && (token.value === "if" || token.value === "while")) {
                const isWhile = token.value === "while";
                consume();

                if (peek().type !== TokenType.OpenParen) {
                    errors.push({
                        message: `Se esperaba '(' despues de '${token.value}'`,
                        line: peek().line,
                        column: peek().column
                    });
                } else {
                    consume();
                }

                if (peek().type !== TokenType.Identifier) {
                    errors.push({
                        message: "Se esperaba una condicion dentro de los parentesis",
                        line: peek().line,
                        column: peek().column
                    });
                } else {
                    consume();
                }

                if (peek().type !== TokenType.CloseParen) {
                    errors.push({
                        message: "Se esperaba ')' para cerrar la condicion",
                        line: peek().line,
                        column: peek().column
                    });
                } else {
                    consume();
                }

                if (peek().type !== TokenType.OpenBrace) {
                    errors.push({
                        message: "Se esperaba un bloque '{' despues de la condicion",
                        line: peek().line,
                        column: peek().column
                    });
                    synchronize();
                } else {
                    parseStatement();
                }

                if (!isWhile && peek().type === TokenType.Keyword && peek().value === "else") {
                    consume();
                    if (peek().type !== TokenType.OpenBrace && (peek().type !== TokenType.Keyword || peek().value !== "if")) {
                        errors.push({
                            message: "Se esperaba un bloque '{' o un 'if' despues de 'else'",
                            line: peek().line,
                            column: peek().column
                        });
                        synchronize();
                    } else {
                        parseStatement();
                    }
                }
                return;
            }

            if (token.type === TokenType.Keyword && token.value === "let") {
                consume();

                const idToken = peek();
                if (idToken.type !== TokenType.Identifier) {
                    errors.push({
                        message: `Se esperaba un identificador despues de 'let', pero se encontro '${idToken.value}'`,
                        line: idToken.line,
                        column: idToken.column
                    });
                    synchronize();
                    return;
                }
                consume();

                if (peek().type !== TokenType.Operator || peek().value !== "=") {
                    errors.push({
                        message: `Se esperaba '=' en la asignacion, pero se encontro '${peek().value}'`,
                        line: peek().line,
                        column: peek().column
                    });
                    synchronize();
                    return;
                }
                consume();

                let openParens = 0;
                while (peek().type === TokenType.OpenParen) {
                    consume();
                    openParens++;
                }

                const valToken = peek();
                if (valToken.type !== TokenType.Identifier) {
                    errors.push({
                        message: `Se esperaba un valor o identificador, pero se encontro '${valToken.value}'`,
                        line: valToken.line,
                        column: valToken.column
                    });
                    synchronize();
                    return;
                }
                consume();

                while (openParens > 0) {
                    if (peek().type !== TokenType.CloseParen) {
                        errors.push({
                            message: "Se esperaba ')' para cerrar la expresion",
                            line: peek().line,
                            column: peek().column
                        });
                        break;
                    }
                    consume();
                    openParens--;
                }

                if (peek().type !== TokenType.Semicolon) {
                    errors.push({
                        message: `Falta punto y coma ';' al final de la sentencia`,
                        line: peek().line,
                        column: peek().column
                    });
                } else {
                    consume();
                }
                return;
            }

            if (token.type !== TokenType.EOF) {
                errors.push({
                    message: `Sentencia no reconocida: '${token.value}'`,
                    line: token.line,
                    column: token.column
                });
                synchronize();
            }

        } catch (e) {
            errors.push({
                message: "Error inesperado durante el analisis",
                line: peek().line,
                column: peek().column
            });
            synchronize();
        }
    }

    while (!isAtEnd()) {
        parseStatement();
    }

    return errors;
}
