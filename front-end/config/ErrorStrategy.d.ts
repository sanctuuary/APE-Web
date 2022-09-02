/* eslint-disable max-classes-per-file */
import { Recognizer } from 'antlr4';

/*
 * Override the ErrorStrategy and DefaultErrorStrategy types from @types/antlr4,
 * because they are incomplete.
 */

export class ErrorStrategy {
  reset(recognizer: Recognizer): void;

  recoverInline(recognizer: Recognizer): void;

  recover(recognizer: Recognizer, e: Error): void;

  sync(recognizer: Recognizer): void;

  inErrorRecoveryMode(recognizer: Recognizer): void;

  reportError(recognizer: Recognizer): void;
}

export class DefaultErrorStrategy extends ErrorStrategy {
  endErrorCondition(recognizer: Recognizer): void;

  reportUnwantedToken(recognizer: Recognizer): void;
}
