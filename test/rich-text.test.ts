import { describe, expect, test } from 'bun:test';
import { parseRichSegments } from '../src/templates/shared/rich-text';

describe('parseRichSegments', () => {
  test('returns single segment for plain text', () => {
    expect(parseRichSegments('hello')).toEqual([{ text: 'hello', emphasis: false }]);
  });

  test('parses emphasis markers', () => {
    expect(parseRichSegments('a **b** c')).toEqual([
      { text: 'a ', emphasis: false },
      { text: 'b', emphasis: true },
      { text: ' c', emphasis: false },
    ]);
  });

  test('handles multiple emphasis segments', () => {
    const segments = parseRichSegments('**x** and **y**');

    expect(segments).toHaveLength(3);
    expect(segments[0]?.emphasis).toBe(true);
    expect(segments[1]?.emphasis).toBe(false);
    expect(segments[2]?.emphasis).toBe(true);
  });

  test('keeps plain text as a single segment', () => {
    expect(parseRichSegments('plain text')).toHaveLength(1);
  });
});
