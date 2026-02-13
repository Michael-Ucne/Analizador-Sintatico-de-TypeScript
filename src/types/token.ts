export enum TokenType {
    Keyword = "Keyword",
    Identifier = "Identifier",
    Operator = "Operator",
    Semicolon = "Semicolon",
    OpenBrace = "OpenBrace",
    CloseBrace = "CloseBrace",
    OpenParen = "OpenParen",
    CloseParen = "CloseParen",
    EOF = "EOF",
    Unknown = "Unknown"
}

export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}

export interface ParseError {
    message: string;
    line: number;
    column: number;
    snippet?: string;
}
