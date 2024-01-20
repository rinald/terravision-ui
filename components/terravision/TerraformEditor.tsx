'use client';

import { Editor } from '@monaco-editor/react';

type Props = {
  defaultValue: string;
  fontFamily: string;
};

const TerraformEditor = ({ defaultValue, fontFamily }: Props) => {
  return (
    <Editor
      height="90vh"
      defaultLanguage="hcl"
      defaultValue={defaultValue}
      options={{
        fontFamily: fontFamily,
        fontSize: 14,
        fontWeight: '500',
        fontLigatures: true
      }}
    />
  );
};

export default TerraformEditor;
