import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text, Line, Rect } from 'react-native-svg';
import { getChordPositions } from './utils';

type ChordChartProps = {
  width?: number;
  height?: number;
  showTuning?: boolean;
  tuning?: string[];
  chordKey: string;
  color?: string;
};

const ChordChart: React.FC<ChordChartProps> = ({
  width = 100,
  height = 120,
  showTuning = false,
  tuning = ['E', 'A', 'D', 'G', 'B', 'E'],
  chordKey,
  color = '#8257E5',
}) => {
  const chord: string[] = getChordPositions(chordKey);

  let fretPosition = 0;
  let lower = 100;

  chord.forEach(c => {
    if (c !== 'x') {
      const parsedC = parseInt(c, 10);
      if (parsedC < lower) {
        lower = parsedC;
      }
    }
  });

  let normalizedChord = [...chord];
  if (lower === 100) {
    fretPosition = 0;
  } else if (lower >= 3) {
    fretPosition = lower;
    normalizedChord = chord.map(c => (c === 'x' ? 'x' : (parseInt(c) - (lower - 1)).toString()));
  }

  const barres: { from: number; to: number; fret: number }[] = [];

  const tuningContainerHeight = 20;
  const chartWidth = width * 0.75;
  const chartHeight = showTuning ? height * 0.75 - tuningContainerHeight : height * 0.75;

  const circleRadius = chartWidth / 15;
  const bridgeStrokeWidth = Math.ceil(chartHeight / 36);
  const fontSize = Math.ceil(chartWidth / 8);
  const numStrings = chord.length;
  const numFrets = 5;

  const fretWidth = 1;
  const stringWidth = 1;

  const defaultColor = color;
  const strokeWidth = 1;

  const stringSpacing = chartWidth / numStrings;
  const chartXPos = width - chartWidth;
  const chartYPos = showTuning ? height - chartHeight - tuningContainerHeight : height - chartHeight;

  const fretLabelTextWidth = 10;
  const fretSpacing = chartHeight / numFrets;

  const drawText = (x: number, y: number, msg: string) => (
    <Text
      key={`text-${x}-${y}-${msg}`}
      fill={defaultColor}
      stroke={defaultColor}
      fontSize={fontSize}
      x={x}
      y={y}
      textAnchor="middle"
    >
      {msg}
    </Text>
  );

  const lightUp = (stringNum: number, fret: string) => {
    const mute = fret === 'x';
    const fretNum = mute ? 0 : parseInt(fret, 10);

    const x = chartXPos + stringSpacing * stringNum;
    const y1 = chartYPos + fretSpacing * fretNum - fretSpacing / 2;

    const stringIsLoose = fretNum === 0;
    if (!mute && !stringIsLoose) {
      return (
        <Circle
          key={`finger-${stringNum}`}
          cx={x}
          cy={y1}
          r={circleRadius}
          strokeWidth={strokeWidth}
          stroke={defaultColor}
          fill={defaultColor}
        />
      );
    }

    return null;
  };

  const lightBar = (stringFrom: number, stringTo: number, fretNum: number) => {
    const stringFromNum = numStrings - stringFrom;
    const stringToNum = numStrings - stringTo;

    const y1 = chartYPos + fretSpacing * (fretNum - 1) + fretSpacing / 2;

    return (
      <Line
        key={`bar-${stringFrom}-${stringTo}-${fretNum}`}
        strokeWidth={circleRadius * 2}
        strokeLinecap="round"
        stroke={defaultColor}
        x1={chartXPos + stringSpacing * stringFromNum}
        y1={y1}
        x2={chartXPos + stringSpacing * stringToNum}
        y2={y1}
      />
    );
  };

  return (
    <View
      style={[
        { height, width },
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Svg height={height} width={width}>
        {fretPosition <= 1 ? (
          <Rect
            fill={defaultColor}
            width={chartWidth - stringSpacing}
            height={bridgeStrokeWidth}
            x={chartXPos}
            y={chartYPos}
          />
        ) : (
          drawText(
            chartXPos - fretLabelTextWidth,
            chartYPos + fontSize - fretWidth + (fretSpacing - fontSize) / 2,
            `${fretPosition}º`
          )
        )}
        {Array.from(Array(numStrings)).map((_, i) => (
          <Line
            key={`string-${i}`}
            strokeWidth={stringWidth}
            stroke={defaultColor}
            x1={chartXPos + stringSpacing * i}
            y1={chartYPos}
            x2={chartXPos + stringSpacing * i}
            y2={chartYPos + fretSpacing * numFrets}
          />
        ))}
        {Array.from(Array(numFrets)).map((_, i) => (
          <Line
            key={`fret-${i}`}
            strokeWidth={fretWidth}
            stroke={defaultColor}
            x1={chartXPos}
            y1={chartYPos + fretSpacing * i}
            x2={chartXPos + stringSpacing * (numStrings - 1)}
            y2={chartYPos + fretSpacing * i}
          />
        ))}
        {normalizedChord.map((c, i) => {
          if (c === 'x') {
            return drawText(chartXPos + stringSpacing * i, chartYPos - fontSize, 'X');
          } else if (c === '0') {
            return (
              <Circle
                key={`circle-${i}`}
                cx={chartXPos + stringSpacing * i}
                cy={chartYPos - fontSize - circleRadius}
                r={circleRadius}
                strokeWidth={strokeWidth}
                stroke={defaultColor}
                fill="none"
              />
            );
          }
        })}
        {normalizedChord.map((c, i) => lightUp(i, c))}
        {barres.map(barre => lightBar(barre.from, barre.to, barre.fret))}
        {showTuning &&
          tuning.length === numStrings &&
          tuning.map((t, i) =>
            drawText(chartXPos + stringSpacing * i, chartYPos + chartHeight + fontSize, t)
          )}
      </Svg>
    </View>
  );
};

export default ChordChart;
