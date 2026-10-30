let fmt;

function calc({ locale, t, y }) {
  fmt = (n, d) => n.toLocaleString(locale, { minimumFractionDigits: d, maximumFractionDigits: d });

  // "6,5" and "6.5" both mean 6.5; with both marks the last one is the decimal mark.
  // A lone comma is a thousands mark in English ("1,250"), a decimal mark in Turkish.
  // In Turkish "1.250" is a thousand; "6.5" stays 6.5.
  const num = (id) => {
    let s = document.getElementById(id).value.trim().replace(/\s/g, '');
    const comma = s.lastIndexOf(','), dot = s.lastIndexOf('.');
    if (comma >= 0 && dot >= 0) s = comma > dot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
    else if (comma >= 0) s = locale.startsWith('en') ? s.replace(/,/g, '') : s.replace(',', '.');
    else if (!locale.startsWith('en') && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    const n = parseFloat(s);
    return n > 0 ? n : 0;
  };

  const wire = (prefix, ids, required, compute) => {
    const out = document.getElementById(prefix + '-out');
    const empty = out.textContent;
    const run = () => {
      const v = ids.map((id) => num(prefix + '-' + id));
      if (v.slice(0, required).some((n) => !n)) {
        out.className = 'result empty';
        out.textContent = empty;
        return;
      }
      const [big, notes] = compute(...v);
      out.className = 'result';
      out.innerHTML = '';
      const b = document.createElement('div'); b.className = 'big'; b.textContent = big;
      const n = document.createElement('div'); n.className = 'notes'; n.textContent = notes;
      out.append(b, n);
    };
    ids.forEach((id) => document.getElementById(prefix + '-' + id).addEventListener('input', run));
  };

  wire('t', ['km', 'l', 'p'], 2, t);
  wire('y', ['km', 'c', 'p', 'n'], 3, y);
}
