export const BASE_URL = import.meta.env.PROD ? '/tracks-labeler' : ''
export const SUPPORT_EMAIL = 'support@globalfishingwatch.org'

export const UNDO_HOTKEYS =
  'control+z,command+z,control+y,command+y,control+shift+z,command+shift+z'
// we cannnot use dynamic hotkeys for labeling because is not supported by the component
// so we assing all the letter and the we see it is available in the track
export const LABEL_HOTKEYS: string = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]
  .map((key) => 'shift+' + key)
  .join(',')

export const LABELER_LOAD_PERMISSION = {
  type: 'application',
  value: 'track-labeler',
  action: 'ui.load',
}
