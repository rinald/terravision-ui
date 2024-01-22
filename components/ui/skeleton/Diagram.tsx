import { ImageIcon } from '@radix-ui/react-icons';

const DiagramSkeleton = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-300 animate-pulse">
      <div className="grid justify-center items-center w-96 h-96 rounded-sm">
        <ImageIcon width={200} height={200} color="gray" />
      </div>
    </div>
  );
};

export default DiagramSkeleton;
