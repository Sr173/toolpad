import { StudioBindingFormat } from '../types';

type ParsedBinding = string[];

export function parse(expr: string): ParsedBinding {
  return expr.split(/{{\s*([a-zA-Z0-9.]+?)\s*}}/);
}

export function getInterpolations(parts: ParsedBinding): string[] {
  return parts.filter((part, i) => i % 2 === 1);
}

function toTemplateStringExpression(parts: ParsedBinding): string {
  if (parts.length === 3 && !parts[0] && !parts[2]) {
    return parts[1];
  }
  const transformedParts = parts.map((part, i) =>
    i % 2 === 0 ? part.replaceAll('`', '\\`') : `\${${part}}`,
  );
  return `\`${transformedParts.join('')}\``;
}

export function format(
  expr: ParsedBinding,
  bindingFormat: StudioBindingFormat = 'default',
): string {
  switch (bindingFormat) {
    case 'stringLiteral':
      return toTemplateStringExpression(expr);
    case 'default':
      return expr.join('');
    default:
      throw new Error(`Invariant: Unrecognized binding format "${bindingFormat}"`);
  }
}

export function resolve(
  expr: ParsedBinding,
  transform: (interpolation: string) => string,
): ParsedBinding {
  return expr.map((part, i) => {
    if (i % 2 === 1) {
      return transform(part);
    }
    return part;
  });
}
