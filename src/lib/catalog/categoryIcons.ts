import {
  ArrowUpDown, Bath, Boxes, Building2, DoorOpen, Layers3, Lightbulb, Paintbrush, Sofa, Wind, Zap,
} from 'lucide-react';
import type React from 'react';

/** Level-1 family icons shared by the header mega menu and the library browse page. */
export const CATEGORY_ICON_BY_ID: Record<string, React.ComponentType<{ className?: string }>> = {
  'doors-windows-openings': DoorOpen,
  'facade-envelope-materials': Layers3,
  'floors-walls-ceilings-finishes': Paintbrush,
  'sanitary-plumbing': Bath,
  'heating-cooling-ventilation': Wind,
  'electrical-safety-smart-building': Zap,
  lighting: Lightbulb,
  'kitchen-furniture-interior-equipment': Sofa,
  'structure-building-elements': Building2,
  'vertical-transportation-circulation': ArrowUpDown,
};

export function categoryIcon(categoryId: string): React.ComponentType<{ className?: string }> {
  return CATEGORY_ICON_BY_ID[categoryId] || Boxes;
}
