export function chunk<T>(array: T[], length: number): T[][] {
  const chunks = [];
  let i = 0;
  const total = array.length;

  while (i < total) {
    chunks.push(array.slice(i, i += length));
  }

  return chunks;
}
