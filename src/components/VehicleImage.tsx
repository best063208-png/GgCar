import {useState} from 'react';
import {Car} from 'lucide-react';

interface VehicleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function VehicleImage({src, alt, className = ''}: VehicleImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 ${className}`}
      >
        <Car className="h-12 w-12 stroke-[1.5] text-slate-400" />
        <span className="mt-2 text-xs font-medium text-slate-500">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
}
