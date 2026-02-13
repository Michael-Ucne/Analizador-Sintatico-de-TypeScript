import type { Token } from "../types/token";
import { TokenType } from "../types/token";

export function lex(input: string): Token[] {
    const tokens: Token[] = [];
    let line = 1;
    let column = 1;
    let cursor = 0;

    const isAlpha = (char: string) => /[a-zA-Z_]/.test(char);
    const isDigit = (char: string) => /[0-9]/.test(char);
    const isWhitespace = (char: string) => /\s/.test(char);

    while (cursor < input.length) {
        const char = input[cursor]!;

        if (char === "\n") {
            line++;
            column = 0;
            cursor++;
            column++;
            continue;
        }

        if (isWhitespace(char)) {
            cursor++;
            column++;
            continue;
        }

        if (char === ";") {
            tokens.push({ type: TokenType.Semicolon, value: ";", line, column });
            cursor++;
            column++;
            continue;
        }

        if (char === "{") {
            tokens.push({ type: TokenType.OpenBrace, value: "{", line, column });
            cursor++;
            column++;
            continue;
        }

        if (char === "}") {
            tokens.push({ type: TokenType.CloseBrace, value: "}", line, column });
            cursor++;
            column++;
            continue;
        }

        if (char === "(") {
            tokens.push({ type: TokenType.OpenParen, value: "(", line, column });
            cursor++;
            column++;
            continue;
        }

        if (char === ")") {
            tokens.push({ type: TokenType.CloseParen, value: ")", line, column });
            cursor++;
            column++;
            continue;
        }

        if (/[=\+\-\*\/]/.test(char)) {
            tokens.push({ type: TokenType.Operator, value: char, line, column });
            cursor++;
            column++;
            continue;
        }

        if (isAlpha(char)) {
            let value = "";
            const startCol = column;
            while (cursor < input.length && (isAlpha(input[cursor]!) || isDigit(input[cursor]!))) {
                value += input[cursor]!;
                cursor++;
                column++;
            }

            const keywords = ["let", "const", "var", "func", "function", "if", "else", "while", "for", "return", "break", "continue", "true", "false", "null", "undefined", "class", "interface", "import", "export"];
            const type = keywords.includes(value)
                ? TokenType.Keyword
                : TokenType.Identifier;

            tokens.push({ type, value, line, column: startCol });
            continue;
        }

        if (isDigit(char)) {
            let value = "";
            const startCol = column;
            while (cursor < input.length && isDigit(input[cursor]!)) {
                value += input[cursor]!;
                cursor++;
                column++;
            }
            tokens.push({ type: TokenType.Identifier, value, line, column: startCol });
            continue;
        }

        tokens.push({ type: TokenType.Unknown, value: char, line, column });
        cursor++;
        column++;
    }

    tokens.push({ type: TokenType.EOF, value: "", line, column });
    return tokens;
}
