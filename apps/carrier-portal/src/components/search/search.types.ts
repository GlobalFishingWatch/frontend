export interface DataValue {
  id: string
  label: string
}

export interface DataSelection {
  type: string
  values: DataValue[]
}

export interface DataSelectionGrouped {
  [type: string]: DataSelection
}
