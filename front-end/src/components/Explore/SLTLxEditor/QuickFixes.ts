import * as monaco from 'monaco-editor';

/**
 * A quick fix for the SLTLx language in the SLTLx editor.
 */
interface QuickFix {
  /**
   * Check if the quick fix is applicable on the given error.
   * @param error The error on which the quick fix might apply.
   * @returns Whether the quick fix is applicable.
   */
  condition: (error: monaco.editor.IMarkerData) => boolean;
  /**
   * The action the quick fix performs.
   * @param error The error for which the action is performed.
   * @param model The editor model in which the action is performed.
   * @param range The range of the error, where the action is performed.
   * @param context The context of the error.
   * @param token The token related to the error.
   */
  action: (
    error: monaco.editor.IMarkerData,
    model: monaco.editor.ITextModel,
    range: monaco.Range,
    context: monaco.languages.CodeActionContext,
    token: monaco.CancellationToken,
  ) => any;
}

/**
 * All available quick fixes for the SLTLx language.
 */
const QuickFixes: QuickFix[] = [
  {
    condition: (error) => error.message.includes("missing ')'"),
    action: (error, model, _range, _context, _token) => ({
      title: "Add missing ')'",
      diagnostics: [error],
      kind: 'quickfix',
      edit: {
        edits: [
          {
            resource: model.uri,
            edit: {
              range: {
                startLineNumber: error.startLineNumber,
                endLineNumbeR: error.endLineNumber,
                startColumn: error.startColumn + 1,
                endColumn: error.endColumn,
              },
              text: ')',
            },
          },
        ],
      },
      isPreferred: true,
    }),
  },
  {
    condition: (error) => {
      const m = error.message.match('Ex?i?s?t?');
      return m !== null && m.length > 0;
    },
    action: (error, model, _range, _context, _token) => ({
      title: "Replace with 'Exists'",
      diagnostics: [error],
      kind: 'quickfix',
      edit: {
        edits: [
          {
            resource: model.uri,
            edit: {
              range: error,
              text: 'Exists',
            },
          },
        ],
      },
      isPreferred: true,
    }),
  },
  {
    condition: (error) => {
      const m = error.message.match('Fo?r?a?l?');
      return m !== null && m.length > 0;
    },
    action: (error, model, _range, _context, _token) => ({
      title: "Replace with 'Forall'",
      diagnostics: [error],
      kind: 'quickfix',
      edit: {
        edits: [
          {
            resource: model.uri,
            edit: {
              range: error,
              text: 'Forall',
            },
          },
        ],
      },
      isPreferred: true,
    }),
  },
];

export default QuickFixes;
