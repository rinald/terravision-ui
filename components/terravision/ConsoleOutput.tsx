'use client';

import { useEffect, useState } from 'react';

const ConsoleOutput = () => {
  const [output, setOutput] = useState('');

  useEffect(() => {
    const streamResponse = async () => {
      const url =
        'http://localhost:8001/terravision/draw?source=/data/examples/aws/lambda';
      const stream = await fetch(url).then(response => response.body);
      const reader = stream?.getReader();

      reader?.read().then(function pump({ done, value }): any {
        if (done) {
          return;
        }

        const text = new TextDecoder('utf-8').decode(value);
        setOutput(output => output + text);

        return reader.read().then(pump);
      });
    };

    streamResponse();
  }, []);

  return <pre>{output}</pre>;
};

export default ConsoleOutput;
