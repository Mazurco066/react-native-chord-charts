import chords from '../vendors/chords.json'

export const getChordPositions = (key: string) => {
  if (chords.hasOwnProperty(key)) {
    const chordObj = chords[key].find(() => true)
    return (chordObj !== null)
      ? chordObj.positions
      : ['x', 'x', 'x', 'x', 'x', 'x']
  } else {
    return ['x', 'x', 'x', 'x', 'x', 'x']
  }
}
