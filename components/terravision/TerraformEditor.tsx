'use client';

import { Editor } from '@monaco-editor/react';
import type { OnChange, OnMount } from '@monaco-editor/react';

import { Files } from '@/lib/files';
import { useRef, useState } from 'react';

import { useConsoleOutput } from '@/lib/useConsole';
import { useTransitions } from '@/lib/useTransitions';
import { cn } from '@/lib/utils';

import { ResizablePanel } from '../ui/resizable';

type Props = {
  files: Files;
  fontFamily: string;
};

// extract editor type
type EditorType = Parameters<OnMount>[0];

const TerraformEditor = ({ files, fontFamily }: Props) => {
  const [fileName, setFileName] = useState<keyof Files>('main.tf');
  const [content, setContent] = useState(files);

  const editorRef = useRef<EditorType | null>(null);
  const {
    validationTransition: [, startValidation],
    generationTransition: [, startGeneration]
  } = useTransitions();

  const { clearOutput, streamConsoleOutput } = useConsoleOutput();

  const handleChange: OnChange = value => {
    setContent(content => {
      content[fileName].value = value ?? '';
      return content;
    });
  };

  const handleValidation = () => {
    clearOutput();

    startValidation(async () => {
      const stream = await fetch('/api/terravision/validate', {
        method: 'POST',
        body: JSON.stringify(content)
      }).then(res => res.body);
      await streamConsoleOutput(stream);
    });
  };

  const handleGraph = () => {
    clearOutput();

    startGeneration(async () => {
      const stream = await fetch('/api/terravision/graph', {
        method: 'POST',
        body: JSON.stringify(content)
      }).then(res => res.body);
      await streamConsoleOutput(stream);
    });
  };

  const handleGeneration = () => {
    clearOutput();

    startGeneration(async () => {
      const stream = await fetch('/api/terravision/draw?source=/data', {
        method: 'POST',
        body: JSON.stringify(content)
      }).then(res => res.body);
      await streamConsoleOutput(stream);
    });
  };

  return (
    <ResizablePanel defaultSize={50} className="flex flex-col">
      <div className="border-b-2 p-2">
        <h2 className="text-lg font-semibold">Text Editor</h2>
        <div className="flex gap-2">
          {Object.keys(files).map(file => (
            <button
              key={file}
              type="button"
              className={cn(
                'px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-100 font-semibold text-sm',
                {
                  'bg-indigo-700 text-white hover:bg-indigo-500':
                    file === fileName
                }
              )}
              onClick={() => setFileName(file as keyof Files)}
            >
              {file}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col relative">
        <Editor
          height="85vh"
          defaultLanguage={files[fileName].language}
          path={files[fileName].name}
          defaultValue={files[fileName].value}
          onMount={editor => {
            editorRef.current = editor;
          }}
          onChange={handleChange}
          options={{
            fontFamily: fontFamily,
            fontSize: 14,
            fontWeight: '500',
            fontLigatures: true,
            minimap: {
              enabled: false
            }
          }}
        />
        <div className="flex gap-4 py-3 justify-center items-center border-t bottom-0 w-full bg-white">
          <button
            type="button"
            className="rounded-md bg-indigo-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleValidation}
          >
            Validate
          </button>
          <button
            type="button"
            className="rounded-md bg-indigo-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleGraph}
          >
            Graph
          </button>
          <button
            type="button"
            className="rounded-md bg-indigo-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleGeneration}
          >
            Generate
          </button>
        </div>
      </div>
    </ResizablePanel>
  );
};

export default TerraformEditor;
