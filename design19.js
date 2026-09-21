'use strict';
/* Pure presentation adapters. Keep all data, routes and Classic renderers intact. */
const supplyMiniClassic19 = supplyMini;
let illustrationId19 = 0;
supplyMini = function(type) {
  if (S.settings.design !== 'new') return supplyMiniClassic19(type);
  const id = 'reta-art-' + (++illustrationId19), water = type === 'water';
  const bottle = type === 'vial' || water;
  const defs = `<defs>
    <linearGradient id="${id}-glass"><stop stop-color="#6186bd"/><stop offset=".24" stop-color="#ebf7ff"/><stop offset=".45" stop-color="#96b6df"/><stop offset=".75" stop-color="#d3e8ff"/><stop offset="1" stop-color="#4e6d9d"/></linearGradient>
    <linearGradient id="${id}-cap"><stop stop-color="#263a77"/><stop offset=".3" stop-color="#82a9ff"/><stop offset=".65" stop-color="#506bcc"/><stop offset="1" stop-color="#202d65"/></linearGradient>
    <linearGradient id="${id}-liquid" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${water?'#67dcff':'#c3b2ff'}"/><stop offset="1" stop-color="${water?'#448bd5':'#6961d9'}"/></linearGradient>
  </defs>`;
  const shape = bottle ? `<rect x="16" y="11" width="16" height="10" rx="3" fill="url(#${id}-glass)"/>
    <path d="M16 19L10 25V47Q10 53 16 53H32Q38 53 38 47V25L32 19Z" fill="url(#${id}-glass)" stroke="#9fbeea" stroke-width=".7"/>
    <path d="M12 36H36V47Q36 51 31 51H17Q12 51 12 47Z" fill="url(#${id}-liquid)" opacity=".8"/>
    <rect x="13" y="5" width="22" height="10" rx="3" fill="url(#${id}-cap)" stroke="#a5caff" stroke-width=".7"/><path d="M15 7H33" stroke="#d1e7ff" opacity=".8"/>
    <rect x="11" y="28" width="26" height="15" rx="2" fill="#ecf3ff"/><text x="24" y="38.5" fill="#263f6a" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700">${water?'BAC':'RET'}</text>
    <path d="M15 23Q13 24 13 28V46" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>`
    : type === 'pen' ? `<g transform="rotate(22 24 28)"><rect x="18" y="3" width="12" height="48" rx="5" fill="url(#${id}-cap)" stroke="#92b2f1"/>
    <path d="M18 15H30V33H18Z" fill="url(#${id}-glass)"/><rect x="20" y="19" width="8" height="8" rx="2" fill="#12233e"/><path d="M22 21H26M22 24H25" stroke="#90e4ff"/>
    <path d="M20 36V46" stroke="#d4e8ff" opacity=".7"/><rect x="21" y="50" width="6" height="3" rx="1" fill="#97b5df"/></g>`
    : `<rect x="16" y="6" width="16" height="45" rx="5" fill="url(#${id}-glass)" stroke="#9fbeea"/>
    <rect x="17" y="7" width="14" height="7" rx="2" fill="url(#${id}-cap)"/><path d="M18 25H30V40H18Z" fill="url(#${id}-liquid)" opacity=".8"/>
    <path d="M17 43H31M17 47H31" stroke="#435a80" stroke-width="3"/><path d="M20 17V39" stroke="white" opacity=".7"/>`;
  return `<svg class="supply-mini" viewBox="0 0 48 56" aria-hidden="true" focusable="false">${defs}${shape}</svg>`;
};
const settingsClassic19 = settings;
settings = function() {
  return settingsClassic19().replace('Off: Classic. On: new navigation and Today layout. Both views share all records and settings.',
    'Off: Classic. On: blue–violet New design with a glossy finish on every card. 3D adds deeper lighting and shadows. Both views share all records and settings.');
};
// A separate presentation preference preserves the Classic accent on comparison.
const paletteClassic19 = accentPalette;
const palette19 = [['#315be6','Blue · Indigo'],['#7141d8','Violet'],...accentOptions];
accentPalette = function() {
  if (S.settings.design !== 'new') return paletteClassic19();
  const selected = S.settings.newAccent || '#315be6';
  return '<div class="accent-palette">'+palette19.map(([c,n])=>`<button class="swatch ${selected===c?'selected':''}" style="background:${c}" aria-label="${n}" aria-pressed="${selected===c}" onclick="setSetting('newAccent','${c}')"></button>`).join('')+'</div>';
};
const applyThemeClassic19 = applyTheme;
applyTheme = function() {
  document.body.classList.toggle('new-design',S.settings.design==='new');
  applyThemeClassic19();
  const body=document.body;
  if (S.settings.design !== 'new') {
    body.style.removeProperty('--ui-readable');body.style.removeProperty('--ui-gradient');return;
  }
  const requested=S.settings.newAccent || '#315be6';
  const base=palette19.some(([c])=>c===requested)?requested:'#315be6';
  const dark=body.classList.contains('dark');
  body.style.setProperty('--ui-readable',readableAccent(base,dark?'#12243c':'#f1f6ff'));
  // White button text remains readable even when the selected swatch is yellow.
  const start=readableAccent(base,'#ffffff');
  body.style.setProperty('--ui-gradient',`linear-gradient(120deg,${start},#5145cb 65%,#7741bb)`);
};
render();
