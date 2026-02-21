/**
 * Determines which variant selectors (color / size) are relevant
 * for a given product, based on category slug + product title keywords.
 *
 * The API is a demo and carries no stock/variant data, so we infer
 * relevance from product name to keep the UX sensible.
 */

export type SizeType = 'eu' | 'clothing';

export interface VariantConfig {
  needsColor: boolean;
  needsSize: boolean;
  /** null when needsSize is false */
  sizeType: SizeType | null;
}

// ── Keyword lists ──────────────────────────────────────────────────────────

/** Title keywords that indicate footwear → EU sizes + color */
const SHOE_TITLE_KEYWORDS = [
  'sneaker', 'shoe', 'boot', 'trainer', 'runner', 'loafer',
  'sandal', 'slipper', 'mule', 'heel', 'pump', 'oxford',
  'derby', 'wedge', 'espadrille', 'clog',
];

/** Title keywords that indicate clothing with S/M/L sizing → clothing sizes + color */
const CLOTHING_TITLE_KEYWORDS = [
  'hoodie', 'hoody', 't-shirt', 'tshirt', 'tee', 'shirt',
  'sweatshirt', 'sweater', 'pullover', 'jersey', 'top',
  'jogger', 'joggers', 'sweatpant', 'sweatpants', 'tracksuit',
  'pant', 'pants', 'trouser', 'trousers', 'jean', 'jeans',
  'shorts', 'legging', 'leggings', 'skirt', 'dress',
  'jacket', 'coat', 'blazer', 'vest', 'cardigan',
];

/** Title keywords for accessories that only need color (no sizing) */
const COLOR_ONLY_TITLE_KEYWORDS = [
  'cap', 'hat', 'beanie', 'snapback', 'bucket hat',
  'beret', 'visor', 'headband', 'bandana',
  'bag', 'backpack', 'tote', 'wallet', 'purse', 'clutch',
  'glove', 'gloves', 'scarf', 'belt', 'sock', 'socks',
  'watch', 'bracelet', 'necklace', 'ring', 'sunglasses',
];

// ── Helper ─────────────────────────────────────────────────────────────────

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

// ── Main export ────────────────────────────────────────────────────────────

/**
 * Returns the variant config for a product.
 * Title-based detection takes priority over category slug so that,
 * e.g., a "Radiant Citrus Eau de Parfum" in Miscellaneous shows nothing,
 * while a "Classic White Tee" in Clothes shows color + sizes.
 */
export function getVariantConfig(categorySlug: string, title: string): VariantConfig {
  const slug = categorySlug?.toLowerCase() ?? '';
  const t = title?.toLowerCase() ?? '';

  // ── 1. Title-based detection (highest specificity) ──────────────────────

  if (matchesAny(t, COLOR_ONLY_TITLE_KEYWORDS)) {
    return { needsColor: true, needsSize: false, sizeType: null };
  }

  if (matchesAny(t, SHOE_TITLE_KEYWORDS)) {
    return { needsColor: true, needsSize: true, sizeType: 'eu' };
  }

  if (matchesAny(t, CLOTHING_TITLE_KEYWORDS)) {
    return { needsColor: true, needsSize: true, sizeType: 'clothing' };
  }

  // ── 2. Category slug fallback ────────────────────────────────────────────

  if (slug === 'shoes') {
    return { needsColor: true, needsSize: true, sizeType: 'eu' };
  }

  if (slug === 'clothes') {
    return { needsColor: true, needsSize: true, sizeType: 'clothing' };
  }

  // ── 3. Everything else (electronics, furniture, miscellaneous, etc.) ─────

  return { needsColor: false, needsSize: false, sizeType: null };
}
