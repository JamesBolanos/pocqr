// src/routes/product-info/[01]/[gtin]/[21]/[serie]/+page.js
export function load({ params }) {
    const { gtin, serie } = params;
    return { gtin, serie };
  }
  