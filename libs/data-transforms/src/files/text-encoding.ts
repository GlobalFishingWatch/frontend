export function fixTextEncoding(text: string): string {
  if (text.includes('�')) {
    let fixedText = text
      .replace(/�o/g, 'ão') // Portuguese ão
      .replace(/�a/g, 'ãa') // Portuguese ãa
      .replace(/�e/g, 'ãe') // Portuguese ãe
      .replace(/�i/g, 'ãi') // Portuguese ãi
      .replace(/�u/g, 'ãu') // Portuguese ãu

    const charReplacements = [
      { from: '�', to: 'ç' }, // Portuguese ç
      { from: '�', to: 'é' }, // French/Portuguese é
      { from: '�', to: 'ê' }, // Portuguese ê
      { from: '�', to: 'í' }, // Portuguese í
      { from: '�', to: 'ó' }, // Portuguese ó
      { from: '�', to: 'ô' }, // Portuguese ô
      { from: '�', to: 'ú' }, // Portuguese ú
      { from: '�', to: 'ü' }, // German ü
      { from: '�', to: 'ñ' }, // Spanish ñ
      { from: '�', to: '°' }, // Degree symbol
      { from: '�', to: 'ã' }, // General ã (fallback)
    ]

    for (const { from, to } of charReplacements) {
      fixedText = fixedText.replace(new RegExp(from, 'g'), to)
    }

    return fixedText
  }
  return text
}
