/* eslint-disable max-classes-per-file */
import * as monaco from 'monaco-editor';
import { Recognizer, Token } from 'antlr4';
import { ErrorListener } from 'antlr4/error/ErrorListener';
import SLTLxLexer from 'src/SLTLx/SLTLxLexer';
import { createLexer } from './ParserFacade';

export class SLTLxState implements monaco.languages.IState {
  clone(): monaco.languages.IState {
    return new SLTLxState();
  }

  equals(_other: monaco.languages.IState): boolean {
    return true;
  }
}

const EOF = -1;

class SLTLxToken implements monaco.languages.IToken {
  scopes: string;
  startIndex: number;

  constructor(ruleName: string, startIndex: number) {
    this.scopes = `${ruleName.toLowerCase()}.SLTLx`;
    this.startIndex = startIndex;
  }
}

class SLTLxLineTokens implements monaco.languages.ILineTokens {
  endState: monaco.languages.IState;
  tokens: monaco.languages.IToken[];

  constructor(tokens: monaco.languages.IToken[]) {
    this.endState = new SLTLxState();
    this.tokens = tokens;
  }
}

export function tokensForLine(input: string): monaco.languages.ILineTokens {
  const errorStartingPoints: number[] = [];

  class ErrorCollectorListener extends ErrorListener {
    syntaxError(
      _recognizer: Recognizer,
      _offendingSymbol: Token,
      _line: number,
      column: number,
      _msg: string,
      _e: any,
    ) {
      errorStartingPoints.push(column);
    }
  }

  const lexer: SLTLxLexer = createLexer(input);
  lexer.removeErrorListeners();
  const errorListener = new ErrorCollectorListener();
  lexer.addErrorListener(errorListener);
  let done = false;
  const myTokens: monaco.languages.IToken[] = [];
  do {
    const token = lexer.nextToken();
    if (token === null) {
      done = true;
    } else {
      // We exclude EOF
      // eslint-disable-next-line no-lonely-if
      if (token.type === EOF) {
        done = true;
      } else {
        const tokenTypeName = SLTLxLexer.symbolicNames[token.type];
        const myToken = new SLTLxToken(tokenTypeName, token.column);
        myTokens.push(myToken);
      }
    }
  } while (!done);

  // Add all errors
  errorStartingPoints.forEach((e) => myTokens.push(new SLTLxToken('error.SLTLx', e)));
  myTokens.sort((a, b) => ((a.startIndex > b.startIndex) ? 1 : -1));

  return new SLTLxLineTokens(myTokens);
}

export default class SLTLxTokensProvider implements monaco.languages.TokensProvider {
  getInitialState(): monaco.languages.IState {
    return new SLTLxState();
  }

  tokenize(line: string, _state: monaco.languages.IState): monaco.languages.ILineTokens {
    return tokensForLine(line);
  }
}
