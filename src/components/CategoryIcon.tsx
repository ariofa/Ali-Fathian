import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className = 'w-5 h-5' }) => {
  // Map our data.ts categories to distinct Lucide icons
  switch (iconName) {
    case 'DoorOpen':
      return <Icons.DoorOpen className={className} />;
    case 'Armchair':
      return <Icons.Sofa className={className} />;
    case 'Layers':
      return <Icons.Layers className={className} />;
    case 'Bath':
      return <Icons.Bath className={className} />;
    case 'Refrigerator':
      return <Icons.Refrigerator className={className} />;
    case 'Grid3X3':
      return <Icons.Grid3X3 className={className} />;
    case 'Lightbulb':
      return <Icons.Lightbulb className={className} />;
    case 'Wind':
      return <Icons.Fan className={className} />;
    case 'Droplet':
      return <Icons.Droplet className={className} />;
    case 'Hammer':
      return <Icons.Hammer className={className} />;
    case 'Wallpaper':
      return <Icons.Wallpaper className={className} />;
    case 'TreePine':
      return <Icons.TreePine className={className} />;
    case 'ShieldAlert':
      return <Icons.ShieldCheck className={className} />;
    case 'Cpu':
      return <Icons.Cpu className={className} />;
    default:
      return <Icons.Folder className={className} />;
  }
};
