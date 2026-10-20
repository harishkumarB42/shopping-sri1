import React from 'react';
import { ArrowRight, ArrowUpRight, Heart, Search, SlidersHorizontal } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';

const categoryOrder = ['Sarees', 'Ethnic Sets', 'Lehengas', 'Kurtas', 'Gowns', 'Dresses', 'Jumpsuits', 'Co-ord Sets', 'Tops', 'T-Shirts', 'Shirts', 'Polos', 'Jeans', 'Trousers', 'Skirts', 'Shorts', 'Knitwear', 'Sweatshirts', 'Hoodies', 'Activewear', 'Joggers', 'Blazers', 'Jackets', 'Coats', 'Ethnic Jackets', 'Dupattas', 'Bags', 'Jewellery', 'Accessories', 'Footwear', 'Sunglasses', 'Watches'];

export default function ShopPage({ products = [], allProducts = products, query, setQuery, category, setCategory, audience, setAudience, sort, setSort, onOpenProduct, wishlist = [], onToggleWish, wishlistOnly = false, onClearWishlistFilter }) {
  const availableCategories = ['All', ...Array.from(new Set(allProducts.map((product) => product.category).filter(Boolean))).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA < 0 && indexB < 0) return a.localeCompare(b);
    if (indexA < 0) return 1;
    if (indexB < 0) return -1;
    return indexA - indexB;
  })];

  return (
    <main className="page shop-page">
      <div className="page-title-row">
        <div><span className="eyebrow">THE SRI VOGUE COLLECTION</span><h1>{wishlistOnly ? <>Your saved <em>pieces.</em></> : <>Find your <em>next favourite.</em></>}</h1><p>{wishlistOnly ? 'A personal edit of pieces you have saved for later.' : 'Explore a considered edit of clothing and accessories.'}</p></div>
        <div className="catalogue-count">{products.length}<small>{wishlistOnly ? 'SAVED PIECES' : 'CURATED PIECES'}</small></div>
      </div>

      <div className="shop-toolbar">
        <label className="shop-search"><Search size={17} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, styles, colours..." aria-label="Search products, styles and colours" /></label>
        <div className="audience-tabs" role="group" aria-label="Shop by audience">{['All', 'Women', 'Men', 'Accessories'].map((option) => <button type="button" key={option} className={audience === option ? 'active' : ''} aria-pressed={audience === option} onClick={() => setAudience(option)}>{option}</button>)}</div>
        <label className="sort-select"><SlidersHorizontal size={15} aria-hidden="true" /><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name A–Z</option></select></label>
        {wishlistOnly && <button className="text-link clear-saved-filter" type="button" onClick={onClearWishlistFilter}>SHOW ALL PIECES <ArrowRight size={14} /></button>}
      </div>

      <div className="shop-layout">
        <aside className="category-sidebar" aria-label="Filter by category"><span className="eyebrow">CATEGORIES</span>{availableCategories.map((item) => <button type="button" key={item} className={category === item ? 'active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span aria-hidden="true">{category === item ? '—' : '+'}</span></button>)}<div className="sidebar-note"><b>Need a little inspiration?</b><p>Let the AI Stylist create an edit for your next moment.</p></div></aside>
        <section className="catalogue-area" aria-label="Products">
          <div className="catalogue-topline"><span>{products.length} {products.length === 1 ? 'piece' : 'pieces'} to explore</span><span>{category === 'All' ? 'All categories' : category}</span></div>
          {products.length ? <div className="product-grid">{products.map((product) => {
            const isSaved = wishlist.includes(product.id);
            return (
              <article className="product-card" key={product.id}>
                <button className="product-media" type="button" onClick={() => onOpenProduct(product)} aria-label={`View ${product.name}`}>
                  <ProductImage product={product} />
                  {product.badge && <span className="product-tag">{product.badge}</span>}
                </button>
                <button className={`wish-button ${isSaved ? 'saved' : ''}`} type="button" onClick={() => onToggleWish(product.id)} aria-label={`${isSaved ? 'Remove' : 'Save'} ${product.name} ${isSaved ? 'from' : 'to'} wishlist`} aria-pressed={isSaved}><Heart size={17} fill={isSaved ? 'currentColor' : 'none'} /></button>
                <div className="product-info"><div><span className="product-category">{product.category}</span><h3>{product.name}</h3><small>{product.colour || product.audience || 'Sri Vogue edit'}</small></div><b>₹{Number(product.price).toLocaleString('en-IN')}</b></div>
                <button className="quick-add" type="button" onClick={() => onOpenProduct(product)}>VIEW DETAILS <ArrowUpRight size={14} /></button>
              </article>
            );
          })}</div> : <div className="empty-state"><span>✳</span><h3>{wishlistOnly ? 'Your saved edit is waiting' : 'No pieces found'}</h3><p>{wishlistOnly ? 'Tap the heart on a piece to save it here.' : 'Try another search or category.'}</p>{!wishlistOnly && <button className="btn btn-outline" type="button" onClick={() => { setQuery(''); setCategory('All'); setAudience('All'); }}>CLEAR FILTERS</button>}</div>}
        </section>
      </div>
    </main>
  );
}
