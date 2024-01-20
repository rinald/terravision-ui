'use client';

import { Editor } from '@monaco-editor/react';

const TerraformEditor = ({ defaultValue }: { defaultValue: string }) => {
  return (
    <Editor height="90vh" defaultLanguage="hcl" defaultValue={defaultValue} />
  );
};

export default TerraformEditor;
