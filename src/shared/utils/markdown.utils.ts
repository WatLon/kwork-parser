export function escapeMarkdownV2(text: string): string {
  // eslint-disable-next-line no-useless-escape
  return text.replace(/([_*\[\]()~`>#+\-=\|{}.!])/g, '\\$1');
}

export function normalizeTelegramText(text: string): string {
  return text
    .replace(/&mdash;/gi, '-')
    .replace(/&ndash;/gi, '-')
    .replace(/&bull;/gi, '*')
    .replace(/&quot;/gi, '"')
    .replace(/[\u2012-\u2015\u2212]/g, '-')
    .replace(/\[:([a-z0-9]+)\]/gi, (_, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex as string, 16));
      } catch {
        return '';
      }
    });
}
