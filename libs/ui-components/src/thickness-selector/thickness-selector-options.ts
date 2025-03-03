type Thicknes = 'thin' | 'medium' | 'thick'
export type ThicknessSelectorOption = {
  id: Thicknes
  value: number
}

export const THICKNESS_OPTIONS: ThicknessSelectorOption[] = [
  { id: 'thin', value: 1 },
  { id: 'medium', value: 3 },
  { id: 'thick', value: 5 },
]
