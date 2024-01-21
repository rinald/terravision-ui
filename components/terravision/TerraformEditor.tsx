'use client';

import { useRef, useTransition } from 'react';
import { Editor } from '@monaco-editor/react';

import { useConsoleOutput } from '@/lib/useConsole';

type Props = {
  defaultValue: string;
  fontFamily: string;
};

const TerraformEditor = ({ defaultValue, fontFamily }: Props) => {
  const editorRef = useRef<any>(null);
  const [validationPending, startValidation] = useTransition();
  const [generationPending, startGeneration] = useTransition();

  const { streamConsoleOutput } = useConsoleOutput();

  const handleValidation = () => {
    startValidation(async () => {
      const value = editorRef.current.getValue();

      const stream = await fetch('/api/terravision/validate', {
        method: 'POST',
        body: value
      }).then(res => res.body);
      await streamConsoleOutput(stream);
    });
  };

  const handleGeneration = () => {
    startGeneration(async () => {
      const value = editorRef.current.getValue();

      const stream = await fetch('/api/terravision/draw?source=/data', {
        method: 'POST',
        body: value
      }).then(res => res.body);
      await streamConsoleOutput(stream);
    });
  };

  return (
    <div className="flex flex-col relative">
      <Editor
        height="85vh"
        defaultLanguage="hcl"
        defaultValue={defaultValue}
        onMount={editor => {
          editorRef.current = editor;
        }}
        options={{
          fontFamily: fontFamily,
          fontSize: 14,
          fontWeight: '500',
          fontLigatures: true
        }}
      />
      <div className="flex gap-4 py-3 justify-center items-center border-t bottom-0 w-full bg-white">
        <button
          className="px-4 py-2 rounded-lg bg-violet-800 text-white"
          onClick={handleValidation}
        >
          Validate
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-violet-800 text-white"
          onClick={handleGeneration}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default TerraformEditor;
