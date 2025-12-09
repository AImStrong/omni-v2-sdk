export function paddingSpace(str: string, len: number): string {
  while (str.length < len) str += ' ';
  return str;
}