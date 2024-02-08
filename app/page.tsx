/* eslint-disable @next/next/no-img-element */
import fs from 'fs';

const exampleCode = fs.readFileSync(
  './terravision/examples/aws/lambda/main.tf',
  'utf-8'
);

import { cn } from '@/lib/utils';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';

import ConsoleOutput from '@/components/terravision/ConsoleOutput';
import Diagram from '@/components/terravision/Diagram';
import DownloadButton from '@/components/terravision/DownloadButton';
import TerraformEditor from '@/components/terravision/TerraformEditor';

import { firaCode } from './layout';

export default function Page() {
  return (
    <main className="h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full border border-gray-200 rounded-lg !flex-col md:!flex-row"
      >
        <ResizablePanel defaultSize={50} className="flex flex-col">
          <div className="border-b-2 p-2">
            <h2 className="text-lg font-semibold">Text Editor</h2>
          </div>
          <TerraformEditor
            fontFamily={firaCode.style.fontFamily}
            defaultValue={exampleCode}
          />
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={50} className="flex flex-col">
          <div className="flex justify-between border-b-2 border-t-2 md:border-t-0 p-2">
            <h2 className="text-lg font-semibold">Output</h2>
            <DownloadButton />
          </div>
          <Diagram />
          <Collapsible className="border-t">
            <CollapsibleTrigger className="px-4 py-2 cursor-pointer">
              <h3 className="text-lg font-semibold">Console Output</h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-gray-800">
              <code className="block text-sm text-gray-200 max-h-96 overflow-scroll">
                <pre className={cn(firaCode.className, 'px-4 py-2')}>
                  <ConsoleOutput />
                </pre>
              </code>
            </CollapsibleContent>
          </Collapsible>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
