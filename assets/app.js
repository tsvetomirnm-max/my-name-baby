<script type="module">
// Shared utilities + Supabase client (ESM)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ⬇️ Your project
const SUPABASE_URL  = "https://ldabujbsyyqhewzlrjcg.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYWJ1amJzeXlxaGV3emxyamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjE2MjIsImV4cCI6MjA3MzQzNzYyMn0.0s04-DXbURuaadddeWxzQWbpwYEi9_t7NGheMrqEN4w";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// Cookie consent (simple)
export function ensureCookieBanner(){
  const decided = localStorage.getItem("cookie_consent");
  if (decided) return;
  const bar = document.createElement("div");
  bar.className = "cookie-banner";
  bar.innerHTML = `
    <div>Използваме локално ID за предотвратяване на дублирани гласове. Може да откажеш бисквитки – ще работим с памет на устройството.</div>
    <div class="actions">
      <button id="cc-accept" class="chip">Приемам</button>
      <button id="cc-deny" class="chip">Без бисквитки</button>
    </div>`;
  document.body.append(bar);
  bar.querySelector("#cc-accept").onclick = ()=>{ localStorage.setItem("cookie_consent","all"); bar.remove(); };
  bar.querySelector("#cc-deny").onclick   = ()=>{ localStorage.setItem("cookie_consent","deny"); bar.remove(); };
}
ensureCookieBanner();

// Device fingerprint (cookie + localStorage; respects consent)
export function getFingerprint(){
  let id = localStorage.getItem("fp_mnb");
  if (!id) {
    const m = document.cookie.match(/(?:^|;)\s*fp_mnb=([^;]+)/);
    if (m) id = decodeURIComponent(m[1]);
  }
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
  }
  localStorage.setItem("fp_mnb", id);
  if (localStorage.getItem("cookie_consent") !== "deny") {
    document.cookie = `fp_mnb=${encodeURIComponent(id)}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
  }
  return id;
}

// Slug & validation (Bulgarian)
export function slugBg(s){
  s = (s || "").toString().trim().replace(/\u00A0/g, " ");
  const repl = [
    [/щ/gi,"sht"], [/ш/gi,"sh"],  [/ч/gi,"ch"],  [/ж/gi,"zh"],
    [/ц/gi,"ts"],  [/ю/gi,"yu"],  [/я/gi,"ya"],  [/й/gi,"y"],
    [/[\u045D\u040D]/g,"i"], [/[ьЬ]/g,""], [/ъ/gi,"a"],
    [/а/gi,"a"], [/б/gi,"b"], [/в/gi,"v"], [/г/gi,"g"], [/д/gi,"d"],
    [/е/gi,"e"], [/з/gi,"z"], [/и/gi,"i"], [/к/gi,"k"], [/л/gi,"l"],
    [/м/gi,"m"], [/н/gi,"n"], [/о/gi,"o"], [/п/gi,"p"], [/р/gi,"r"],
    [/с/gi,"s"], [/т/gi,"t"], [/у/gi,"u"], [/ф/gi,"f"], [/х/gi,"h"]
  ];
  for (const [re,to] of repl) s = s.replace(re,to);
  return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}
function makeCyrillicRegex(){
  try { return new RegExp("^\\p{Script=Cyrillic}[\\p{Script=Cyrillic}\\s-]{1,59}$","u"); }
  catch { return /^[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F][\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F \-]{1,59}$/; }
}
const CYR = makeCyrillicRegex();
export function isCyrillicName(s){ s=(s||"").trim().replace(/\u00A0/g," "); return CYR.test(s); }

// Icons
export const ICONS = {
  star14:   '<svg class="icon icon-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.9 6.2 20.3l1.1-6.4L2.6 9.3l6.5-.9L12 2.5z"/></svg>',
  person14: '<svg class="icon icon-person" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>',
};

// Stars painter for lists
export function paintRowStars(container, n){
  container.querySelectorAll('.row-star').forEach((btn,i)=>{
    btn.classList.toggle('filled', i < n);
  });
}
</script>
