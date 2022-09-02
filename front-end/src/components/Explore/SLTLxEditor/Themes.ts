/* eslint-disable import/prefer-default-export */
import * as monaco from 'monaco-editor';

/**
 * SLTLx theme based on the "vs" theme from Monaco.
 * @returns The theme data.
 */
export const SLTLxVS = (): monaco.editor.IStandaloneThemeData => {
  const keywordFg = '0000FF';
  const varFg = '344482';
  const stringFg = 'A31515';

  return {
    base: 'vs',
    inherit: true,
    rules: [
      // SLTL
      { token: 'un_modal.SLTLx', foreground: keywordFg },
      { token: 'bin_modal.SLTLx', foreground: keywordFg },
      // Keywords
      { token: 'exists.SLTLx', foreground: keywordFg },
      { token: 'forall.SLTLx', foreground: keywordFg },
      // Variables and constants
      { token: 'variable.SLTLx', foreground: varFg, fontStyle: 'italic' },
      { token: 'constant.SLTLx', foreground: stringFg },
      { token: 'true.SLTLx', foreground: keywordFg },
    ],
    colors: {},
  };
};

/**
 * SLTLx theme based on the "vs-dark" theme from Monaco.
 * @returns The theme data.
 */
export const SLTLxVSDark = (): monaco.editor.IStandaloneThemeData => {
  const keywordFg = '569CD6';
  const varFg = '74B0DF';
  const stringFg = 'CE9178';

  return {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // SLTL
      { token: 'un_modal.SLTLx', foreground: keywordFg },
      { token: 'bin_modal.SLTLx', foreground: keywordFg },
      // Keywords
      { token: 'exists.SLTLx', foreground: keywordFg },
      { token: 'forall.SLTLx', foreground: keywordFg },
      // Variables and constants
      { token: 'variable.SLTLx', foreground: varFg, fontStyle: 'italic' },
      { token: 'constant.SLTLx', foreground: stringFg },
      { token: 'true.SLTLx', foreground: keywordFg },
    ],
    colors: {},
  };
};
