
import React, { useMemo, useState } from "react";
import {
  Heart,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { seedProducts as products } from "../products.js";
import ProductImage from "../components/ProductImage.jsx";

export default function ProductCatalog({
  onSelectProduct,
  onAdd,
  onToggleWish,
  wishlist = [],
}) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        `${product.name} ${product.category} ${product.colour}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") {
      result.sort(
        (a, b) =>
          Number(b.isBestseller) - Number(a.isBestseller) ||
          Number(b.isNew) - Number(a.isNew)
      );
    }

    return result;
  }, [category, search, sort]);

  const money = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  const saved = (id) =>
    wishlist.some((item) =>
      typeof item === "object" ? item.id === id : item === id
    );

  return (
    <main className="sv-catalog">
      <style>{`
        .sv-catalog {
          --sv-wine: #701626;
          --sv-gold: #b99a64;
          --sv-cream: #fbf6ef;
          --sv-ink: #392a24;
          background: #fffdf9;
          color: var(--sv-ink);
          padding: 40px clamp(14px, 4vw, 60px) 64px;
          font-family: inherit;
          box-sizing: border-box;
          width: 100%;
        }

        .sv-catalog *,
        .sv-catalog *::before,
        .sv-catalog *::after {
          box-sizing: border-box;
        }

        .sv-catalog-heading {
          text-align: center;
          margin: 0 auto 32px;
        }

        .sv-catalog-kicker {
          color: var(--sv-gold);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .sv-catalog-heading h2 {
          font-family: Georgia, serif;
          color: var(--sv-wine);
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 400;
          line-height: 1.15;
          margin: 12px 0;
        }

        .sv-catalog-heading p {
          font-size: 13px;
          color: #81736a;
          line-height: 1.7;
          margin: 0;
        }

        .sv-catalog-tools {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
        }

        .sv-search {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          width: min(100%, 390px);
          min-height: 43px;
          border: 1px solid #e7dbce;
          background: white;
        }

        .sv-search svg {
          color: #89786c;
          flex-shrink: 0;
        }

        .sv-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          color: var(--sv-ink);
          background: transparent;
          font: inherit;
          font-size: 12px;
        }

        .sv-sort {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #75665b;
          font-size: 11px;
        }

        .sv-sort select {
          max-width: 175px;
          padding: 12px 8px;
          border: 1px solid #e7dbce;
          background: white;
          color: var(--sv-wine);
          font: inherit;
          font-size: 11px;
        }

        .sv-categories {
          display: flex;
          align-items: center;
          gap: 9px;
          overflow-x: auto;
          padding: 3px 0 12px;
          scrollbar-width: thin;
        }

        .sv-category {
          flex-shrink: 0;
          padding: 10px 16px;
          border: 1px solid #e6d7c9;
          background: transparent;
          color: #6b5a50;
          font: inherit;
          font-size: 11px;
          cursor: pointer;
          transition: background .2s, color .2s;
        }

        .sv-category.active,
        .sv-category:hover {
          color: white;
          background: var(--sv-wine);
          border-color: var(--sv-wine);
        }

        .sv-result-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin: 12px 0 20px;
        }

        .sv-result-count {
          color: #8b7b70;
          font-size: 11px;
          margin: 0;
        }

        .sv-product-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 30px 16px;
        }

        .sv-product-card {
          min-width: 0;
        }

        .sv-product-image-wrap {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: var(--sv-cream);
          cursor: pointer;
        }

        .sv-product-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s ease;
        }

        .sv-product-card:hover .sv-product-image {
          transform: scale(1.045);
        }

        .sv-product-badge {
          position: absolute;
          left: 9px;
          top: 9px;
          background: #fffaf3;
          color: var(--sv-wine);
          padding: 7px 8px;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .sv-wishlist {
          position: absolute;
          right: 9px;
          top: 9px;
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: rgba(255,255,255,.94);
          color: var(--sv-wine);
          cursor: pointer;
        }

        .sv-wishlist.saved {
          color: white;
          background: var(--sv-wine);
        }

        .sv-product-info {
          padding: 13px 2px 0;
        }

        .sv-product-category {
          color: #a08768;
          font-size: 9px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .sv-product-name {
          margin: 7px 0;
          font-family: Georgia, serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.45;
          color: #392a24;
          cursor: pointer;
        }

        .sv-product-colour {
          margin-bottom: 9px;
          color: #8b7b70;
          font-size: 10px;
        }

        .sv-product-price {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
          color: var(--sv-wine);
          font-size: 13px;
          font-weight: 600;
        }

        .sv-product-old-price {
          color: #9d9187;
          font-size: 11px;
          font-weight: 400;
          text-decoration: line-through;
        }

        .sv-add-button {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          width: 100%;
          margin-top: 13px;
          padding: 12px 7px;
          border: 1px solid var(--sv-wine);
          background: transparent;
          color: var(--sv-wine);
          font: inherit;
          font-size: 10px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background .2s, color .2s;
        }

        .sv-add-button:hover {
          color: white;
          background: var(--sv-wine);
        }

        .sv-empty {
          grid-column: 1 / -1;
          padding: 60px 12px;
          text-align: center;
          color: #8b7b70;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .sv-product-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px 12px;
          }
        }

        @media (max-width: 600px) {
          .sv-catalog {
            padding: 28px 12px 42px;
          }

          .sv-catalog-heading {
            margin-bottom: 22px;
          }

          .sv-catalog-heading p {
            font-size: 12px;
          }

          .sv-catalog-tools {
            flex-wrap: wrap;
            gap: 12px;
          }

          .sv-search {
            width: 100%;
            max-width: none;
          }

          .sv-sort {
            width: 100%;
            justify-content: flex-end;
          }

          .sv-category {
            padding: 9px 12px;
          }

          .sv-product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px 10px;
          }

          .sv-product-info {
            padding-top: 10px;
          }

          .sv-product-name {
            font-size: 13px;
          }

          .sv-product-badge {
            top: 6px;
            left: 6px;
            padding: 6px;
            font-size: 7px;
          }

          .sv-wishlist {
            top: 6px;
            right: 6px;
            width: 30px;
            height: 30px;
          }

          .sv-add-button {
            gap: 5px;
            padding: 11px 3px;
            font-size: 9px;
            letter-spacing: .5px;
          }
        }
      `}</style>

      <header className="sv-catalog-heading">
        <span className="sv-catalog-kicker">
          Curated for your moments
        </span>
        <h2>The Sri Vogue Collection</h2>
        <p>
          Timeless Indian elegance, thoughtfully selected for you.
        </p>
      </header>

      <div className="sv-catalog-tools">
        <label className="sv-search">
          <Search size={16} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sarees, dresses, jewellery..."
            aria-label="Search products"
          />
        </label>

        <label className="sv-sort">
          <SlidersHorizontal size={15} />
          <span>Sort:</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      <nav className="sv-categories" aria-label="Product categories">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={`sv-category ${category === item ? "active" : ""}`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="sv-result-row">
        <p className="sv-result-count">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      <div className="sv-product-grid">
        {filteredProducts.length === 0 ? (
          <div className="sv-empty">
            No products found. Try another search or category.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isSaved = saved(product.id);

            return (
              <article className="sv-product-card" key={product.id}>
                <div
                  className="sv-product-image-wrap"
                  onClick={() => onSelectProduct?.(product)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectProduct?.(product);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${product.name}`}
                >
                  <ProductImage product={product} className="sv-product-image"/>

                  {product.isNew && (
                    <span className="sv-product-badge">NEW ARRIVAL</span>
                  )}

                  {!product.isNew && product.isBestseller && (
                    <span className="sv-product-badge">BESTSELLER</span>
                  )}

                  <button
                    type="button"
                    className={`sv-wishlist ${isSaved ? "saved" : ""}`}
                    aria-label={
                      isSaved ? "Remove from wishlist" : "Add to wishlist"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleWish?.(product.id);
                    }}
                  >
                    <Heart
                      size={16}
                      fill={isSaved ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <div className="sv-product-info">
                  <span className="sv-product-category">
                    {product.category}
                  </span>

                  <h3
                    className="sv-product-name"
                    onClick={() => onSelectProduct?.(product)}
                  >
                    {product.name}
                  </h3>

                  <div className="sv-product-colour">
                    {product.colour}
                  </div>

                  <div className="sv-product-price">
                    {money(product.price)}
                    {product.oldPrice > product.price && (
                      <span className="sv-product-old-price">
                        {money(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="sv-add-button"
                    onClick={() =>
                      onAdd?.(product, product.sizes?.[0] || "Free size")
                    }
                  >
                    <ShoppingBag size={14} />
                    ADD TO BAG
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
