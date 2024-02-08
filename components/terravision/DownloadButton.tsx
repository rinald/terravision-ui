'use client';

import { Download } from 'lucide-react';
import { useRef } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

async function toDataURL(url: string) {
  const blob = await fetch(url).then(res => res.blob());
  return URL.createObjectURL(blob);
}

async function download(fileName: string) {
  const a = document.createElement('a');
  a.href = await toDataURL('http://localhost:8001/terravision/output');
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const DownloadButton = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDownload = () =>
    download(inputRef.current?.value ?? 'diagram.png');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-100 font-semibold text-sm"
        >
          Download
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 relative right-2">
        <div className="grid gap-2">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-sm" htmlFor="fileName">
              Save
            </label>
            <input
              id="fileName"
              ref={inputRef}
              defaultValue="diagram.png"
              className="h-8 w-full p-2 border-2 border-gray-300 rounded-md font-medium"
              onSubmit={handleDownload}
            />
            <button
              type="button"
              className="p-2 border border-gray-300 rounded-lg"
              onClick={handleDownload}
            >
              <Download width={16} height={16} />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DownloadButton;
