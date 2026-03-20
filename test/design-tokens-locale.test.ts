import { describe, expect, test } from 'bun:test';
import { getModernTokens } from '../src/templates/shared/design-tokens';

describe('getModernTokens', () => {
  test('returns original values for en', () => {
    const tokens = getModernTokens('en');

    expect(tokens.typography.text.size).toBe(9);
    expect(tokens.typography.text.lineHeight).toBe(1.33);
    expect(tokens.spacing.columnWidth).toBe(180);
    expect(tokens.typography.title.textTransform).toBe('uppercase');
  });

  test('returns CJK-optimized values for zh', () => {
    const tokens = getModernTokens('zh');

    expect(tokens.typography.text.size).toBe(9.5);
    expect(tokens.typography.text.lineHeight).toBe(1.5);
    expect(tokens.spacing.columnWidth).toBe(165);
    expect(tokens.typography.title.textTransform).toBe('none');
    expect(tokens.typography.text.fontFamily).toBe('Noto Sans SC');
    expect(tokens.typography.fonts.bold).toBe('Noto Sans SC Bold');
  });

  test('zh uses a different accent color', () => {
    expect(getModernTokens('en').colors.accent).not.toBe(getModernTokens('zh').colors.accent);
  });

  test('defaults to en when locale is omitted', () => {
    expect(getModernTokens().typography.text.size).toBe(9);
  });

  test('uses isolated font families per locale', () => {
    expect(getModernTokens('en').typography.fonts.bold).toBe('Lato Bold');
    expect(getModernTokens('zh').typography.fonts.bold).toBe('Noto Sans SC Bold');
  });
});
