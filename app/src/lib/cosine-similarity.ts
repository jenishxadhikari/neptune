function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function magnitude(v: number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}