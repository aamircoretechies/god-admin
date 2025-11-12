import { KeenIcon } from '@/components';

interface DummyDataIndicatorProps {
  text?: string;
  className?: string;
}

export const DummyDataIndicator = ({ 
  text = 'Dummy Data', 
  className = '' 
}: DummyDataIndicatorProps) => {
  return (
    <span 
      className={`inline-flex items-center gap-1 text-xs text-gray-500 italic ${className}`}
      title="This is dummy data - not available from API"
    >
      <KeenIcon icon="information-5" className="size-3" />
      {text}
    </span>
  );
};

