/**
 * Limpia el texto Markdown recibido, eliminando saltos innecesarios y dejando un formato limpio.
 * @param text Texto en Markdown
 * @returns Texto limpio
 */
export function cleanMarkdownResponse(text: string): string {
  return text
    .replace(/\\n/g, "\n") // convertir saltos escapados
    .replace(/(\n\s*){2,}/g, "\n") // reemplazar múltiples saltos por uno solo
    .replace(/(?<=\n[*+-]|\n\s{2,}[*+-])\n+/g, "") // quitar saltos entre items de lista y sublista
    .replace(/^\n+|\n+$/g, "") // quitar saltos al principio y al final
    .trim();
}
