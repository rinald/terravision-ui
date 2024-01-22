/* eslint-disable @next/next/no-img-element */
'use client';

import DiagramSkeleton from '@/components/ui/skeleton/Diagram';
import { useTransitions } from '@/lib/useTransitions';

const Diagram = () => {
  const {
    generationTransition: [generationPending]
  } = useTransitions();

  return (
    <div className="flex-1 overflow-auto">
      {generationPending ? (
        <DiagramSkeleton />
      ) : (
        <img
          alt="Output"
          className="mx-auto my-4"
          height="800"
          src={`http://localhost:8001/terravision/output?timestamp=${Date.now()}`}
          style={{
            height: '100%',
            objectFit: 'contain'
          }}
          width="800"
        />
      )}
    </div>
  );
};

export default Diagram;
