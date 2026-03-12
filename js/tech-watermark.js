// tech-watermark.js
// Subtle STACK icon in top-right — hover shows tech pills, click shows modal

(function() {
  const pageKey = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const techs = window.techStacks ? window.techStacks[pageKey] || [] : [];

  if (!techs.length) return;

  // Create watermark container
  const wm = document.createElement('div');
  wm.id = 'tech-watermark';
  wm.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    font-family: monospace; font-size: 13px; font-weight: bold;
    color: #666; background: rgba(255,255,255,0.95); padding: 8px 12px;
    border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    cursor: pointer; user-select: none; transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
  `;
  wm.innerHTML = `⚙️ <span style="color:#000">STACK</span>`;

  // Hover panel (pills)
  const panel = document.createElement('div');
  panel.style.cssText = `
    position: absolute; top: 100%; right: 0; margin-top: 8px;
    background: white; padding: 12px; border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: none;
    min-width: 220px; z-index: 10000;
  `;
  panel.innerHTML = `
    <div style="margin-bottom:8px; font-size:12px; color:#666;">Tech used on this page</div>
    <div id="tech-pills"></div>
  `;

  const pillsContainer = panel.querySelector('#tech-pills');
  techs.forEach(t => {
    const pill = document.createElement('span');
    pill.style.cssText = `
      display: inline-block; margin: 4px 4px 4px 0; padding: 4px 10px;
      background: ${t.color || '#eee'}; color: white; border-radius: 999px;
      font-size: 11px; font-weight: 600;
    `;
    pill.textContent = t.name;
    pillsContainer.appendChild(pill);
  });

  wm.appendChild(panel);

  // Show panel on hover
  wm.addEventListener('mouseenter', () => { panel.style.display = 'block'; });
  wm.addEventListener('mouseleave', () => { panel.style.display = 'none'; });

  // Click opens simple modal with full details
  wm.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100000;
      display: flex; align-items: center; justify-content: center;
    `;
    modal.innerHTML = `
      <div style="background:white; padding:24px; border-radius:12px; max-width:420px; width:90%;">
        <h3 style="margin:0 0 16px; color:#000;">Tech Stack — ${pageKey}</h3>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">${techs.map(t => 
          `<span style="background:${t.color||'#eee'}; color:white; padding:6px 14px; border-radius:999px; font-size:13px;">${t.name}</span>`
        ).join('')}</div>
        <button onclick="this.closest('.modal').remove()" style="margin-top:20px; padding:8px 16px; background:#000; color:white; border:none; border-radius:6px; cursor:pointer;">Close</button>
      </div>
    `;
    modal.className = 'modal';
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  });

  document.body.appendChild(wm);
  console.log('✅ Tech Watermark loaded for page:', pageKey);
})();
