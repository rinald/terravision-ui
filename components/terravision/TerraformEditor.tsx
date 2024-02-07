'use client';

import { Editor } from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import { useRef } from 'react';

import { useConsoleOutput } from '@/lib/useConsole';
import { useTransitions } from '@/lib/useTransitions';

type Props = {
  defaultValue: string;
  fontFamily: string;
};

// extract editor type
type EditorType = Parameters<OnMount>[0];

const TerraformEditor = ({ defaultValue, fontFamily }: Props) => {
  const editorRef = useRef<EditorType | null>(null);
  const {
    validationTransition: [, startValidation],
    generationTransition: [, startGeneration]
  } = useTransitions();

  const { clearOutput, streamConsoleOutput } = useConsoleOutput();

  const handleValidation = () => {
    clearOutput();

    startValidation(async () => {
      const value = editorRef.current?.getValue();

      const stream = await fetch('/api/terravision/validate', {
        method: 'POST',
        body: value
      }).then(res => res.body);
      await streamConsoleOutput(stream);
    });
  };

  const handleGraph = () => {
    clearOutput();

    startGeneration(async () => {
      const value = editorRef.current?.getValue();

      const stream = await fetch('/api/terravision/graph', {
        method: 'POST',
        body: value
      }).then(res => res.body);
      await streamConsoleOutput(stream);
    });
  };

  const handleGeneration = () => {
    clearOutput();

    startGeneration(async () => {
      const value = editorRef.current?.getValue();

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
          type="button"
          className="px-4 py-2 rounded-lg bg-violet-800 text-white"
          onClick={handleValidation}
        >
          Validate
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-violet-800 text-white"
          onClick={handleGraph}
        >
          Graph
        </button>
        <button
          type="button"
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
