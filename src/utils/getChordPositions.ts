import chords from '../vendors/chords.json'

export const getChordPositions = (key: string) => {
  const sanitizedKey: string = key.replace(/\s/g, '')
  if (chords.hasOwnProperty(sanitizedKey)) {
    const chordObj = chords[sanitizedKey].find(() => true)
    return (chordObj !== null)
      ? chordObj.positions
      : ['x', 'x', 'x', 'x', 'x', 'x']
  } else {
    return ['x', 'x', 'x', 'x', 'x', 'x']
  }
}
