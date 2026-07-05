import React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Car,
  House,
  Building2,
  Laptop,
  Package,
  BriefcaseBusiness,
  Dumbbell,
  Wheat,
  Grid2x2,
} from 'lucide-react'

const categoryIconMap: Record<string, LucideIcon> = {
  Automobili: Car,
  Nekretnine: House,
  Stanovi: Building2,
  Tehnika: Laptop,
  'Lične stvari': Package,
  Posao: BriefcaseBusiness,
  Sport: Dumbbell,
  Poljoprivreda: Wheat,
  Ostalo: Grid2x2,
}

export const getCategoryIcon = (categoryName: string): LucideIcon => {
  return categoryIconMap[categoryName] || Grid2x2
}

interface CategoryIconProps {
  categoryName: string
  size?: number
  className?: string
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryName,
  size = 20,
  className,
}) => {
  const Icon = getCategoryIcon(categoryName)
  return <Icon size={size} className={className} />
}
