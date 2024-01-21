import Image from 'next/image';
import fs from 'fs';

const exampleCode = fs.readFileSync(
  './terravision/examples/aws/lambda/main.tf',
  'utf-8'
);

import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible
} from '@/components/ui/collapsible';
import ConsoleOutput from '@/components/terravision/ConsoleOutput';
import TerraformEditor from '@/components/terravision/TerraformEditor';

import { firaCode } from './layout';

export default function Page() {
  return (
    <div className="grid h-screen w-full grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div className="flex flex-col h-full max-h-[calc(100vh - 2rem)] border border-gray-200 rounded-lg dark:border-gray-800">
        <div className="px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Text Editor</h2>
        </div>
        <TerraformEditor
          fontFamily={firaCode.style.fontFamily}
          defaultValue={exampleCode}
        />
      </div>
      <div className="flex flex-col h-full max-h-[calc(100vh-2rem)] border border-gray-200 rounded-lg dark:border-gray-800">
        <div className="px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Output</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <Image
            alt="Output"
            className="mx-auto my-4"
            height="800"
            src="http://localhost:8001/terravision/output"
            style={{
              objectFit: 'cover'
            }}
            width="800"
          />
        </div>
        <Collapsible className="border-t">
          <CollapsibleTrigger className="px-4 py-2 cursor-pointer">
            <h3 className="text-lg font-semibold">Console Output</h3>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 py-2 bg-gray-800">
            <code className="block text-sm text-gray-200 max-h-96 overflow-scroll">
              <pre className={firaCode.className}>
                <ConsoleOutput />
              </pre>
            </code>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
