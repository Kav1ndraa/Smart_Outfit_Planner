/* Smart Outfit Planner — application logic
   Storage: localStorage (keys: sop_wardrobe, sop_saved, sop_week)  */
(() => {
  'use strict';

  /* ---------- Constants ---------- */
  const CATS = { top: 'Tops', bottom: 'Bottoms', outer: 'Outerwear', shoes: 'Footwear', acc: 'Accessories', onepiece: 'One-piece / Ethnic set' };
  const TYPES = {
    men: [
      ['T-shirt','top'], ['Polo shirt','top'], ['Casual shirt','top'], ['Formal shirt','top'], ['Vest','top'],
      ['Jeans','bottom'], ['Formal trousers','bottom'], ['Chinos','bottom'], ['Shorts','bottom'], ['Joggers / track pants','bottom'],
      ['Hoodie / sweatshirt','outer'], ['Jacket','outer'], ['Blazer','outer'], ['Coat','outer'],
      ['Sneakers','shoes'], ['Formal shoes','shoes'], ['Sandals / slides','shoes'], ['Sports shoes','shoes'],
      ['Watch','acc'], ['Belt','acc'], ['Cap','acc'], ['Sunglasses','acc'], ['Kurta','onepiece'], ['Sherwani','onepiece']
    ],
    women: [
      ['T-shirt','top'], ['Top','top'], ['Blouse','top'], ['Shirt','top'], ['Crop top','top'], ['Sweater','top'],
      ['Jeans','bottom'], ['Trousers','bottom'], ['Shorts','bottom'], ['Skirt','bottom'], ['Leggings','bottom'],
      ['Jacket / cardigan','outer'], ['Blazer','outer'], ['Coat','outer'],
      ['Sneakers','shoes'], ['Heels','shoes'], ['Flats / sandals','shoes'], ['Boots','shoes'],
      ['Handbag','acc'], ['Jewellery','acc'], ['Scarf / dupatta','acc'], ['Sunglasses','acc'],
      ['Saree','onepiece'], ['Dress / gown','onepiece'], ['Kurti / salwar suit','onepiece'], ['Lehenga','onepiece'], ['Jumpsuit','onepiece']
    ],
    unisex: [['T-shirt','top'], ['Hoodie','outer'], ['Jeans','bottom'], ['Shorts','bottom'], ['Sneakers','shoes'], ['Cap','acc'], ['Jacket','outer']]
  };
  const CATALOGUE = [
    ['Classic white T-shirt','T-shirt','top','#f5f5f5',1,['Casual','College','Sports'],false,'men'],
    ['Oxford blue shirt','Formal shirt','top','#9dbde3',1,['Formal','College'],false,'men'],
    ['Black relaxed-fit jeans','Jeans','bottom','#222222',2,['Casual','College','Party'],false,'men'],
    ['Tailored beige chinos','Chinos','bottom','#c9b58f',2,['Casual','College','Formal'],false,'men'],
    ['Everyday cotton shorts','Shorts','bottom','#6b7a3a',1,['Casual','Sports'],false,'men'],
    ['Minimal white sneakers','Sneakers','shoes','#f5f5f5',1,['Casual','College','Party'],false,'men'],
    ['Structured navy blazer','Blazer','outer','#1f2a44',2,['Formal','Party'],false,'men'],
    ['Black classic saree','Saree','onepiece','#171717',2,['Festive','Party','Formal'],false,'women'],
    ['Ivory embroidered blouse','Blouse','top','#efe6d2',1,['Festive','Party'],false,'women'],
    ['Pastel everyday top','Top','top','#e58aa8',1,['Casual','College'],false,'women'],
    ['High-rise blue jeans','Jeans','bottom','#2f5ea8',2,['Casual','College','Party'],false,'women'],
    ['Flowy summer dress','Dress / gown','onepiece','#e58aa8',1,['Casual','Party'],false,'women'],
    ['Festive lehenga set','Lehenga','onepiece','#7a1f2b',2,['Festive','Party'],false,'women'],
    ['Comfort flats','Flats / sandals','shoes','#c9b58f',1,['Casual','College','Festive'],false,'women'],
    ['Gold-tone jewellery','Jewellery','acc','#d9a21b',1,['Festive','Party','Formal'],false,'women'],
    ['Everyday neutral hoodie','Hoodie','outer','#8a8f98',3,['Casual','College'],false,'unisex']
  ];
  const AUDIENCES = { men: 'Men', women: 'Women', unisex: 'Unisex' };
  const OCCASIONS = ['Casual', 'College', 'Formal', 'Party', 'Festive', 'Sports'];
  const WARMTH = { 1: 'Light', 2: 'Medium', 3: 'Heavy' };
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const NAMED_COLORS = [
    ['Black', '#111111'], ['Charcoal', '#3a3f47'], ['Grey', '#8a8f98'], ['Silver', '#c0c4cc'],
    ['White', '#f5f5f5'], ['Cream', '#efe6d2'], ['Beige', '#c9b58f'], ['Brown', '#7b4b2a'],
    ['Maroon', '#7a1f2b'], ['Red', '#d64933'], ['Orange', '#e8832a'], ['Mustard', '#d9a21b'],
    ['Yellow', '#f2d03b'], ['Olive', '#6b7a3a'], ['Green', '#3f8f5a'], ['Teal', '#1b8a8f'],
    ['Sky blue', '#9dbde3'], ['Blue', '#2f5ea8'], ['Navy', '#1f2a44'], ['Purple', '#6a4c93'], ['Pink', '#e58aa8']
  ];

  const ICON_PATHS = {
    top: 'M8.5 3.5 3 6.5l2 4.2 2.5-1.2v11h9v-11l2.5 1.2 2-4.2-5.5-3a3.5 3.5 0 0 1-7 0z',
    bottom: 'M7 3.5h10l1.5 17h-4.3L12 10.5l-2.2 10H5.5z',
    outer: 'M9 3.5 3.5 6v14.5H9V10l3 2.5 3-2.5v10.5h5.5V6L15 3.5 12 6.5z',
    shoes: 'M2.5 16.5c3.5 0 5-2.5 5.5-6.5l3.5 2.2c1.3.9 3.2 1.6 6 1.8 2.3.2 3.5 1.2 3.5 2.5v1H2.5z',
    acc: 'M6.5 9h11l1.2 11.5H5.3z'
  };

  const SAMPLE = [
    ['White cotton T-shirt', 'top', '#f5f5f5', 1, ['Casual', 'College', 'Sports'], false],
    ['Navy polo shirt', 'top', '#1f2a44', 1, ['Casual', 'College'], false],
    ['Light blue formal shirt', 'top', '#9dbde3', 1, ['Formal', 'College'], false],
    ['Black kurta', 'top', '#111111', 2, ['Festive', 'Party'], false],
    ['Mustard kurta', 'top', '#d9a21b', 1, ['Festive'], false],
    ['Grey hoodie', 'top', '#8a8f98', 3, ['Casual', 'College', 'Sports'], false],
    ['Maroon sweater', 'top', '#7a1f2b', 3, ['Casual', 'College'], false],
    ['Olive T-shirt', 'top', '#6b7a3a', 1, ['Casual'], false],
    ['Black party shirt', 'top', '#111111', 1, ['Party'], false],
    ['Red dry-fit tee', 'top', '#d64933', 1, ['Sports'], false],
    ['Blue jeans', 'bottom', '#2f5ea8', 2, ['Casual', 'College', 'Party'], false],
    ['Black jeans', 'bottom', '#1c1c1c', 2, ['Casual', 'College', 'Party'], false],
    ['Beige chinos', 'bottom', '#c9b58f', 2, ['Casual', 'College', 'Formal'], false],
    ['Charcoal formal trousers', 'bottom', '#3a3f47', 2, ['Formal'], false],
    ['Cream pyjama', 'bottom', '#efe6d2', 1, ['Festive'], false],
    ['Black track pants', 'bottom', '#222222', 2, ['Sports', 'Casual'], false],
    ['Grey shorts', 'bottom', '#9aa0a6', 1, ['Sports', 'Casual'], false],
    ['Denim jacket', 'outer', '#4a6fa5', 2, ['Casual', 'College', 'Party'], false],
    ['Black blazer', 'outer', '#161616', 2, ['Formal', 'Party'], false],
    ['Puffer jacket', 'outer', '#2b2f3a', 3, ['Casual', 'College'], true],
    ['Yellow rain jacket', 'outer', '#f2d03b', 1, ['Casual', 'College', 'Sports'], true],
    ['White sneakers', 'shoes', '#f2f2f2', 1, ['Casual', 'College', 'Sports', 'Party'], false],
    ['Black formal shoes', 'shoes', '#111111', 1, ['Formal'], false],
    ['Brown loafers', 'shoes', '#7b4b2a', 1, ['Formal', 'Party', 'College'], false],
    ['Blue sports shoes', 'shoes', '#2f5ea8', 1, ['Sports'], false],
    ['Mojari', 'shoes', '#b5835a', 1, ['Festive'], false],
    ['Grey floaters', 'shoes', '#444a52', 1, ['Casual', 'College'], true],
    ['Silver watch', 'acc', '#c0c4cc', 1, ['Casual', 'College', 'Formal', 'Party', 'Festive', 'Sports'], false],
    ['Black backpack', 'acc', '#222222', 1, ['College', 'Casual'], false],
    ['Brown belt', 'acc', '#5a3a22', 1, ['Formal', 'Casual', 'College'], false],
    ['Sunglasses', 'acc', '#111111', 1, ['Casual', 'Party'], false]
  ];

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    }
  };

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  /* ---------- Color logic ---------- */
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function hexToHsl(hex) {
    const [R, G, B] = hexToRgb(hex);
    const r = R / 255, g = G / 255, b = B / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2, d = max - min;
    let h = 0, s = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h, s, l };
  }

  function isNeutral({ h, s, l }) {
    if (s < 0.18 || l < 0.2 || l > 0.88) return true;                  // black, white, grey, very dark
    if (h >= 15 && h <= 50 && (l < 0.4 || (s < 0.45 && l > 0.55))) return true; // brown, beige, cream
    if (h >= 195 && h <= 250 && l < 0.3) return true;                  // navy
    return false;
  }

  function hueDiff(a, b) {
    const d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  }

  function pairScore(a, b) {
    if (a.neutral || b.neutral) return 1;
    const d = hueDiff(a.h, b.h);
    if (d < 35) return 0.9;
    if (d >= 150) return 0.8;
    if (d >= 100 && d < 140) return 0.6;
    return 0.2;
  }

  function colorScore(hexes) {
    const info = hexes.map((hex) => { const hsl = hexToHsl(hex); return { ...hsl, neutral: isNeutral(hsl) }; });
    let total = 0, count = 0;
    for (let i = 0; i < info.length; i++) {
      for (let j = i + 1; j < info.length; j++) { total += pairScore(info[i], info[j]); count++; }
    }
    let score = count ? total / count : 1;
    const hues = [];
    info.filter((c) => !c.neutral).forEach((c) => { if (!hues.some((h) => hueDiff(h, c.h) < 30)) hues.push(c.h); });
    if (hues.length > 2) score *= 0.7;
    return score;
  }

  function colorName(hex) {
    const [r, g, b] = hexToRgb(hex);
    let best = NAMED_COLORS[0], bestD = Infinity;
    NAMED_COLORS.forEach((c) => {
      const [R, G, B] = hexToRgb(c[1]);
      const d = (r - R) ** 2 + (g - G) ** 2 + (b - B) ** 2;
      if (d < bestD) { bestD = d; best = c; }
    });
    return best[0];
  }

  /* ---------- Weather logic ---------- */
  function tempLabel(t) {
    if (t < 12) return 'Cold';
    if (t < 20) return 'Cool';
    if (t < 27) return 'Mild';
    if (t < 32) return 'Warm';
    return 'Hot';
  }

  function targetWarmth(t) {
    if (t >= 30) return 1.5;
    if (t >= 26) return 1.8;
    if (t >= 20) return 2.3;
    if (t >= 16) return 3.2;
    if (t >= 11) return 4.2;
    return 5.5;
  }

  /* ---------- Data ---------- */
  let wardrobe = store.get('sop_wardrobe', null);
  if (!Array.isArray(wardrobe)) { wardrobe = sampleWardrobe(); store.set('sop_wardrobe', wardrobe); }
  let saved = store.get('sop_saved', []);
  let week = store.get('sop_week', {});
  let activeFilter = 'all';
  let currentOutfits = [];
  let seed = 0;

  function sampleWardrobe() {
    return SAMPLE.map(([name, cat, color, warmth, occasions, rainOk]) => ({ id: uid(), name, cat, color, warmth, occasions, rainOk, audience: 'unisex' }));
  }
  const byId = (id) => wardrobe.find((i) => i.id === id);

  /* ---------- Outfit engine ---------- */
  function generate({ occasion, temp, rain, limit = 3, seed: sd = 0, excludeTops = null }) {
    const audience = $('#styleAudience')?.value || 'unisex';
    const compatible = (i) => !i.audience || i.audience === 'unisex' || audience === 'unisex' || i.audience === audience;
    const pool = (cat) => wardrobe.filter((i) => i.cat === cat && i.occasions.includes(occasion) && compatible(i));
    const onepieces = pool('onepiece');
    let tops = pool('top');
    const bottoms = pool('bottom'), shoes = pool('shoes'), outers = pool('outer'), accs = pool('acc');

    if (onepieces.length && (!tops.length || !pool('bottom').length || !pool('shoes').length || ($('#styleAudience')?.value === 'women' && ['Festive', 'Party'].includes(occasion)))) {
      const shoesForOnepiece = pool('shoes');
      const accessoriesForOnepiece = pool('acc');
      const blouses = tops.filter(t => /blouse/i.test(t.subtype || t.name));
      const singleLooks = [];
      onepieces.forEach((piece) => {
        const isSaree = /saree/i.test((piece.subtype || '') + ' ' + piece.name);
        const blouseOpts = isSaree && blouses.length ? blouses : [null];
        blouseOpts.forEach(blouse => {
          if (shoesForOnepiece.length) shoesForOnepiece.forEach((shoe) => {
            const hexes = [piece.color, shoe.color];
            if (blouse) hexes.push(blouse.color);
            const color = colorScore(hexes);
            const warm = Math.max(0, 1 - Math.abs(piece.warmth - targetWarmth(temp)) / 2.5);
            singleLooks.push({ parts: { top: piece, blouse, bottom: null, outer: null, shoes: shoe, acc: accessoriesForOnepiece[0] || null }, color, warm, score: 0.5 * color + 0.45 * warm + (accessoriesForOnepiece.length ? 0.05 : 0) });
          });
          else singleLooks.push({ parts: { top: piece, blouse, bottom: null, outer: null, shoes: null, acc: accessoriesForOnepiece[0] || null }, color: 1, warm: 1, score: 0.9 });
        });
      });
      singleLooks.sort((a,b) => b.score-a.score);
      const looks = singleLooks.slice(0, limit).map(c => ({ ...c, pct: Math.round(c.score*100), reasons: `One-piece style matched for ${occasion.toLowerCase()}; colour and weather suitability considered.` }));
      if (looks.length) return { outfits: looks, missing: [], occasion };
    }

    const missing = [];
    if (!tops.length) missing.push('top');
    if (!bottoms.length) missing.push('bottom');
    if (!shoes.length) missing.push('footwear');
    if (missing.length) return { outfits: [], missing, occasion };

    if (excludeTops) {
      const filtered = tops.filter((t) => !excludeTops.has(t.id));
      if (filtered.length) tops = filtered;
    }

    const needOuter = temp < 16;
    const noOuter = temp >= 27 && !rain;
    const outerOpts = needOuter ? (outers.length ? outers : [null]) : noOuter ? [null] : [null, ...outers];
    const accOpts = [null, ...accs];
    const target = targetWarmth(temp);
    const rand = sd ? mulberry32(sd * 7919) : null;
    const all = [];

    tops.forEach((t) => bottoms.forEach((b) => shoes.forEach((s) => outerOpts.forEach((o) => accOpts.forEach((a) => {
      const hexes = [t.color, b.color, s.color];
      if (o) hexes.push(o.color);
      const color = colorScore(hexes);
      const idx = t.warmth + b.warmth * 0.5 + (o ? o.warmth * 0.8 : 0);
      const warm = Math.max(0, 1 - Math.abs(idx - target) / 2.5);
      let score = 0.5 * color + 0.45 * warm + (a ? 0.05 : 0);
      if (rain) {
        if (!s.rainOk) score -= 0.12;
        if (o && o.rainOk) score += 0.04;
      }
      if (rand) score += (rand() - 0.5) * 0.12;
      all.push({ parts: { top: t, bottom: b, outer: o, shoes: s, acc: a }, color, warm, score: Math.max(0, Math.min(1, score)) });
    })))));

    all.sort((x, y) => y.score - x.score);

    const picked = [];
    const ok = (c, strict) => !picked.some((p) =>
      p.parts.top.id === c.parts.top.id && (strict || p.parts.bottom.id === c.parts.bottom.id));
    all.forEach((c) => { if (picked.length < limit && ok(c, true)) picked.push(c); });
    all.forEach((c) => { if (picked.length < limit && !picked.includes(c) && ok(c, false)) picked.push(c); });

    const outfits = picked.map((c) => ({ ...c, pct: Math.round(c.score * 100), reasons: reasonsFor(c, temp, rain, needOuter, outers.length) }));
    return { outfits, missing: [], occasion };
  }

  function reasonsFor(c, temp, rain, needOuter, outerCount) {
    const out = [];
    const { top, bottom, outer, shoes } = c.parts;
    if (temp >= 28) out.push(`Light pieces for ${temp}°C.`);
    else if (outer) out.push(`${outer.name} adds a layer for ${temp}°C.`);
    else out.push(`Medium layers suit ${temp}°C.`);
    if (needOuter && !outer && !outerCount) out.push('Add an outerwear piece for this occasion to stay warm.');
    if (c.color >= 0.9) out.push(`${colorName(top.color)} and ${colorName(bottom.color)} pair easily.`);
    else if (c.color >= 0.7) out.push('Balanced contrast between colors.');
    else out.push('A bold mix. Swap one piece if it feels too loud.');
    if (rain) out.push(shoes.rainOk ? `${shoes.name} handle rain well.` : 'Footwear is not marked for rain.');
    return out.join(' ');
  }

  /* ---------- Rendering ---------- */
  function icon(cat, color, size) {
    const sz = size ? ` width="${size}" height="${size}"` : '';
    const stroke = 'stroke="rgba(20,27,48,.55)" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"';
    const iconCat = cat === 'onepiece' ? 'top' : cat;
    const handle = iconCat === 'acc' ? `<path d="M9.2 9a2.8 2.8 0 0 1 5.6 0" fill="none" ${stroke}/>` : '';
    return `<svg viewBox="0 0 24 24"${sz} aria-hidden="true" focusable="false">${handle}<path d="${ICON_PATHS[iconCat]}" fill="${esc(color)}" ${stroke}/></svg>`;
  }

  function partsList(parts) {
    return [parts.top, parts.blouse, parts.bottom, parts.outer, parts.shoes, parts.acc].filter(Boolean);
  }

  function pieceHtml(item) {
    return `<figure class="piece">
      <span class="swatch" style="background:${esc(item.color)}26">${icon(item.cat, item.color)}</span>
      <figcaption>${esc(item.name)}<small>${esc(colorName(item.color))}</small></figcaption>
    </figure>`;
  }

  function renderResults(res, params) {
    const box = $('#results');
    if (res.missing.length) {
      box.innerHTML = `<div class="empty"><p><strong>No ${esc(res.occasion)} ${esc(res.missing.join(' or '))} in your wardrobe yet.</strong></p>
        <p>Add a piece marked for ${esc(res.occasion)} in <a href="#wardrobe">My wardrobe</a>, then try again.</p></div>`;
      $('#reshuffle').hidden = true;
      currentOutfits = [];
      return;
    }
    currentOutfits = res.outfits;
    box.innerHTML = res.outfits.map((o, i) => `
      <article class="outfit" aria-label="Outfit option ${i + 1}">
        <div class="outfit-pieces">${partsList(o.parts).map(pieceHtml).join('')}</div>
        <div class="outfit-foot">
          <div class="score" aria-label="Match score ${o.pct} percent">
            <strong>${o.pct}%</strong><span>match</span>
            <span class="score-bar"><i style="width:${o.pct}%"></i></span>
          </div>
          <p class="reasons">${esc(o.reasons)}</p>
          <button type="button" class="btn btn-small btn-ghost" data-save="${i}">Save outfit</button>
        </div>
      </article>`).join('');
    $('#reshuffle').hidden = false;
    box.dataset.occasion = params.occasion;
    box.dataset.temp = params.temp;
  }

  function renderHero() {
    const rail = $('#heroRail'), meta = $('#heroMeta');
    const res = generate({ occasion: 'Casual', temp: 26, rain: false, limit: 1 });
    if (!res.outfits.length) {
      rail.innerHTML = '<p class="rail-empty">Add a top, a bottom and footwear to see a preview here.</p>';
      meta.textContent = '';
      return;
    }
    const o = res.outfits[0];
    rail.innerHTML = partsList(o.parts).slice(0, 4).map((p) =>
      `<div class="hang">${icon(p.cat, p.color)}<span>${esc(p.name)}</span></div>`).join('');
    meta.textContent = `Casual · 26°C · ${o.pct}% match`;
  }

  function renderWardrobe() {
    const cats = ['all', ...Object.keys(CATS)];
    $('#filters').innerHTML = cats.map((c) => `
      <label class="chip"><input type="radio" name="filter" value="${c}" ${c === activeFilter ? 'checked' : ''}>
      <span>${c === 'all' ? 'All' : CATS[c]}</span></label>`).join('');

    const list = wardrobe.filter((i) => activeFilter === 'all' || i.cat === activeFilter);
    $('#wardrobeGrid').innerHTML = list.length ? list.map((i) => `
      <article class="item">
        <span class="swatch" style="background:${esc(i.color)}26">${icon(i.cat, i.color)}</span>
        <h4>${esc(i.name)}</h4>
        <p>${esc(i.subtype || CATS[i.cat] || 'Clothing')} · ${esc(AUDIENCES[i.audience] || 'Unisex')} · ${esc(colorName(i.color))} · ${WARMTH[i.warmth]}${i.rainOk ? ' · Rain ok' : ''}</p>
        <p>${esc(i.occasions.join(', '))}</p>
        <button type="button" class="btn btn-small btn-danger" data-del="${esc(i.id)}" aria-label="Delete ${esc(i.name)}">Delete</button>
      </article>`).join('')
      : '<div class="empty">Nothing here yet. Use the form to add your first piece.</div>';

    const counts = Object.keys(CATS).map((c) => `${wardrobe.filter((i) => i.cat === c).length} ${CATS[c].toLowerCase()}`).join(' · ');
    $('#wardrobeStats').textContent = `${wardrobe.length} pieces · ${counts}`;
  }

  function dots(ids) {
    return `<span class="dots" aria-hidden="true">${ids.map(byId).filter(Boolean).map((i) => `<i style="background:${esc(i.color)}"></i>`).join('')}</span>`;
  }

  function outfitName(ids) {
    return ids.map(byId).filter(Boolean).slice(0, 2).map((i) => i.name).join(' + ');
  }

  function renderSaved() {
    $('#savedList').innerHTML = saved.length ? saved.map((s) => `
      <div class="saved-card">
        <strong>${esc(s.label)}</strong>
        ${dots(s.ids)}
        <p>${esc(outfitName(s.ids))}</p>
        <p>${esc(s.occasion)} · ${s.temp}°C · ${s.score}% match</p>
        <button type="button" class="btn btn-small btn-danger" data-unsave="${esc(s.id)}">Remove</button>
      </div>`).join('')
      : '<div class="empty">No saved outfits yet. Choose Save outfit on any suggestion.</div>';
  }

  function renderWeek() {
    $('#weekList').innerHTML = DAYS.map((d) => {
      const w = week[d];
      const ids = w ? w.ids.filter(byId) : [];
      const look = ids.length
        ? `${dots(ids)}<span class="day-label">${esc(w.occasion)} · ${esc(outfitName(ids))}</span>`
        : '<span class="day-label">Nothing planned</span>';
      const opts = ['<option value="">Choose a saved outfit</option>']
        .concat(saved.map((s) => `<option value="${esc(s.id)}">${esc(s.label)} (${s.score}%)</option>`)).join('');
      return `<div class="day">
        <span class="day-name">${d}</span>
        <div class="day-look">${look}</div>
        <select data-day="${d}" aria-label="Outfit for ${d}">${opts}</select>
        <button type="button" class="btn btn-small btn-ghost" data-clearday="${d}" ${ids.length ? '' : 'disabled'}>Clear</button>
      </div>`;
    }).join('');
  }

  /* ---------- Actions ---------- */
  function currentParams() {
    const occ = $('input[name="occasion"]:checked');
    return { occasion: occ ? occ.value : 'Casual', temp: +$('#temp').value, rain: $('#rain').checked };
  }

  function runPlanner(newSeed) {
    seed = newSeed ? seed + 1 : 0;
    const p = currentParams();
    renderResults(generate({ ...p, limit: 3, seed }), p);
  }

  function saveOutfit(idx) {
    const o = currentOutfits[idx];
    if (!o) return;
    const ids = partsList(o.parts).map((i) => i.id);
    const key = ids.slice().sort().join('|');
    if (saved.some((s) => s.ids.slice().sort().join('|') === key)) { toast('Already saved'); return; }
    const p = { occasion: $('#results').dataset.occasion, temp: +$('#results').dataset.temp };
    saved.push({ id: uid(), label: `${p.occasion} look ${saved.length + 1}`, ids, occasion: p.occasion, temp: p.temp, score: o.pct });
    store.set('sop_saved', saved);
    renderSaved(); renderWeek();
    toast('Outfit saved');
  }

  function autoPlan() {
    const { temp, rain } = currentParams();
    const used = new Set();
    const next = {};
    DAYS.forEach((d, i) => {
      const occasion = i < 5 ? 'College' : 'Casual';
      let r = generate({ occasion, temp, rain, limit: 1, excludeTops: used });
      if (!r.outfits.length) r = generate({ occasion, temp, rain, limit: 1 });
      if (r.outfits.length) {
        const o = r.outfits[0];
        used.add(o.parts.top.id);
        next[d] = { ids: partsList(o.parts).map((x) => x.id), occasion, score: o.pct };
      }
    });
    if (!Object.keys(next).length) { toast('Add more clothes to plan your week'); return; }
    week = next;
    store.set('sop_week', week);
    renderWeek();
    toast('Week planned');
  }

  function liveWeather() {
    if (!navigator.geolocation) { toast('Location is not available in this browser'); return; }
    toast('Fetching weather…');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('bad response');
        const data = await res.json();
        const t = Math.round(data.current.temperature_2m);
        $('#temp').value = Math.max(0, Math.min(45, t));
        $('#rain').checked = data.current.precipitation > 0;
        updateTempLabel();
        runPlanner(false);
        toast(`Live weather: ${t}°C${data.current.precipitation > 0 ? ', rain' : ''}`);
      } catch (e) {
        toast('Could not get weather. Set it manually.');
      }
    }, () => toast('Location permission denied. Set weather manually.'), { timeout: 10000 });
  }

  function updateTempLabel() {
    const t = +$('#temp').value;
    $('#tempOut').textContent = `${t}°C · ${tempLabel(t)}`;
  }

  function refreshTypes(audience) {
    const types = TYPES[audience] || TYPES.unisex;
    $('#itemCat').innerHTML = types.map(([label, cat]) => `<option value="${cat}" data-subtype="${esc(label)}">${esc(label)}</option>`).join('');
    $('#categoryHint').textContent = audience === 'women' ? 'Sarees, blouses, dresses, ethnic wear and everyday essentials.' : audience === 'men' ? 'Shirts, T-shirts, jeans, formal pants, shorts and more.' : 'Everyday essentials that work across styles.';
  }

  function renderCatalogue() {
    const audience = $('#catalogAudience').value;
    const filter = $('#catalogFilter').value;
    const visible = CATALOGUE.filter(item => (item[8] === audience || item[8] === 'unisex' || audience === 'unisex' && item[8] !== 'men' && item[8] !== 'women') && (filter === 'all' || item[2] === filter));
    const options = [...new Set(CATALOGUE.filter(i => i[8] === audience || i[8] === 'unisex' || audience === 'unisex').map(i => i[2]))];
    const current = $('#catalogFilter').value;
    $('#catalogFilter').innerHTML = '<option value="all">All categories</option>' + options.map(c => `<option value="${c}">${CATS[c] || c}</option>`).join('');
    if (options.includes(current)) $('#catalogFilter').value = current;
    const filtered = CATALOGUE.filter(item => (item[8] === audience || item[8] === 'unisex' || audience === 'unisex') && ($('#catalogFilter').value === 'all' || item[2] === $('#catalogFilter').value));
    $('#catalogueGrid').innerHTML = filtered.map((i, idx) => `<article class="catalogue-item"><span class="catalogue-swatch" style="--item-color:${esc(i[3])}"><span>${esc(i[1])}</span></span><div class="catalogue-copy"><span class="eyebrow">${esc(AUDIENCES[i[8]])} · ${esc(CATS[i[2]])}</span><h4>${esc(i[0])}</h4><p>${esc(i[1])} · ${esc(colorName(i[3]))}</p><button type="button" class="btn btn-small btn-primary" data-catalog-add="${idx}" data-catalog-name="${esc(i[0])}">+ Add to wardrobe</button></div></article>`).join('') || '<div class="empty">No catalogue pieces in this category yet.</div>';
  }

  function addCatalogueItem(name) {
    const i = CATALOGUE.find(x => x[0] === name);
    if (!i) return;
    if (wardrobe.some(x => x.name === i[0] && x.audience === i[8])) { toast('That catalogue piece is already in your wardrobe'); return; }
    wardrobe.push({ id: uid(), name: i[0], subtype: i[1], cat: i[2], color: i[3], warmth: i[4], occasions: i[5].slice(), rainOk: i[6], audience: i[8] });
    store.set('sop_wardrobe', wardrobe);
    renderWardrobe(); renderHero(); runPlanner(false);
    toast(`${name} added to your wardrobe`);
  }

  /* ---------- Setup ---------- */
  function init() {
    $('#occasionChips').innerHTML = OCCASIONS.map((o, i) => `
      <label class="chip"><input type="radio" name="occasion" value="${o}" ${i === 0 ? 'checked' : ''}><span>${o}</span></label>`).join('');
    refreshTypes($('#itemAudience').value);
    $('#itemOccasions').innerHTML = OCCASIONS.map((o) => `
      <label class="check"><input type="checkbox" name="itemOcc" value="${o}"> ${o}</label>`).join('');

    updateTempLabel();
    renderCatalogue(); renderHero(); renderWardrobe(); renderSaved(); renderWeek();
    runPlanner(false);

    $('#temp').addEventListener('input', updateTempLabel);
    $('#styleAudience').addEventListener('change', () => runPlanner(false));
    $('#itemAudience').addEventListener('change', () => refreshTypes($('#itemAudience').value));
    $('#catalogAudience').addEventListener('change', () => { $('#catalogFilter').value = 'all'; renderCatalogue(); });
    $('#catalogFilter').addEventListener('change', renderCatalogue);
    $('#catalogueGrid').addEventListener('click', (e) => { const b = e.target.closest('[data-catalog-name]'); if (b) addCatalogueItem(b.dataset.catalogName); });
    $('#planForm').addEventListener('submit', (e) => { e.preventDefault(); runPlanner(false); });
    $('#reshuffle').addEventListener('click', () => runPlanner(true));
    $('#liveWeather').addEventListener('click', liveWeather);
    $('#results').addEventListener('click', (e) => {
      const b = e.target.closest('[data-save]');
      if (b) saveOutfit(+b.dataset.save);
    });

    $('#itemForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const err = $('#itemError');
      const name = $('#itemName').value.trim();
      const occasions = $$('input[name="itemOcc"]:checked').map((c) => c.value);
      if (!name) { err.textContent = 'Enter a name for the piece.'; err.hidden = false; $('#itemName').focus(); return; }
      if (!occasions.length) { err.textContent = 'Select at least one occasion.'; err.hidden = false; return; }
      err.hidden = true;
      wardrobe.push({
        id: uid(), name, cat: $('#itemCat').value, subtype: $('#itemCat').selectedOptions[0]?.dataset.subtype || CATS[$('#itemCat').value], audience: $('#itemAudience').value, color: $('#itemColor').value,
        warmth: +$('#itemWarmth').value, occasions, rainOk: $('#itemRain').checked
      });
      store.set('sop_wardrobe', wardrobe);
      e.target.reset();
      refreshTypes($('#itemAudience').value);
      $('#itemColor').value = '#2f5ea8';
      renderWardrobe(); renderHero(); runPlanner(false);
      toast(`${name} added`);
    });

    $('#filters').addEventListener('change', (e) => {
      if (e.target.name === 'filter') { activeFilter = e.target.value; renderWardrobe(); $(`#filters input[value="${activeFilter}"]`).focus(); }
    });

    $('#wardrobeGrid').addEventListener('click', (e) => {
      const b = e.target.closest('[data-del]');
      if (!b) return;
      wardrobe = wardrobe.filter((i) => i.id !== b.dataset.del);
      store.set('sop_wardrobe', wardrobe);
      renderWardrobe(); renderHero(); renderSaved(); renderWeek(); runPlanner(false);
      toast('Piece deleted');
    });

    $('#loadSample').addEventListener('click', () => {
      if (!confirm('Replace your wardrobe with the sample wardrobe?')) return;
      wardrobe = sampleWardrobe();
      store.set('sop_wardrobe', wardrobe);
      renderWardrobe(); renderHero(); renderSaved(); renderWeek(); runPlanner(false);
      toast('Sample wardrobe loaded');
    });

    $('#clearAll').addEventListener('click', () => {
      if (!confirm('Delete every piece in your wardrobe?')) return;
      wardrobe = [];
      store.set('sop_wardrobe', wardrobe);
      renderWardrobe(); renderHero(); renderSaved(); renderWeek(); runPlanner(false);
      toast('Wardrobe cleared');
    });

    $('#savedList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-unsave]');
      if (!b) return;
      saved = saved.filter((s) => s.id !== b.dataset.unsave);
      store.set('sop_saved', saved);
      renderSaved(); renderWeek();
      toast('Outfit removed');
    });

    $('#weekList').addEventListener('change', (e) => {
      const sel = e.target.closest('select[data-day]');
      if (!sel || !sel.value) return;
      const s = saved.find((x) => x.id === sel.value);
      if (!s) return;
      week[sel.dataset.day] = { ids: s.ids.slice(), occasion: s.occasion, score: s.score };
      store.set('sop_week', week);
      renderWeek();
    });

    $('#weekList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-clearday]');
      if (!b) return;
      delete week[b.dataset.clearday];
      store.set('sop_week', week);
      renderWeek();
    });

    $('#autoPlan').addEventListener('click', autoPlan);
    $('#clearWeek').addEventListener('click', () => { week = {}; store.set('sop_week', week); renderWeek(); toast('Week cleared'); });
    $('#printWeek').addEventListener('click', () => window.print());
  }

  init();
})();
