'use client';

import { useState, createContext, useContext } from 'react';

type Props = {
  output: string;
  clearOutput: () => void;
  streamConsoleOutput: (stream: ReadableStream | null) => Promise<void>;
};

const ConsoleOutputContext = createContext<Props>({
  output: '',
  clearOutput: () => {},
  streamConsoleOutput: (stream: ReadableStream | null) => Promise.resolve()
});

const useConsole = () => {
  const [output, setOutput] = useState('');

  const clearOutput = () => setOutput('');

  const streamConsoleOutput = async (stream: ReadableStream | null) => {
    const reader = stream?.getReader();

    const pump = async ({ done, value }: any) => {
      if (done) {
        return;
      }

      const text = new TextDecoder('utf-8').decode(value);
      const cleanText = text.replace(/\x1B\[[0-9;]*[mG]/g, ''); // Remove color codes
      setOutput(output => output + cleanText);

      await reader?.read().then(pump);
    };

    return await reader?.read().then(pump);
  };

  return {
    output,
    clearOutput,
    streamConsoleOutput
  };
};

const ConsoleOutputProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useConsole();

  return (
    <ConsoleOutputContext.Provider value={value}>
      {children}
    </ConsoleOutputContext.Provider>
  );
};

const useConsoleOutput = () => useContext(ConsoleOutputContext);

export { ConsoleOutputProvider, useConsoleOutput };
