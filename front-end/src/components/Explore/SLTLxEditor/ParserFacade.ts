import { CommonTokenStream, InputStream, Token, Lexer, Recognizer } from 'antlr4';
import { ErrorListener } from 'antlr4/error/ErrorListener';
import SLTLxLexer from 'src/SLTLx/SLTLxLexer';
import SLTLxParser from 'src/SLTLx/SLTLxParser';

class SLTLxErrorListener extends ErrorListener {
  syntaxError(
    _recognizer: Recognizer,
    _offendingSymbol: Token,
    _line: number,
    _column: number,
    msg: any,
  ) {
    // eslint-disable-next-line no-console
    console.log(`ERROR ${msg}`);
  }
}

export function createLexer(input: string): SLTLxLexer {
  const chars = new InputStream(input);
  const lexer = new SLTLxLexer(chars);

  return lexer;
}

export default function getTokens(input: string): Token[] {
  return createLexer(input).getAllTokens();
}

function createParserFromLexer(lexer: Lexer): SLTLxParser {
  const tokens = new CommonTokenStream(lexer);
  return new SLTLxParser(tokens);
}

export function createParser(input: string): SLTLxParser {
  const lexer = createLexer(input);
  return createParserFromLexer(lexer);
}

export function parseTree(input: string) {
  const parser = createParser(input);
  return parser.compilationUnit();
}

export function parseTreeStr(input: string): string {
  const lexer = createLexer(input);
  lexer.removeErrorListeners();
  lexer.addErrorListener(new SLTLxErrorListener());

  const parser = createParserFromLexer(lexer);
  parser.removeErrorListeners();
  parser.addErrorListener(new SLTLxErrorListener());

  const tree = parser.compilationUnit();
  return tree.toStringTree(parser.ruleNames, parser);
}
