import React, { useState } from 'react';
import { Select, Space } from 'antd';
import Editor, { Monaco, useMonaco } from '@monaco-editor/react';
import SLTLxTokensProvider from './SLTLxTokensProvider';
import { SLTLxVS, SLTLxVSDark } from './Themes';
import { validate } from './SLTLxErrorListener';

const { Option } = Select;

/**
 * Props definition for the SLTLxEditor component.
 */
interface SLTLxEditorProps {
  /** The height of the editor. */
  height: string | number,
}

/**
 * Code editor component for writing SLTLx code.
 */
function SLTLxEditor(props: SLTLxEditorProps): JSX.Element {
  const defaultTheme = 'SLTLxVS';
  const [theme, setTheme] = useState<string>(defaultTheme);
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

    // Define themes
    m.editor.defineTheme('SLTLxVS', SLTLxVS());
    m.editor.defineTheme('SLTLxVSDark', SLTLxVSDark());
  };

  /**
   * Change the theme when a different theme is selected.
   * @param value The selected value.
   */
  const handleThemeChange = (value: string) => setTheme(value);

  /**
   * Handle changes to the text in the editor.
   *
   * In this case, check the SLTLx code for errors.
   * @param value The current text.
   */
  const handleTextChange = (value: string) => {
    // Check for lexer or parser errors
    const errors = validate(value);

    // Show errors (if there are none, all previous errors are removed)
    if (monaco !== null) {
      const markerData = errors.map((e) => e.toMarker());
      const models = monaco.editor.getModels();
      monaco.editor.setModelMarkers(models[0], 'owner', markerData);
    }
  };

  const { height } = props;

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
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
      <Editor
        height={height}
        defaultLanguage="SLTLx"
        defaultValue="!F Exists (?x1) (<'operation_0004'(?x1,?x1;)> true)"
        language="SLTLx"
        theme={theme}
        beforeMount={editorWillMount}
        onChange={handleTextChange}
      />
    </Space>
  );
}

export default SLTLxEditor;
