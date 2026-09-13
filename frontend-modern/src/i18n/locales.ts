export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = ['en', 'de', 'es', 'zh-Hans'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type LocaleRolloutStage = 'source' | 'first-wave' | 'second-wave';

export interface SupportedLocaleDefinition {
  label: string;
  englishLabel: string;
  fallbackLocale: typeof DEFAULT_LOCALE;
  rolloutStage: LocaleRolloutStage;
}

export const SUPPORTED_LOCALE_REGISTRY: Record<SupportedLocale, SupportedLocaleDefinition> = {
  en: {
    label: 'English',
    englishLabel: 'English',
    fallbackLocale: DEFAULT_LOCALE,
    rolloutStage: 'source',
  },
  de: {
    label: 'Deutsch',
    englishLabel: 'German',
    fallbackLocale: DEFAULT_LOCALE,
    rolloutStage: 'first-wave',
  },
  es: {
    label: 'Español',
    englishLabel: 'Spanish',
    fallbackLocale: DEFAULT_LOCALE,
    rolloutStage: 'first-wave',
  },
  'zh-Hans': {
    label: '简体中文',
    englishLabel: 'Simplified Chinese',
    fallbackLocale: DEFAULT_LOCALE,
    rolloutStage: 'second-wave',
  },
};

export const FIRST_LOCALIZATION_LOCALES = [
  'de',
  'es',
] as const satisfies readonly SupportedLocale[];

export const SECOND_LOCALIZATION_LOCALES = [
  'zh-Hans',
] as const satisfies readonly SupportedLocale[];

export const NEXT_LOCALIZATION_LOCALES = ['fr', 'pt-BR', 'ja', 'ko'] as const;

export const SUPPORTED_LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: SUPPORTED_LOCALE_REGISTRY.en.label,
  de: SUPPORTED_LOCALE_REGISTRY.de.label,
  es: SUPPORTED_LOCALE_REGISTRY.es.label,
  'zh-Hans': SUPPORTED_LOCALE_REGISTRY['zh-Hans'].label,
};

const SUPPORTED_LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);

const LOCALE_ALIASES: Record<string, SupportedLocale> = {
  'en-gb': 'en',
  'en-us': 'en',
  'de-at': 'de',
  'de-ch': 'de',
  'de-de': 'de',
  'es-419': 'es',
  'es-ar': 'es',
  'es-cl': 'es',
  'es-co': 'es',
  'es-es': 'es',
  'es-mx': 'es',
  'es-pe': 'es',
  'es-us': 'es',
  // Locale input is lowercased before lookup, so the canonical `zh-Hans` tag
  // needs its own entry to resolve. `zh` and the Simplified-script regions
  // alias here too. Traditional-script tags (`zh-TW`, `zh-HK`, `zh-Hant`) are
  // deliberately absent: they fall back to English rather than serving the
  // wrong script, until a `zh-Hant` catalog exists.
  'zh-hans': 'zh-Hans',
  'zh': 'zh-Hans',
  'zh-cn': 'zh-Hans',
  'zh-sg': 'zh-Hans',
  'zh-my': 'zh-Hans',
  'zh-hans-cn': 'zh-Hans',
  'zh-hans-sg': 'zh-Hans',
};

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALE_SET.has(value);
}

export function resolveSupportedLocale(value: string | null | undefined): SupportedLocale | null {
  const normalized = value?.trim().replace(/_/g, '-').toLowerCase();
  if (!normalized) return null;
  if (isSupportedLocale(normalized)) return normalized;
  if (LOCALE_ALIASES[normalized]) return LOCALE_ALIASES[normalized];

  const baseLocale = normalized.split('-')[0] ?? '';
  return isSupportedLocale(baseLocale) ? baseLocale : null;
}

export function normalizeLocale(value: string | null | undefined): SupportedLocale {
  return resolveSupportedLocale(value) ?? DEFAULT_LOCALE;
}

export function getLocaleFallbackChain(
  value: string | null | undefined,
): readonly SupportedLocale[] {
  const locale = normalizeLocale(value);
  const fallbackLocale = SUPPORTED_LOCALE_REGISTRY[locale].fallbackLocale;
  return locale === fallbackLocale ? [locale] : [locale, fallbackLocale];
}
