// ═══════════════════════════════════════════════════
// CEN Exigencias Ambientales — Chat para equipo
// Solo consultas asociadas a exigencias ambientales CEN
// Logs visibles para JP
// ═══════════════════════════════════════════════════

// 🔧 CONFIG: Set these as environment variables in Cloudflare Dashboard
// AMBIENTBOT_API = URL del tunnel de AmbientBot
// GROQ_API_KEY = API key de Groq (gratis)

const SYSTEM_PROMPT = (
  "Eres un asistente especializado en exigencias ambientales del proyecto Minera Centinela. " +
  "Solo respondes preguntas relacionadas con: " +
  "- Exigencias ambientales de la RCA (Resolución de Calificación Ambiental) " +
  "- Normativa ambiental chilena aplicable a Minera Centinela " +
  "- Monitoreo de material particulado (MP10, MP2.5), calidad del aire " +
  "- Residuos, agua, flora, fauna, ruido, sociales " +
  "- Fiscalizaciones de la SMA y otras autoridades " +
  "- Compromisos ambientales del proyecto " +
  "Si la pregunta NO está relacionada con exigencias ambientales CEN, " +
  "responde amablemente: 'Lo siento, solo puedo ayudar con consultas sobre " +
  "exigencias ambientales del proyecto Minera Centinela. ¿Tienes alguna consulta ambiental?' " +
  "Responde siempre en español, claro y profesional. " +
  "Cuando cites información, menciona la fuente del documento si está disponible."
)

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Consultas Ambientales CEN 🏔️</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0a1628;--surf:#0f1f38;--bdr:#1e3a5f;--txt:#e0edff;--muted:#6a8fbb;--blue:#2e7dff;--green:#1fc77e;--radius:12px;--sans:'Segoe UI',system-ui,sans-serif}
body{font-family:var(--sans);background:var(--bg);color:var(--txt);min-height:100vh;display:flex;flex-direction:column}
.login-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.login-card{background:var(--surf);border:1px solid var(--bdr);border-radius:20px;padding:32px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.login-card h1{font-size:1.5rem;margin-bottom:5px}
.login-card .sub{color:var(--muted);font-size:.85rem;margin-bottom:20px;line-height:1.5}
.fld{margin-bottom:14px}
.fld label{display:block;font-size:.78rem;font-weight:600;color:var(--muted);margin-bottom:4px}
.fld input{width:100%;padding:11px 13px;border-radius:10px;background:#0a1628;border:1px solid var(--bdr);color:var(--txt);font-size:.9rem;outline:none;transition:.2s;font-family:var(--sans)}
.fld input:focus{border-color:var(--blue)}
.login-btn{width:100%;padding:12px;border-radius:10px;background:var(--blue);border:none;color:#fff;font-size:.95rem;font-weight:700;cursor:pointer;transition:.15s;margin-top:6px}
.login-btn:hover{opacity:.85}
.login-btn:disabled{opacity:.4;cursor:not-allowed}
.login-error{color:#ff5575;font-size:.82rem;margin-top:8px;display:none}
.chat-wrap{display:none;flex-direction:column;height:100dvh}
.header{background:linear-gradient(135deg,#0f1f38,#0a1628);border-bottom:1px solid var(--bdr);padding:12px 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.header-left{display:flex;align-items:center;gap:10px}
.header h1{font-size:.95rem;font-weight:700}
.header .sub{font-size:.7rem;color:var(--muted)}
.user-badge{font-size:.75rem;background:rgba(46,125,255,.15);padding:5px 10px;border-radius:8px;border:1px solid rgba(46,125,255,.25)}
.chat{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
.msg{max-width:90%;padding:10px 14px;border-radius:var(--radius);font-size:.86rem;line-height:1.55;animation:fadeIn .2s ease;word-wrap:break-word}
.msg.user{background:var(--blue);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.msg.assistant{background:var(--surf);border:1px solid var(--bdr);align-self:flex-start;border-bottom-left-radius:4px}
.msg.assistant .label{font-size:.62rem;color:var(--muted);font-weight:600;margin-bottom:3px}
.msg.error{background:rgba(255,85,117,.1);border:1px solid rgba(255,85,117,.3);color:#ff5575;align-self:flex-start}
.typing{background:var(--surf);border:1px solid var(--bdr);align-self:flex-start;padding:12px 18px}
.dots{display:flex;gap:4px}
.dots span{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:bounce 1.4s infinite}
.dots span:nth-child(2){animation-delay:.2s}.dots span:nth-child(3){animation-delay:.4s}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
.input-wrap{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--bdr);background:var(--surf);flex-shrink:0}
.input-wrap input{flex:1;padding:10px 14px;border-radius:11px;background:#0a1628;border:1px solid var(--bdr);color:var(--txt);font-size:.86rem;outline:none;transition:.2s}
.input-wrap input:focus{border-color:var(--blue)}
.input-wrap input::placeholder{color:var(--muted)}
.input-wrap input:disabled{opacity:.5}
.input-wrap button{padding:10px 16px;border-radius:11px;background:var(--blue);border:none;color:#fff;font-weight:700;font-size:.85rem;cursor:pointer;transition:.15s}
.input-wrap button:hover{opacity:.85}
.input-wrap button:disabled{opacity:.4;cursor:not-allowed}
.footer{font-size:.65rem;color:var(--muted);text-align:center;padding:5px;border-top:1px solid var(--bdr)}
</style>
</head>
<body>
<div class="login-wrap" id="loginWrap">
  <div class="login-card">
    <h1>🏔️ Consultas Ambientales</h1>
    <div class="sub">Proyecto Exigencias Ambientales · Minera Centinela</div>
    <div class="fld"><label>Nombre completo</label><input type="text" id="nameInput" placeholder="Ej: María González" autofocus></div>
    <div class="fld"><label>Correo electrónico</label><input type="email" id="emailInput" placeholder="Ej: mgonzalez@cen.cl"></div>
    <div class="login-error" id="loginError">Completa todos los campos</div>
    <button class="login-btn" id="loginBtn" onclick="login()">Ingresar</button>
  </div>
</div>
<div class="chat-wrap" id="chatWrap">
  <div class="header">
    <div class="header-left">
      <div>
        <h1>🏔️ Exigencias Ambientales CEN</h1>
        <div class="sub">Consultas sobre normativa aplicable</div>
      </div>
    </div>
    <div class="user-badge" id="userBadge">—</div>
  </div>
  <div class="chat" id="chat"></div>
  <div class="input-wrap">
    <input type="text" id="input" placeholder="Ej: ¿Cuáles son los límites de MP10?" autofocus>
    <button id="btn" onclick="send()">Enviar</button>
  </div>
  <div class="footer">🔒 Consultas registradas · Solo temas ambientales CEN</div>
</div>
<script>
let userName = '', userEmail = '', sessionHistory = [];
function login() {
  const n = document.getElementById('nameInput').value.trim();
  const e = document.getElementById('emailInput').value.trim();
  const err = document.getElementById('loginError');
  if (!n || !e) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  userName = n; userEmail = e;
  document.getElementById('loginWrap').style.display = 'none';
  document.getElementById('chatWrap').style.display = 'flex';
  document.getElementById('userBadge').textContent = n;
  document.getElementById('input').focus();
  addMsg('¡Bienvenido, ' + n + '! Puedes consultar sobre exigencias ambientales del proyecto Minera Centinela. ¿En qué puedo ayudarte? 🏔️', 'assistant');
}
function addMsg(text, role) {
  const d = document.createElement('div'); d.className = 'msg ' + role;
  if (role === 'assistant') d.innerHTML = '<div class="label">🏔️ Asistente Ambiental</div>' + text.replace(/\\n/g, '<br>');
  else d.innerHTML = text.replace(/\\n/g, '<br>');
  document.getElementById('chat').appendChild(d);
  document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
}
function showTyping() {
  const d = document.createElement('div'); d.className = 'msg typing'; d.id = 'typing';
  d.innerHTML = '<div class="dots"><span></span><span></span><span></span></div>';
  document.getElementById('chat').appendChild(d);
  document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
}
function hideTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }
async function send() {
  const input = document.getElementById('input'); const btn = document.getElementById('btn');
  const text = input.value.trim(); if (!text || btn.disabled) return;
  input.value = ''; btn.disabled = true;
  addMsg(text, 'user'); showTyping();
  try {
    const r = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text, name: userName, email: userEmail, history: sessionHistory.slice(-6) }) });
    const data = await r.json(); hideTyping();
    if (data.error) addMsg('⚠️ ' + data.error, 'error');
    else if (data.respuesta) { addMsg(data.respuesta, 'assistant'); sessionHistory.push({ q: text, a: data.respuesta }); }
    else addMsg('⚠️ No se pudo obtener respuesta.', 'error');
  } catch (e) { hideTyping(); addMsg('⚠️ Error de conexión.', 'error'); }
  btn.disabled = false; input.focus();
}
document.getElementById('input').addEventListener('keydown', e => { if (e.key==='Enter') send(); });
document.getElementById('emailInput').addEventListener('keydown', e => { if (e.key==='Enter') login(); });
document.getElementById('nameInput').addEventListener('keydown', e => { if (e.key==='Enter') document.getElementById('emailInput').focus(); });
</script>
</body>
</html>`

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
    
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (url.pathname === '/' || url.pathname === '/chat') {
      return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', ...cors } });
    }
    if (url.pathname === '/api/ask' && request.method === 'POST') {
      return await handleAsk(request, env);
    }
    return new Response('Not Found', { status: 404 });
  }
}

async function handleAsk(request, env) {
  try {
    const body = await request.json();
    const question = (body.question || '').trim();
    const name = body.name || 'Anonymous';
    const email = body.email || 'unknown';
    if (!question) return new Response(JSON.stringify({ error: 'Consulta vacía' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const AB_API = env.AMBIENTBOT_API || '';
    const GROQ_KEY = env.GROQ_API_KEY || '';

    let responseText, fuentes = [];

    // Try AmbientBot RAG first
    if (AB_API) {
      try {
        const ragRes = await fetch(AB_API + '/api/ask', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });
        if (ragRes.ok) {
          const ragData = await ragRes.json();
          responseText = ragData.respuesta;
          fuentes = ragData.fuentes || [];
        }
      } catch (e) { /* fallback to Groq */ }
    }

    // Fallback to Groq if RAG failed
    if (!responseText && GROQ_KEY) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + GROQ_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: question }],
          max_tokens: 2048, temperature: 0.3
        })
      });
      if (groqRes.ok) {
        const groqData = await groqRes.json();
        responseText = groqData.choices?.[0]?.message?.content;
      }
    }

    if (!responseText) responseText = '⚠️ Servicio no disponible. Intenta de nuevo.';

    // Log query (fire-and-forget)
    if (AB_API) {
      ctx.waitUntil(fetch(AB_API + '/api/team-logs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, query: question, response: responseText.substring(0, 500), fuentes: fuentes?.slice(0, 5) })
      }).catch(() => {}));
    }

    return new Response(JSON.stringify({ respuesta: responseText, fuentes: fuentes?.slice(0, 5) }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { headers: { 'Content-Type': 'application/json' } });
  }
}
