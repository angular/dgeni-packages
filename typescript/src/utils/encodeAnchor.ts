export function encodeAnchor(anchor: string) {
  return encodeURIComponent(anchor).replace(/'/g, "%27");
}
