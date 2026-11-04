/** File-type checks by leading bytes, so downloads are verified without extra parsing libraries. */

/** PDF files start with `%PDF`. */
export function isPdf(buf: Buffer): boolean {
  return buf.subarray(0, 4).toString('latin1') === '%PDF';
}

/** ZIP containers (PPTX, XLSX) start with `PK\x03\x04`. */
export function isZip(buf: Buffer): boolean {
  return buf.length >= 4 && buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04;
}
