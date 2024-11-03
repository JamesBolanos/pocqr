// src/routes/product-info/[01]/[gtin]/[21]/[serial]/+page.js
export function load({ params }) {
    const { gtin, serial } = params;
    return { gtin, serial };
  }
  