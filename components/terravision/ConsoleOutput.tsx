'use client';

import { useConsoleOutput } from '@/lib/useConsole';

const ConsoleOutput = () => {
  const { output } = useConsoleOutput();

  return <>{output}</>;
};

export default ConsoleOutput;
