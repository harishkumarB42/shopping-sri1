import React, { useState } from 'react';
import { ArrowLeft, Check, Heart, Minus, Plus, Ruler, ShoppingBag, X } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';

export default function ProductDetail({ product, onBack, onAdd, onToggleWish, isSaved }) {
  const [size, setSize] = useState(product.sizes?.[0] || 'Free size');
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const sizes = product.sizes?.length ? product.sizes : ['Free size'];

  return (
    <main className="page detail-page">
      <button className="back-link" type="button" onClick={onBack}><ArrowLeft size={16} /> BACK TO COLLECTION</button>
      <div className="detail-layout">
        <div className="detail-gallery"><div className="detail-main-image"><ProductImage product={product} className="detail-photo" loading="eager" /></div><p className="detail-image-note"><span>✦</span> A considered piece from the Sri Vogue edit</p></div>
        <section className="detail-copy" aria-labelledby="product-title">
          <span className="eyebrow">SRI VOGUE · {product.category}</span>
          <h1 id="product-title">{product.name}</h1>
          <div className="detail-price">₹{Number(product.price).toLocaleString('en-IN')} {product.oldPrice > product.price && <del>₹{Number(product.oldPrice).toLocaleString('en-IN')}</del>}</div>
          <p>{product.description || 'A considered addition to your wardrobe, selected for versatility, thoughtful details and effortless styling.'}</p>
          <div className="detail-meta"><span>COLOUR</span><b>{product.colour || 'Sri Vogue edit'}</b></div>
          <div className="detail-meta"><span>COLLECTION</span><b>{product.style || 'New season'}</b></div>
          <div className="size-heading"><span>SELECT SIZE</span><button type="button" onClick={() => setSizeGuideOpen(true)}><Ruler size={13} /> Size guide</button></div>
          <div className="size-options" role="group" aria-label="Select a size">{sizes.map((option) => <button type="button" key={option} className={size === option ? 'active' : ''} aria-pressed={size === option} onClick={() => setSize(option)}>{option}{size === option && <Check size={12} />}</button>)}</div>
          <div className="detail-buy-row"><div className="qty-control" aria-label="Quantity"><button type="button" aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}><Minus size={13} /></button><b aria-live="polite">{qty}</b><button type="button" aria-label="Increase quantity" onClick={() => setQty((value) => Math.min(10, value + 1))}><Plus size={13} /></button></div><button className="btn btn-primary add-to-bag" type="button" onClick={() => onAdd(product, size, qty)}><ShoppingBag size={16} /> ADD TO BAG · ₹{(product.price * qty).toLocaleString('en-IN')}</button><button className={`detail-wish ${isSaved ? 'saved' : ''}`} type="button" aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={isSaved} onClick={() => onToggleWish(product.id)}><Heart fill={isSaved ? 'currentColor' : 'none'} /></button></div>
          <div className="detail-promises"><span>✓ Secure checkout</span><span>✓ Easy returns within 7 days</span><span>✓ Complimentary shipping above ₹1,999</span></div>
        </section>
      </div>
      {sizeGuideOpen && <div className="size-guide-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSizeGuideOpen(false)}><section className="size-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="size-guide-title"><button className="icon-btn size-guide-close" type="button" aria-label="Close size guide" onClick={() => setSizeGuideOpen(false)}><X /></button><span className="eyebrow">A LITTLE HELP</span><h2 id="size-guide-title">Size guide</h2><p>The options below reflect the sizes currently available for this item. Garment fit varies by style, so please check the product description for item-specific details.</p><div className="size-guide-list">{sizes.map((option, index) => <div key={option}><b>{option}</b><span>{sizes.length === 1 ? 'One size' : 'Available'}</span></div>)}</div><button className="btn btn-primary" type="button" onClick={() => setSizeGuideOpen(false)}>GOT IT</button></section></div>}
    </main>
  );
}
