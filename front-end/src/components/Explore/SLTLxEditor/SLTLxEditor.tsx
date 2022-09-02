import React, { useState } from 'react';
import { Select, Space } from 'antd';
import Editor, { Monaco, useMonaco } from '@monaco-editor/react';
import SLTLxTokensProvider from './SLTLxTokensProvider';
import { SLTLxVS, SLTLxVSDark } from './Themes';
import { validate } from './SLTLxErrorListener';
import QuickFixes from './QuickFixes';

const { Option } = Select;

/**
 * Props definition for the SLTLxEditor component.
 */
interface SLTLxEditorProps {
  /** The height of the editor. */
  height: string | number,
  /** The theme to use for the editor. */
  theme?: string,
  /** Whether to show the dropdown for theme selection. */
  showThemeSelect?: boolean,
  /** Callback when the text in the editor has been changed. */
  onChange?: (value: string) => void,
  /** The current formula. */
  value?: string,
}

/**
 * The default SLTLx formula that is in the editor when it is initially loaded.
 *
 * This is not a formula that should actually work:
 * "root" is intended to be replaced with the root node ID of the domain the formula is used in.
 */
export const DefaultSLTLxFormula: string = "!F Exists (?x1) (<'root'(?x1,?x1;)> true)";

/**
 * Code editor component for writing SLTLx code.
 */
function SLTLxEditor(props: SLTLxEditorProps): JSX.Element {
  const { theme } = props;

  const defaultTheme = 'SLTLxVS';
  const [selectedTheme, setSelectedTheme] = useState<string>(theme);
  const monaco = useMonaco();

  /**
   * Configure Monaco before loading the editor.
   * @param m The monaco instance to configure.
   */
  const editorWillMount = (m: Monaco) => {
    m.languages.register({ id: 'SLTLx' });

    // Add language tokens
    m.languages.setTokensProvider('SLTLx', new SLTLxTokensProvider());

    // Add autocomplete
    m.languages.registerCompletionItemProvider('SLTLx', {
      provideCompletionItems(model, position, _context, _token) {
        const word = model.getWordAtPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [
          {
            label: 'Exists',
            kind: 17, // Keyword
            insertText: 'Exists',
            range,
          },
          {
            label: 'Forall',
            kind: 17, // Keyword
            insertText: 'Forall',
            range,
          },
          {
            label: 'true',
            kind: 17, // Keyword
            insertText: 'true',
            range,
          },
        ];

        return {
          suggestions,
        };
      },
    });

    // Add quick fixes for errors
    m.languages.registerCodeActionProvider('SLTLx', {
      provideCodeActions(model, range, context, token) {
        const actions = [];

        context.markers.forEach((error) => {
          // Check the available quick fixes
          QuickFixes.forEach((fix) => {
            // Add any quick fixes that are applicable
            if (fix.condition(error)) {
              actions.push(fix.action(error, model, range, context, token));
            }
          });
        });

        return {
          actions,
          dispose: () => {},
        };
      },
    });

    // Define themes
    m.editor.defineTheme('SLTLxVS', SLTLxVS());
    m.editor.defineTheme('SLTLxVSDark', SLTLxVSDark());
  };

  /**
   * Change the theme when a different theme is selected.
   * @param value The selected value.
   */
  const handleThemeChange = (value: string) => setSelectedTheme(value);

  /**
   * Handle changes to the text in the editor.
   *
   * In this case, check the SLTLx code for errors.
   * @param value The current text.
   */
  const handleTextChange = (value: string) => {
    const { onChange } = props;

    // Check for lexer or parser errors
    const errors = validate(value);

    // Show errors (if there are none, all previous errors are removed)
    if (monaco !== null) {
      const markerData = errors.map((e) => e.toMarker());
      const models = monaco.editor.getModels();
      monaco.editor.setModelMarkers(models[0], 'owner', markerData);
    }

    // Call callback function if given
    if (onChange !== null) {
      onChange(value);
    }
  };

  const { height, showThemeSelect, value } = props;

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      { showThemeSelect && (
        <Space style={{ float: 'right' }}>
          Theme:
          <Select
            defaultValue={defaultTheme}
            onChange={handleThemeChange}
            size="small"
            style={{ width: 100 }}
          >
            <Option value="SLTLxVS">vs</Option>
            <Option value="SLTLxVSDark">vs-dark</Option>
          </Select>
        </Space>
      ) }
      <Editor
        height={height}
        defaultLanguage="SLTLx"
        defaultValue={DefaultSLTLxFormula}
        language="SLTLx"
        theme={selectedTheme}
        beforeMount={editorWillMount}
        onChange={handleTextChange}
        value={value}
      />
    </Space>
  );
}

SLTLxEditor.defaultProps = {
  theme: 'SLTLxVS',
  showThemeSelect: false,
};

export default SLTLxEditor;
