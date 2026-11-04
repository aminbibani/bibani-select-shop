const SHOP='https://bibaniselect.com';
const grid=document.getElementById('productGrid'),note=document.getElementById('productNote');
const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}};
let products=[],wishes=read('bibani-wishes'),cart=read('bibani-cart-v2'),active='all',search='';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>Number(n||0).toLocaleString('de-DE',{style:'currency',currency:'EUR'});
const img=p=>p.images?.[0]?.src||p.image?.src||'';
const categories={all:'Alle Produkte',armbaender:'Armbänder',ohrringe:'Ohrringe',ketten:'Ketten',ringe:'Ringe',uhren:'Uhren',handy:'Handyzubehör',accessoires:'Accessoires'};
function category(p){
 const t=[p.title,p.product_type,Array.isArray(p.tags)?p.tags.join(' '):p.tags||''].join(' ').toLowerCase();
 // Reihenfolge ist wichtig: Ohr- und Armschmuck dürfen nicht als allgemeine Ketten gelten.
 if(/ohrring|ohrstecker|creolen|earrings?|ear studs|hoops/.test(t))return 'ohrringe';
 if(/armband|armreif|bracelet|bangle/.test(t))return 'armbaender';
 if(/halskette|collier|necklace|anhänger|pendant|kette/.test(t))return 'ketten';
 if(/\bring\b|\bringe\b|fingerring/.test(t))return 'ringe';
 if(/uhr|watch/.test(t))return 'uhren';
 if(/iphone|hülle|case|mag.?safe|usb|lade|charger|schutzglas|kabel|handy|adapter|protector/.test(t))return 'handy';
 return 'accessoires';
}

const categoryOrder=['armbaender','ohrringe','ketten','ringe','uhren','handy','accessoires'];
const fallbackImage='https://cdn.shopify.com/s/files/1/1087/8353/4410/files/FA32729E-AB44-4AB9-81B8-906F0E73C906.png?v=1792929312';
function setCategory(cat){active=cat;search='';render();document.getElementById('productGrid').scrollIntoView({behavior:'smooth',block:'start'})}
function renderCategoryGallery(){
 const holder=document.getElementById('categoryGallery');
 if(!holder)return;
 holder.innerHTML=categoryOrder.map(c=>{
  const matches=products.filter(p=>category(p)===c);
  const photo=matches.map(img).find(Boolean);
  return `<button class="category-tile" data-gallery="${c}" aria-label="${esc(categories[c])} anzeigen"><div class="tile-photo">${photo?`<img src="${esc(photo)}" loading="lazy" alt="">`:`<span class="tile-placeholder">✦</span>`}</div><div class="tile-caption"><strong>${esc(categories[c])}</strong><small>${matches.length} Produkte →</small></div></button>`;
 }).join('');
 holder.querySelectorAll('[data-gallery]').forEach(b=>b.onclick=()=>setCategory(b.dataset.gallery));
 const featured=document.getElementById('featuredStrip');
 if(featured)featured.innerHTML=products.slice(0,4).map(p=>`<button class="feature-card" data-feature="${p.id}">${img(p)?`<img src="${esc(img(p))}" loading="lazy" alt="">`:''}<span>${esc(p.title)}</span><b>${money(p.variants?.[0]?.price)}</b></button>`).join('');
 featured?.querySelectorAll('[data-feature]').forEach(b=>b.onclick=()=>details(b.dataset.feature));
}

function save(){localStorage.setItem('bibani-cart-v2',JSON.stringify(cart));localStorage.setItem('bibani-wishes',JSON.stringify(wishes));document.getElementById('cartCount').textContent=cart.reduce((n,x)=>n+x.qty,0);document.getElementById('wishCount').textContent=wishes.length}
function filtered(){return products.filter(p=>(active==='all'||category(p)===active)&&[p.title,p.product_type,Array.isArray(p.tags)?p.tags.join(' '):p.tags||''].join(' ').toLowerCase().includes(search))}
function render(){document.getElementById('productCount').textContent=products.length+' Produkte geladen';document.getElementById('categoryTitle').textContent=categories[active]+(search?' · Suche: '+search:'');document.querySelectorAll('[data-cat]').forEach(b=>b.classList.toggle('active',b.dataset.cat===active));const shown=filtered();grid.innerHTML=shown.length?shown.map(p=>{const v=p.variants?.[0],image=img(p);return `<article class="product">${image?`<img src="${esc(image)}" loading="lazy" alt="${esc(p.title)}">`:''}<div class="product-body"><h3>${esc(p.title)}</h3><div class="price">${money(v?.price)}</div><div class="product-actions"><button data-detail="${p.id}">Ansehen</button><button data-add="${p.id}" ${!v?.available&&v?.available!==undefined?'disabled':''}>In den Warenkorb +</button><button class="heart" data-wish="${p.id}" aria-label="Merken">${wishes.includes(String(p.id))?'♥':'♡'}</button></div></div></article>`}).join(''):'<div class="notice">Hier sind derzeit keine Produkte sichtbar. Schau auch in unserem <a href="'+SHOP+'" target="_blank" rel="noopener">Shopify-Shop</a> vorbei.</div>';grid.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>add(b.dataset.add));grid.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>details(b.dataset.detail));grid.querySelectorAll('[data-wish]').forEach(b=>b.onclick=()=>{let id=b.dataset.wish;wishes=wishes.includes(id)?wishes.filter(x=>x!==id):[...wishes,id];save();render()})}
function add(id,variantId){const p=products.find(x=>String(x.id)===String(id));const v=p?.variants?.find(x=>String(x.id)===String(variantId))||p?.variants?.[0];if(!v?.id){alert('Bitte Produkt direkt im Shopify-Shop auswählen.');return}let x=cart.find(x=>String(x.variantId)===String(v.id));if(x)x.qty++;else cart.push({variantId:String(v.id),title:p.title,variant:v.title,price:Number(v.price||0),image:img(p),qty:1});save();renderCart();document.getElementById('productDialog').close();document.getElementById('cartDialog').showModal()}
function details(id){let p=products.find(x=>String(x.id)===String(id));if(!p)return;const variants=p.variants||[];document.getElementById('productDetail').innerHTML=`${img(p)?`<img class="detail-img" src="${esc(img(p))}" alt="${esc(p.title)}">`:''}<h3>${esc(p.title)}</h3><p>${esc((p.body_html||'').replace(/<[^>]*>/g,' ').slice(0,600))}</p><label>Variante <select id="variantSelect">${variants.map(v=>`<option value="${v.id}">${esc(v.title)} – ${money(v.price)}</option>`).join('')}</select></label><p><button class="primary" id="detailAdd">In den Warenkorb +</button></p>`;document.getElementById('detailAdd').onclick=()=>add(id,document.getElementById('variantSelect').value);document.getElementById('productDialog').showModal()}
function renderCart(){const el=document.getElementById('cartItems');el.innerHTML=cart.length?cart.map((x,i)=>`<div class="cartrow">${x.image?`<img src="${esc(x.image)}" alt="">`:''}<div><b>${esc(x.title)}</b><small>${esc(x.variant==='Default Title'?'':x.variant)}</small><p>${money(x.price)} × ${x.qty}</p><button data-minus="${i}">−</button> <button data-plus="${i}">+</button> <button data-remove="${i}">Entfernen</button></div></div>`).join(''):'Dein Warenkorb ist noch leer.';document.getElementById('cartTotal').textContent='Zwischensumme: '+money(cart.reduce((n,x)=>n+x.price*x.qty,0));document.getElementById('checkoutBtn').disabled=!cart.length;el.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{let x=cart[+b.dataset.minus];x.qty--;if(!x.qty)cart.splice(+b.dataset.minus,1);save();renderCart()});el.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{cart[+b.dataset.plus].qty++;save();renderCart()});el.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.remove,1);save();renderCart()})}
function checkout(){if(!cart.length)return;const items=cart.map(x=>x.variantId+':'+x.qty).join(',');window.location.href=SHOP+'/cart/'+items;}
async function load(){try{let res=await fetch(SHOP+'/products.json?limit=250',{mode:'cors',cache:'no-store'});if(!res.ok)throw Error('Products endpoint');let data=await res.json();products=(data.products||[]).filter(p=>p.handle&&p.variants?.length);if(!products.length)throw Error('No products');renderCategoryGallery();
 const hero=document.getElementById('heroProductImage');
 const jewelry=products.find(p=>['ketten','armbaender','ohrringe'].includes(category(p))&&img(p));
 if(hero&&jewelry){hero.src=img(jewelry);hero.alt=jewelry.title;}
 note.textContent='Produkte aus Shopify. Verfügbarkeit und endgültiger Preis werden bei Shopify bestätigt.';render()}catch(e){grid.innerHTML='<div class="notice">Die Produktanzeige konnte gerade nicht geladen werden. <a href="'+SHOP+'" target="_blank" rel="noopener">Produkte im Shopify-Shop ansehen ↗</a></div>';note.textContent='Falls Shopify den direkten Produktabruf blockiert, benötigen wir eine Storefront-API-Anbindung. Der Warenkorb funktioniert nur für hier geladene Produkte.'}}
document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{active=b.dataset.cat;search='';render();document.getElementById('productGrid').scrollIntoView({behavior:'smooth',block:'start'})});document.getElementById('cartBtn').onclick=()=>{renderCart();document.getElementById('cartDialog').showModal()};document.getElementById('checkoutBtn').onclick=checkout;document.getElementById('searchBtn').onclick=()=>document.getElementById('searchDialog').showModal();document.getElementById('searchForm').onsubmit=e=>{e.preventDefault();search=document.getElementById('searchInput').value.trim().toLowerCase();active='all';document.getElementById('searchDialog').close();render();document.getElementById('kollektion').scrollIntoView({behavior:'smooth'})};document.getElementById('wishBtn').onclick=()=>{let selected=products.filter(p=>wishes.includes(String(p.id)));document.getElementById('wishItems').innerHTML=selected.length?selected.map(p=>`<div class="wishrow"><span>${esc(p.title)}</span><button data-id="${p.id}">Zum Warenkorb +</button></div>`).join(''):'Noch keine Produkte gemerkt.';document.querySelectorAll('#wishItems [data-id]').forEach(b=>b.onclick=()=>{add(b.dataset.id);document.getElementById('wishDialog').close()});document.getElementById('wishDialog').showModal()};save();load();if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
