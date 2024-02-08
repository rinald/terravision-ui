'use client';

async function toDataURL(url: string) {
  const blob = await fetch(url).then(res => res.blob());
  return URL.createObjectURL(blob);
}

async function download() {
  const a = document.createElement('a');
  a.href = await toDataURL('http://localhost:8001/terravision/output');
  a.download = 'diagram.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const DownloadButton = () => {
  return (
    <button
      type="button"
      className="px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-100 font-semibold text-md"
      onClick={download}
    >
      Download
    </button>
  );
};

export default DownloadButton;
