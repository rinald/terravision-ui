'use client';

import { useConsoleOutput } from '@/lib/useConsole';

const ConsoleOutput = () => {
  const { output } = useConsoleOutput();

  return <pre>{output}</pre>;
};

export default ConsoleOutput;
