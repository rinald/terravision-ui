/* eslint-disable @next/next/no-img-element */
'use client';

import DiagramSkeleton from '@/components/ui/skeleton/Diagram';
import { useTransitions } from '@/lib/useTransitions';

import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

const Diagram = () => {
  const {
    generationTransition: [generationPending]
  } = useTransitions();

  return (
    <div className="flex-1 overflow-auto">
      {generationPending ? (
        <DiagramSkeleton />
      ) : (
        <TransformWrapper>
          <TransformComponent
            wrapperClass="!w-full !h-full cursor-move"
            contentClass="!w-full !h-full"
          >
            <img
              alt="Output"
              className="mx-auto my-4 p-8"
              height="800"
              src={`http://localhost:8001/terravision/output?timestamp=${Date.now()}`}
              style={{
                height: '100%',
                objectFit: 'contain'
              }}
              width="800"
            />
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
};

export default Diagram;
