import React, { useState } from 'react';
import { Select, Space } from 'antd';
import Editor, { Monaco } from '@monaco-editor/react';
import SLTLxTokensProvider from './SLTLxTokensProvider';
import { SLTLxVS, SLTLxVSDark } from './Themes';

const { Option } = Select;

function SLTLxEditor() {
  const defaultTheme = 'SLTLxVS';
  const [theme, setTheme] = useState<string>(defaultTheme);

  /**
   * Configure Monaco before loading the editor.
   * @param monaco The monaco instance to configure.
   */
  const editorWillMount = (monaco: Monaco) => {
    monaco.languages.register({ id: 'SLTLx' });

    monaco.languages.setTokensProvider('SLTLx', new SLTLxTokensProvider());

    monaco.editor.defineTheme('SLTLxVS', SLTLxVS());
    monaco.editor.defineTheme('SLTLxVSDark', SLTLxVSDark());
  };

  /**
   * Change the theme when a different theme is selected.
   * @param value The selected value.
   */
  const handleThemeChange = (value: string) => setTheme(value);

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
        height="90vh"
        defaultLanguage="SLTLx"
        defaultValue="!F Exists (?x1) (<'operation_0004'(?x1,?x1;)> true)"
        language="SLTLx"
        theme={theme}
        beforeMount={editorWillMount}
      />
    </Space>
  );
}

export default SLTLxEditor;
