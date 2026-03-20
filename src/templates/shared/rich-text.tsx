import React from 'react';
import { Text, type TextProps } from '@react-pdf/renderer';
import { useLocale } from './locale-context';

export type RichSegment = {
  text: string;
  emphasis: boolean;
};

export const parseRichSegments = (text: string): RichSegment[] => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  if (parts.length === 0) {
    return [{ text, emphasis: false }];
  }

  return parts.map((part) =>
    part.startsWith('**') && part.endsWith('**')
      ? { text: part.slice(2, -2), emphasis: true }
      : { text: part, emphasis: false },
  );
};

type RichTextProps = {
  text: string;
  style?: TextProps['style'];
};

export const RichText = ({ text, style }: RichTextProps) => {
  const { tokens } = useLocale();
  const segments = parseRichSegments(text);
  const emphasisStyle = {
    color: '#1a4f8b',
    fontFamily: tokens.typography.fonts.bold,
  } as const;

  if (segments.length === 1 && !segments[0]?.emphasis) {
    return <Text style={style}>{text}</Text>;
  }

  return (
    <Text style={style}>
      {segments.map((segment, index) =>
        segment.emphasis ? (
          <Text key={`${segment.text}-${index}`} style={emphasisStyle}>
            {segment.text}
          </Text>
        ) : (
          segment.text
        ),
      )}
    </Text>
  );
};
