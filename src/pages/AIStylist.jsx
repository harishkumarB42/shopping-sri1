import React, { useMemo, useRef, useState } from 'react';
import ProductImage from '../components/ProductImage.jsx';
import { Camera, Sparkles, Heart, ShoppingBag, Upload, WandSparkles, Palette, RefreshCw } from 'lucide-react';

const colorWords = [
  { name: 'Black', rgb: [30, 30, 32] }, { name: 'Ivory', rgb: [235, 225, 207] },
  { name: 'Red', rgb: [170, 45, 55] }, { name: 'Pink', rgb: [218, 139, 163] },
  { name: 'Blue', rgb: [55, 95, 150] }, { name: 'Green', rgb: [58, 112, 78] },
  { name: 'Gold', rgb: [190, 150, 75] }, { name: 'Purple', rgb: [125, 80, 145] },
  { name: 'Brown', rgb: [125, 82, 56] }, { name: 'White', rgb: [245, 243, 236] },
];
const distance = (a, b) => Math.sqrt(a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0));

export default function AIStylist({ products = [], onOpenProduct, onAdd, onToggleWish, wishlist = [], onBackToShop }) {
  const [photo, setPhoto] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [occasion, setOccasion] = useState('Festive');
  const [vibe, setVibe] = useState('Elegant');
  const [detectedColour, setDetectedColour] = useState('Ivory');
  const [analysed, setAnalysed] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file.');
    if (file.size > 8 * 1024 * 1024) return alert('Choose an image under 8 MB.');
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result)); setPhotoName(file.name); setAnalysed(false);
      // Image remains in this browser; it is not uploaded to a server.
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas'); canvas.width = 24; canvas.height = 24;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, 24, 24);
          const data = ctx.getImageData(0, 0, 24, 24).data; let r = 0, g = 0, b = 0, n = 0;
          for (let i = 0; i < data.length; i += 16) { r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
          const rgb = [r / n, g / n, b / n];
          setDetectedColour(colorWords.reduce((best, item) => distance(rgb, item.rgb) < distance(rgb, colorWords.find(x => x.name === best)?.rgb || colorWords[1].rgb) ? item.name : best, 'Ivory'));
        } catch { setDetectedColour('Ivory'); }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const recommendations = useMemo(() => {
    const clothing = products.filter(p => ['Sarees','Kurtas','Kurtis','Lehengas','Ethnic Sets','Dresses','Tops','Gowns','Co-ord Sets','Shirts','Blazers'].includes(p.category));
    const accessories = products.filter(p => ['Accessories','Bags','Jewellery','Footwear','Sunglasses','Watches','Dupattas'].includes(p.category));
    const scored = (list) => list.map(p => {
      const text = `${p.name} ${p.category} ${p.style} ${p.colour} ${p.description}`.toLowerCase();
      let score = 0;
      const occasionWords = { Festive: ['festive','traditional','ethnic','silk','embroidered','lehenga','saree','kurta','wedding'], Casual: ['casual','cotton','everyday','shirt','top','jeans','dress'], Office: ['office','formal','blazer','shirt','trouser','classic','linen'], Wedding: ['wedding','bridal','lehenga','silk','embroidered','gown','traditional'], Party: ['party','evening','dress','gown','heels','statement','clutch'] };
      (occasionWords[occasion] || []).forEach(word => { if (text.includes(word)) score += 2; });
      const vibeWords = { Elegant: ['elegant','classic','silk','pearl','gold','premium'], Minimal: ['minimal','classic','linen','ivory','black','cotton'], Bold: ['statement','red','maroon','embroidered','sequin','bold'], Traditional: ['traditional','saree','kurta','ethnic','silk','jhumka'] };
      (vibeWords[vibe] || []).forEach(word => { if (text.includes(word)) score += 1; });
      if ((p.colour || '').toLowerCase().includes(detectedColour.toLowerCase())) score += 2;
      if (p.image) score += 0.1;
      return { ...p, _score: score };
    }).sort((a, b) => b._score - a._score);
    const picks = [...scored(clothing).slice(0, 4), ...scored(accessories).slice(0, 4)];
    return picks.length ? picks : products.slice(0, 8);
  }, [products, occasion, vibe, detectedColour]);

  const runStylist = () => { setBusy(true); window.setTimeout(() => { setAnalysed(true); setBusy(false); }, 450); };
  const outfits = recommendations.slice(0, 4);
  const addAll = () => recommendations.slice(0, 3).forEach(p => onAdd?.(p, p.sizes?.[0] || 'Free size'));

  return <main className="ai-stylist-page">
    <style>{`
      .ai-stylist-page{--wine:#701626;--gold:#b99a64;--cream:#fbf5ed;color:#3c2c25;background:#fffdf9;padding:32px clamp(14px,4vw,58px) 64px;min-height:65vh}
      .ai-stylist-page *{box-sizing:border-box}.stylist-hero{text-align:center;margin:0 auto 30px;max-width:760px}.stylist-kicker{font-size:10px;letter-spacing:3px;color:var(--gold);text-transform:uppercase}.stylist-hero h1{font:400 clamp(32px,5vw,52px)/1.1 Georgia,serif;color:var(--wine);margin:12px 0}.stylist-hero p{font-size:13px;line-height:1.8;color:#81736a;margin:0 auto;max-width:580px}
      .stylist-layout{display:grid;grid-template-columns:minmax(280px,.85fr) minmax(0,1.15fr);gap:24px;max-width:1180px;margin:auto;align-items:start}.stylist-panel{background:var(--cream);border:1px solid #eadbcb;padding:22px}.stylist-panel h2{font:400 24px Georgia,serif;color:var(--wine);margin:0 0 8px}.stylist-muted{color:#88776b;font-size:12px;line-height:1.7;margin:0 0 18px}.stylist-upload{display:flex;min-height:210px;align-items:center;justify-content:center;flex-direction:column;gap:10px;border:1px dashed #c7ad8e;background:#fffaf4;cursor:pointer;text-align:center;padding:14px;overflow:hidden}.stylist-upload img{width:100%;height:220px;object-fit:contain}.stylist-upload strong{font-size:12px;color:var(--wine)}.stylist-upload small{font-size:10px;color:#89776b}.stylist-field{display:grid;gap:7px;margin-top:17px}.stylist-field label{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#756257}.stylist-field select{width:100%;padding:12px;background:white;border:1px solid #e2d2c3;color:#4b3830;font:inherit;font-size:12px}.stylist-analyse{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;margin-top:20px;background:var(--wine);color:white;border:0;padding:14px;font-size:11px;letter-spacing:1px;cursor:pointer}.stylist-analyse:disabled{opacity:.65;cursor:wait}.stylist-privacy{font-size:10px;color:#8a796e;line-height:1.6;margin:12px 0 0}.stylist-results-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:16px}.stylist-results-head h2{font:400 25px Georgia,serif;color:var(--wine);margin:0}.stylist-color{font-size:10px;color:#8a796e;margin-top:5px}.stylist-product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.stylist-product{min-width:0;border:1px solid #eee3d8;background:white}.stylist-product-image{position:relative;width:100%;aspect-ratio:3/3.7;background:#f7eee4;overflow:hidden;cursor:pointer}.stylist-product-image img,.stylist-product-photo{width:100%;height:100%;object-fit:cover;display:block}.stylist-product-image .product-artwork{height:100%}.stylist-product-image .stylist-placeholder{display:flex;align-items:center;justify-content:center;height:100%;padding:10px;color:#9b8268;font:12px Georgia,serif;text-align:center}.stylist-product-info{padding:11px}.stylist-product-info small{color:#a08768;font-size:9px;letter-spacing:1px;text-transform:uppercase}.stylist-product-info h3{font:400 14px/1.4 Georgia,serif;margin:5px 0;color:#392a24}.stylist-product-info strong{font-size:12px;color:var(--wine)}.stylist-product-actions{display:flex;gap:7px;margin-top:10px}.stylist-product-actions button{display:flex;align-items:center;justify-content:center;gap:6px;min-width:0;flex:1;padding:9px 5px;border:1px solid var(--wine);background:white;color:var(--wine);font-size:9px;cursor:pointer}.stylist-product-actions button:first-child{background:var(--wine);color:white}.stylist-empty{padding:32px 18px;background:#fffaf4;text-align:center;color:#89776b;font-size:12px;line-height:1.8}.stylist-empty svg{color:var(--gold);margin-bottom:8px}
      @media(max-width:760px){.ai-stylist-page{padding:25px 13px 40px}.stylist-layout{grid-template-columns:1fr;gap:16px}.stylist-panel{padding:16px}.stylist-upload{min-height:170px}.stylist-upload img{height:190px}.stylist-results-head h2{font-size:22px}.stylist-product-grid{gap:10px}.stylist-product-info{padding:9px}.stylist-product-info h3{font-size:12px}.stylist-product-actions button{font-size:8px}}
    `}</style>
    <header className="stylist-hero"><span className="stylist-kicker">Your personal fashion assistant</span><h1>Meet your AI Stylist</h1><p>Upload an outfit or inspiration photo, choose the occasion and your style mood, and get a curated outfit-and-accessories edit from Sri Vogue.</p></header>
    <div className="stylist-layout">
      <section className="stylist-panel"><h2><WandSparkles size={20} style={{verticalAlign:'middle',marginRight:8}}/>Style your moment</h2><p className="stylist-muted">Your photo is processed in this browser for a colour cue. It is not uploaded or stored by Sri Vogue.</p>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={e=>handleFile(e.target.files?.[0])}/>
        <button type="button" className="stylist-upload" onClick={()=>inputRef.current?.click()}>
          {photo ? <img src={photo} alt="Your uploaded style inspiration"/> : <><Upload size={28} color="#b99a64"/><strong>Upload your photo or outfit inspiration</strong><small>JPG, PNG or WEBP · up to 8 MB</small></>}
        </button>
        {photoName && <p className="stylist-privacy">Selected: {photoName}</p>}
        <div className="stylist-field"><label htmlFor="sv-occasion">Occasion</label><select id="sv-occasion" value={occasion} onChange={e=>{setOccasion(e.target.value);setAnalysed(false)}}><option>Festive</option><option>Wedding</option><option>Party</option><option>Office</option><option>Casual</option></select></div>
        <div className="stylist-field"><label htmlFor="sv-vibe">Your style mood</label><select id="sv-vibe" value={vibe} onChange={e=>{setVibe(e.target.value);setAnalysed(false)}}><option>Elegant</option><option>Minimal</option><option>Bold</option><option>Traditional</option></select></div>
        <div className="stylist-field"><label><Palette size={13} style={{verticalAlign:'middle',marginRight:5}}/>Colour cue</label><select value={detectedColour} onChange={e=>{setDetectedColour(e.target.value);setAnalysed(false)}}>{colorWords.map(c=><option key={c.name}>{c.name}</option>)}</select></div>
        <button className="stylist-analyse" onClick={runStylist} disabled={busy}>{busy?<RefreshCw size={15} className="stylist-spin"/>:<Sparkles size={15}/>} {busy?'CURATING YOUR LOOK...':'FIND MY LOOK'}</button>
        <p className="stylist-privacy">Demo AI stylist: recommendations use your selected occasion, style mood and colour cue to rank the available catalogue. No face recognition is used.</p>
      </section>
      <section><div className="stylist-results-head"><div><h2>{analysed?'Your curated look':'Style inspiration'}</h2><div className="stylist-color">{analysed?`${occasion} · ${vibe} · ${detectedColour} palette`:'Outfit ideas and finishing touches'}</div></div><Sparkles color="#b99a64" size={22}/></div>
        {recommendations.length ? <><div className="stylist-product-grid">{recommendations.map((p)=> <article className="stylist-product" key={p.id}><div className="stylist-product-image" onClick={()=>onOpenProduct?.(p)} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&onOpenProduct?.(p)}><ProductImage product={p} className="stylist-product-photo"/></div><div className="stylist-product-info"><small>{p.category}</small><h3>{p.name}</h3><strong>₹{Number(p.price).toLocaleString('en-IN')}</strong><div className="stylist-product-actions"><button onClick={()=>onAdd?.(p,p.sizes?.[0]||'Free size')}><ShoppingBag size={13}/> Add</button><button onClick={()=>onToggleWish?.(p.id)} aria-label="Save item"><Heart size={13} fill={wishlist.includes(p.id)?'currentColor':'none'}/></button></div></div></article>)}</div><button className="stylist-analyse" onClick={addAll}><ShoppingBag size={15}/> ADD CURATED PICKS TO BAG</button></> : <div className="stylist-empty"><Camera size={26}/><br/>Products will appear here once the catalogue loads.</div>}
        {onBackToShop&&<button type="button" className="stylist-analyse" style={{background:'transparent',color:'#701626',border:'1px solid #701626'}} onClick={onBackToShop}>EXPLORE ALL PRODUCTS</button>}
      </section>
    </div>
  </main>;
}
