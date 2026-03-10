document.addEventListener('DOMContentLoaded', () => {
console.log('✅ Tech Watermark loaded'); // debug log

// Detect current page (works with your static HTML filenames)
const currentPage = window.location.pathname
.split('/').pop()
.replace('.html', '') || 'index';

// tech-watermark.js
// FULLY COMMENTED FOR EASY DEBUGGING
// Place this after tech-config.js in <head> or before </body>

const techs = window.techStacks?.[currentPage] || window.techStacks?.['index'] || [];
if (techs.length === 0) {
console.warn('No tech data for page:', currentPage);
return;
}

// Create the watermark element
const watermark = document.createElement('div');
[watermark.id](http://watermark.id/) = 'tech-watermark';
watermark.style.cssText =     `position: fixed;     top: 24px;     right: 24px;     z-index: 9999;     cursor: pointer;     user-select: none;`  ;

// Trigger icon (simple gear/stack look — customize SVG if you want)
watermark.innerHTML =     `<div class="watermark-trigger" style="       background: rgba(255,255,255,0.95);       backdrop-filter: blur(12px);       border: 1px solid rgba(0,0,0,0.1);       border-radius: 9999px;       padding: 10px 16px;       display: flex;       align-items: center;       gap: 8px;       box-shadow: 0 4px 15px rgba(0,0,0,0.1);       transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);     ">       <span style="font-size: 18px;">⚙️</span>       <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.5px; color: #666;">STACK</span>     </div>`  ;

// Hover panel (expands on hover)
const panel = document.createElement('div');
panel.style.cssText =     `position: absolute;     top: 100%;     right: 0;     margin-top: 12px;     background: white;     border: 1px solid #ddd;     border-radius: 16px;     padding: 20px;     width: 280px;     box-shadow: 0 20px 40px rgba(0,0,0,0.15);     opacity: 0;     visibility: hidden;     transition: all 0.3s ease;     pointer-events: none;`  ;
panel.innerHTML =     `<div style="font-weight: 700; margin-bottom: 12px; color: #333;">This page uses:</div>     <div id="tech-list" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>`  ;

// Populate tech pills
const list = panel.querySelector('#tech-list');
techs.forEach(tech => {
const pill = document.createElement('div');
pill.style.cssText =       `background: ${tech.color || '#f1f1f1'}20;       color: ${tech.color || '#333'};       padding: 6px 12px;       border-radius: 9999px;       font-size: 13px;       font-weight: 500;       border: 1px solid ${tech.color || '#ddd'}40;`    ;
pill.textContent = [tech.name](http://tech.name/);
list.appendChild(pill);
});

watermark.appendChild(panel);

// Hover logic
const trigger = watermark.querySelector('.watermark-trigger');
trigger.addEventListener('mouseenter', () => {
panel.style.opacity = '1';
panel.style.visibility = 'visible';
panel.style.transform = 'translateY(0)';
});
trigger.addEventListener('mouseleave', () => {
panel.style.opacity = '0';
panel.style.visibility = 'hidden';
panel.style.transform = 'translateY(8px)';
});

// Click opens modal (simple alert for now — easy to upgrade)
watermark.addEventListener('click', () => {
const names = techs.map(t => [t.name](http://t.name/)).join(', ');
alert(`📋 Tech stack for this page:\\n\\n${names}\\n\\n(We can upgrade this to a beautiful modal later!)`);
});

// Add to page
document.body.appendChild(watermark);
console.log('✅ Tech Watermark added for page:', currentPage);
});
