const $ = s => document.querySelector(s);
let seed = 11;
const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
const gs = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(6.2832 * rnd());

const MEDS = [
  { n: 'Paracetamol', k: 1 },
  { n: 'ORS sachets', k: 1.4 },
  { n: 'Amoxicillin', k: .7 },
  { n: 'Artesunate', k: .3 }
];

const SC = {
  'Normal operations': [0, 0, 0, 0],
  'Dengue surge': [1, .2, 0, 0],
  'Flood and cholera': [.3, 1, .5, 0],
  'Malaria outbreak': [.6, 0, .2, 1]
};

const DN = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
const C = [[20, 16], [50, 12], [80, 18], [30, 42], [68, 44]];
const EPI = 1;

let W = [2, 5], H = [], P = [];

for (let d = 0; d < 5; d++) {
  for (let i = 0; i < 5; i++) {
    P.push({
      id: P.length,
      d,
      name: DN[d] + ' PHC-' + (i + 1),
      x: C[d][0] + (rnd() - .5) * 20,
      y: C[d][1] + (rnd() - .5) * 16,
      f: 1 + rnd() * 1.2,
      ph: rnd() > .12,
      lead: 4 + Math.floor(rnd() * 3),
      stock: [],
      exp: []
    });
  }
}

const dem = (p, m, w = W, sev = +$('#sev').value / 100, sc = $('#scn').value) => {
  const o = .1 + sev * SC[sc][m] * (p.d === EPI ? 1 : .35);
  return 8 * MEDS[m].k * (w[0] * p.f + w[1] * o);
};

P.forEach(p => MEDS.forEach((_, m) => {
  const d0 = dem(p, m, [2, 5], 0, 'Normal operations');
  p.stock[m] = Math.round(d0 * (rnd() < .25 ? 1.5 + rnd() * 3 : 5 + rnd() * 14));
  p.exp[m] = Math.round(15 + rnd() * 200);
}));

const INIT = P.map(p => p.stock.slice());
let sel = 0, M = 0, moves = [];

const cover = (p, m) => p.stock[m] / dem(p, m);
const status = (p, m) => {
  const c = cover(p, m);
  return (!p.ph || c < p.lead) ? 'red' : c < p.lead * 1.8 ? 'amber' : 'green';
};

const col = s => 'var(--' + (s === 'red' ? 'red' : s === 'amber' ? 'amb' : 'grn') + ')';
const dist = (a, b) => Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 3);

function plan(m) {
  const T = p => dem(p, m) * p.lead * 2.5;
  const pool = P.map(p => ({ p, av: Math.floor(p.stock[m] - dem(p, m) * p.lead * 3.5) })).filter(s => s.av > 0);
  const needs = P.filter(p => status(p, m) === 'red' && p.ph).sort((a, b) => cover(a, m) - cover(b, m));
  const out = [];

  needs.forEach(n => {
    let need = Math.ceil(T(n) - n.stock[m]);
    while (need > 0) {
      let best = null, bc = 1e9;
      pool.forEach(s => {
        if (s.av > 0 && s.p !== n) {
          const c = dist(s.p, n) * .5 + s.p.exp[m] / 10;
          if (c < bc) { bc = c; best = s; }
        }
      });
      if (!best) break;
      const q = Math.min(need, best.av);
      best.av -= q;
      need -= q;
      out.push({ from: best.p, to: n, q, km: dist(best.p, n), exp: best.p.exp[m] });
    }
  });
  return out;
}

function why(p, m) {
  const c = cover(p, m), d0 = dem(p, m, W, 0), up = Math.round((dem(p, m) / d0 - 1) * 100), s = [];
  s.push(`${MEDS[m].n} runs out in ${c.toFixed(1)} days; resupply takes ${p.lead}.`);
  if (up > 3) s.push(`Forecast demand is up ${up}% because of the ${$('#scn').value.toLowerCase()}.`);
  if (!p.ph) s.push('No pharmacist on duty, so it is effectively stocked out.');
  return s.join(' ');
}

function render() {
  M = +$('#med').value;
  moves = plan(M);
  const st = P.map(p => status(p, M));

  $('#kpis').innerHTML = [
    ['PHCs', P.length],
    ['At risk', st.filter(s => s === 'red').length],
    ['Watch', st.filter(s => s === 'amber').length],
    ['Safe', st.filter(s => s === 'green').length],
    ['Transfers', moves.length]
  ].map(k => `<div class="kpi"><b>${k[1]}</b><span>${k[0]}</span></div>`).join('');

  let g = C.map((c, i) => `<circle cx="${c[0]}" cy="${c[1]}" r="13" fill="var(--soft)"/><text x="${c[0]}" y="${c[1] - 14}" font-size="2.6" text-anchor="middle" fill="var(--mut)">${DN[i]}${i === EPI && $('#scn').value !== 'Normal operations' ? ' (outbreak centre)' : ''}</text>`).join('');
  g += moves.map(m => `<line x1="${m.from.x}" y1="${m.from.y}" x2="${m.to.x}" y2="${m.to.y}" stroke="var(--fg)" stroke-width=".35" stroke-dasharray="1.2 1"/>`).join('');
  g += P.map((p, i) => `<circle class="dot${p.id === sel ? ' sel' : ''}" data-i="${p.id}" tabindex="0" cx="${p.x}" cy="${p.y}" r="2.2" fill="${col(st[i])}"><title>${p.name}: ${cover(p, M).toFixed(1)} days of cover</title></circle>`).join('');
  $('#map').innerHTML = g;

  const al = P.map((p, i) => ({ p, c: cover(p, M), s: st[i] })).filter(a => a.s !== 'green').sort((a, b) => (a.s === b.s ? a.c - b.c : a.s === 'red' ? -1 : 1));
  $('#alerts').innerHTML = al.length ? al.map(a => `<div class="row" data-i="${a.p.id}"><span class="tag ${a.s}">${a.s === 'red' ? 'ACT NOW' : 'WATCH'}</span><b>${a.p.name}</b><br>${why(a.p, M)}</div>`).join('') : '<p class="mut">No alerts. All PHCs have enough cover for this medicine.</p>';

  $('#plan').innerHTML = moves.length ? `<table><tr><th>From</th><th>To</th><th>Units</th><th>Distance</th><th>Expires in</th></tr>${moves.map(m => `<tr><td>${m.from.name}</td><td>${m.to.name}</td><td>${m.q}</td><td>${m.km} km</td><td>${m.exp} d</td></tr>`).join('')}</table>` : '<p class="mut">No transfers needed for this medicine.</p>';

  detail();
}

function detail() {
  const p = P[sel];
  $('#detail').innerHTML = `<b>${p.name}</b> <span class="mut">footfall index ${p.f.toFixed(1)}, pharmacist ${p.ph ? 'present' : 'absent'}, lead time ${p.lead} d</span><div class="scroll"><table><tr><th>Medicine</th><th>Stock</th><th>Forecast/day</th><th>Cover</th></tr>${MEDS.map((m, i) => `<tr><td>${m.n}</td><td>${p.stock[i]}</td><td>${dem(p, i).toFixed(1)}</td><td><span class="tag ${status(p, i)}">${cover(p, i).toFixed(1)} d</span></td></tr>`).join('')}</table></div>`;
}

function pick(e) {
  const t = e.target.closest('[data-i]');
  if (t) {
    sel = +t.dataset.i;
    render();
  }
}

$('#map').addEventListener('click', pick);
$('#alerts').addEventListener('click', pick);
$('#map').addEventListener('keydown', e => { if (e.key === 'Enter') pick(e); });

function train() {
  const sg = +$('#dp').value / 100, N = ['India', 'Brazil', 'Russia', 'China', 'South Africa'];
  const D = N.map(() => {
    const X = [], y = [];
    for (let i = 0; i < 150; i++) {
      const a = .5 + rnd() * 2, b = rnd();
      X.push([a, b]);
      y.push(2 * a + 5 * b + gs() * .3);
    }
    return [X, y];
  });

  let w = [0, 0];
  H = [w.slice()];

  for (let r = 0; r < 25; r++) {
    const L = D.map(([X, y]) => {
      const l = w.slice();
      for (let s = 0; s < 8; s++) {
        let g0 = 0, g1 = 0;
        X.forEach((x, i) => {
          const e = l[0] * x[0] + l[1] * x[1] - y[i];
          g0 += e * x[0];
          g1 += e * x[1];
        });
        l[0] -= .15 * 2 * g0 / X.length;
        l[1] -= .15 * 2 * g1 / X.length;
      }
      return [l[0] + gs() * sg, l[1] + gs() * sg];
    });
    w = [0, 1].map(j => L.reduce((a, l) => a + l[j], 0) / L.length);
    H.push(w.slice());
  }

  W = w;
  drawChart();
  $('#fedinfo').innerHTML = `Learned weights: w1 = <b>${W[0].toFixed(2)}</b>, w2 = <b>${W[1].toFixed(2)}</b> (true values 2 and 5). Sent per round by each country: 2 numbers. Patient records shared: <b>0</b>.`;
  render();
}

function drawChart() {
  const X = i => 10 + i * (285 / 25), Y = v => 110 - v * 16;
  let s = [2, 5].map(v => `<line x1="10" x2="295" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-dasharray="3 2"/><text x="296" y="${Y(v) - 2}" font-size="7" text-anchor="end" fill="var(--mut)">true ${v}</text>`).join('');
  [0, 1].forEach(j => s += `<polyline fill="none" stroke="${j ? 'var(--acc)' : 'var(--amb)'}" stroke-width="2" points="${H.map((h, i) => X(i) + ',' + Y(h[j])).join(' ')}"/>`);
  s += '<text x="10" y="8" font-size="7" fill="var(--mut)">weight value by round (0 to 25)</text>';
  $('#chart').innerHTML = s;
}

MEDS.forEach((m, i) => $('#med').add(new Option(m.n, i)));
Object.keys(SC).forEach(k => $('#scn').add(new Option(k, k)));
$('#scn').value = 'Dengue surge';

['med', 'scn', 'sev'].forEach(id => $('#' + id).addEventListener('input', () => {
  $('#sevv').textContent = $('#sev').value + '%';
  render();
}));

$('#dp').addEventListener('input', () => $('#dpv').textContent = ($('#dp').value / 100).toFixed(2));
$('#train').onclick = train;

$('#apply').onclick = () => {
  moves.forEach(m => {
    m.from.stock[M] -= m.q;
    m.to.stock[M] += m.q;
  });
  render();
};

$('#reset').onclick = () => {
  P.forEach((p, i) => p.stock = INIT[i].slice());
  render();
};

train();