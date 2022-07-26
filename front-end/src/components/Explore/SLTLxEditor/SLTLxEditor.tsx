import React from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import SLTLxTokensProvider from './SLTLxTokensProvider';

function SLTLxEditor() {
  const editorWillMount = (monaco: Monaco) => {
    monaco.languages.register({ id: 'SLTLx' });

    monaco.languages.setTokensProvider('SLTLx', new SLTLxTokensProvider());
  };

  return (
    <Editor
      height="90vh"
      defaultLanguage="SLTLx"
      defaultValue="!F Exists (?x1) (<'operation_0004'(?x1,?x1;)> true)"
      beforeMount={editorWillMount}
    />
  );
}

export default SLTLxEditor;
