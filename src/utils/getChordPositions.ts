import chords from '../vendors/chords.json';

export const getChordPositions = (key: string) => {
  if (chords.hasOwnProperty(key)) {
    return chords[key];
  }
  return ['x', 'x', 'x', 'x', 'x', 'x'];
};
