/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */
import * as monaco from 'monaco-editor';
import { Parser, Recognizer, Token } from 'antlr4';
import { ErrorListener } from 'antlr4/error/ErrorListener';
import { DefaultErrorStrategy } from 'antlr4/error/ErrorStrategy';
import SLTLxParser from 'src/SLTLx/SLTLxParser';
import { createLexer, createParserFromLexer } from './ParserFacade';

/**
 * An SLTLx lexer or parser error.
 */
export class SLTLxError {
  startLine: number;
  endLine: number;
  startCol: number;
  endCol: number;
  message: string;

  constructor(
    startLine: number,
    endLine: number,
    startCol: number,
    endCol: number,
    message: string,
  ) {
    this.startLine = startLine;
    this.endLine = endLine;
    this.startCol = startCol;
    this.endCol = endCol;
    this.message = message;
  }

  /**
   * Return the error as a new editor marker.
   * @returns The error in the form of an Monaco editor marker.
   */
  toMarker(): monaco.editor.IMarkerData {
    return {
      /*
       * Because of a fatal error caused by the monaco-editor library,
       * use numbers instead of the actual enum.
       * 1: Hint, 2: Info, 4: Warning, 8: Error
       */
      severity: 8,
      message: this.message,
      startLineNumber: this.startLine,
      endLineNumber: this.endLine,
      startColumn: this.startCol,
      endColumn: this.endCol,
    };
  }
}

class CollectorErrorListener extends ErrorListener {
  private errors: SLTLxError[] = [];

  constructor(errors: SLTLxError[]) {
    super();
    this.errors = errors;
  }

  syntaxError(
    _recognizer: Recognizer,
    offendingSymbol: Token,
    line: number,
    column: number,
    msg: string,
    _e: any,
  ) {
    let endColumn = column + 1;
    if (offendingSymbol !== null && offendingSymbol.text !== null) {
      endColumn = column + offendingSymbol.text.length;
    }
    this.errors.push(new SLTLxError(line, line, column, endColumn, msg));
  }
}

class SLTLxErrorStrategy extends DefaultErrorStrategy {
  reportUnwantedToken(recognizer: Parser) {
    return super.reportUnwantedToken(recognizer);
  }

  singleTokenDeletion(recognizer: Parser) {
    const nextTokenType = recognizer.getTokenStream().LA(2);
    if (recognizer.getTokenStream().LA(1) === SLTLxParser.ENDLINE) {
      return null;
    }

    const expecting = this.getExpectedTokens(recognizer);
    if (expecting.intervals.includes(nextTokenType)) {
      this.reportUnwantedToken(recognizer);
      recognizer.consume();
      const matchedSymbol = recognizer.getCurrentToken();
      this.reportMatch(recognizer);
      return matchedSymbol;
    }
    return null;
  }

  getExpectedTokens = (recognizer: Parser): Token[] => recognizer.getExpectedTokens();

  reportMatch = (recognizer: Parser) => {
    this.endErrorCondition(recognizer);
  };
}

/**
 * Validate the input and return any lexer or parser errors.
 * @param input The SLTLx to validate.
 * @returns A list of lexer or parser errors.
 */
export function validate(input: string): SLTLxError[] {
  const errors: SLTLxError[] = [];

  const lexer = createLexer(input);
  lexer.removeErrorListeners();
  lexer.addErrorListener(new CollectorErrorListener(errors));
  lexer.getAllTokens(); // Run lexer
  if (errors.length > 0) {
    /*
     * Return only lexer errors, if any exist.
     * Otherwise, parser errors might simply be a result of lexer errors,
     * which may cause confusion.
     */
    return errors;
  }

  const parser = createParserFromLexer(lexer);
  parser.removeErrorListeners();
  parser.addErrorListener(new CollectorErrorListener(errors));
  // eslint-disable-next-line no-underscore-dangle
  parser._errHandler = new SLTLxErrorStrategy();

  // Run parser and return parser errors
  parser.compilationUnit();
  return errors;
}
