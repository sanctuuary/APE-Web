import { CommonTokenStream, InputStream, Token, Lexer } from 'antlr4';
import { ErrorListener } from 'antlr4/error/ErrorListener';
import SLTLxLexer from 'src/SLTLx/SLTLxLexer';
import SLTLxParser from 'src/SLTLx/SLTLxParser';

class SLTLxErrorListener extends ErrorListener {
  // eslint-disable-next-line class-methods-use-this
  syntaxError(_recognizer, _offendingSymbol, _line, _column, msg) {
    // eslint-disable-next-line no-console
    console.log(`ERROR ${msg}`);
  }
}

function createLexer(input: string) {
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

export function parseTreeStr(input: string) {
  const lexer = createLexer(input);
  lexer.removeErrorListeners();
  lexer.addErrorListener(new SLTLxErrorListener());

  const parser = createParserFromLexer(lexer);
  parser.removeErrorListeners();
  parser.addErrorListener(new SLTLxErrorListener());

  const tree = parser.compilationUnit();
  return tree.toStringTree(parser.ruleNames);
}
