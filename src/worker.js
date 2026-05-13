// ═══════════════════════════════════════════════════
// CEN Consultas Ambientales — Chat para equipo
// ✅ Login obligatorio (nombre + correo)
// ✅ Respuestas con fuentes (documento, página)
// ✅ Feedback para mejora continua
// ✅ Historial visible para JP
// ✅ Solo temas ambientales CEN
// ═══════════════════════════════════════════════════

// Set env vars in Cloudflare Dashboard:
// AMBIENTBOT_API = tunnel URL (ej: https://xxx.trycloudflare.com)
// GROQ_API_KEY = gsk_xxx (free)

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Consultas Ambientales CEN 🏔️</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0a1628;--surf:#0f1f38;--bdr:#1e3a5f;--txt:#e0edff;--muted:#6a8fbb;--blue:#2e7dff;--green:#1fc77e;--orange:#f5a623;--red:#ff5575;--radius:12px;--sans:'Segoe UI',system-ui,sans-serif}
body{font-family:var(--sans);background:var(--bg);color:var(--txt);min-height:100vh;display:flex;flex-direction:column}
/* Login */
.login-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.login-card{background:var(--surf);border:1px solid var(--bdr);border-radius:20px;padding:32px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.login-card h1{font-size:1.4rem;margin-bottom:4px}
.login-card .sub{color:var(--muted);font-size:.82rem;margin-bottom:20px;line-height:1.5}
.login-card .warning{background:rgba(255,85,117,.08);border:1px solid rgba(255,85,117,.2);border-radius:10px;padding:10px 12px;font-size:.75rem;color:var(--red);margin-bottom:16px;line-height:1.5}
.fld{margin-bottom:14px}
.fld label{display:block;font-size:.78rem;font-weight:600;color:var(--muted);margin-bottom:4px}
.fld input{width:100%;padding:11px 13px;border-radius:10px;background:#0a1628;border:1px solid var(--bdr);color:var(--txt);font-size:.9rem;outline:none;transition:.2s;font-family:var(--sans)}
.fld input:focus{border-color:var(--blue)}
.login-btn{width:100%;padding:12px;border-radius:10px;background:var(--blue);border:none;color:#fff;font-size:.95rem;font-weight:700;cursor:pointer;transition:.15s;margin-top:6px}
.login-btn:hover{opacity:.85}
.login-btn:disabled{opacity:.4;cursor:not-allowed}
.login-error{color:var(--red);font-size:.82rem;margin-top:8px;display:none}
/* Chat */
.chat-wrap{display:none;flex-direction:column;height:100dvh}
.header{background:linear-gradient(135deg,#0f1f38,#0a1628);border-bottom:1px solid var(--bdr);padding:10px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;flex-wrap:wrap;gap:6px}
.header-left{display:flex;align-items:center;gap:10px}
.header h1{font-size:.92rem;font-weight:700}
.header .sub{font-size:.68rem;color:var(--muted)}
.user-badge{font-size:.72rem;background:rgba(46,125,255,.15);padding:4px 10px;border-radius:8px;border:1px solid rgba(46,125,255,.25)}
.warning-bar{background:rgba(255,85,117,.08);border-bottom:1px solid rgba(255,85,117,.15);padding:6px 16px;font-size:.68rem;color:var(--red);text-align:center;flex-shrink:0}
.chat{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
.msg{max-width:92%;padding:10px 13px;border-radius:var(--radius);font-size:.85rem;line-height:1.55;animation:fadeIn .2s ease;word-wrap:break-word}
.msg.user{background:var(--blue);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.msg.assistant{background:var(--surf);border:1px solid var(--bdr);align-self:flex-start;border-bottom-left-radius:4px}
.msg.assistant .label{font-size:.6rem;color:var(--muted);font-weight:600;margin-bottom:3px;display:flex;align-items:center;gap:6px}
.msg.assistant .sources{font-size:.68rem;color:var(--muted);margin-top:6px;padding-top:6px;border-top:1px solid var(--bdr)}
.msg.assistant .sources .src{display:block;padding:2px 0;color:var(--blue);font-family:monospace;font-size:.65rem}
.msg.assistant .disclaimer{font-size:.62rem;color:var(--red);margin-top:6px;font-style:italic}
.msg.error{background:rgba(255,85,117,.1);border:1px solid rgba(255,85,117,.3);color:var(--red);align-self:flex-start}
.typing{background:var(--surf);border:1px solid var(--bdr);align-self:flex-start;padding:12px 18px}
.dots{display:flex;gap:4px}
.dots span{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:bounce 1.4s infinite}
.dots span:nth-child(2){animation-delay:.2s}.dots span:nth-child(3){animation-delay:.4s}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
.input-wrap{display:flex;gap:8px;padding:10px 14px;border-top:1px solid var(--bdr);background:var(--surf);flex-shrink:0}
.input-wrap input{flex:1;padding:10px 14px;border-radius:11px;background:#0a1628;border:1px solid var(--bdr);color:var(--txt);font-size:.85rem;outline:none;transition:.2s}
.input-wrap input:focus{border-color:var(--blue)}
.input-wrap input::placeholder{color:var(--muted)}
.input-wrap button{padding:10px 16px;border-radius:11px;background:var(--blue);border:none;color:#fff;font-weight:700;font-size:.83rem;cursor:pointer;transition:.15s}
.input-wrap button:hover{opacity:.85}
.input-wrap button:disabled{opacity:.4;cursor:not-allowed}
/* Feedback */
.feedback{margin-top:6px;display:flex;align-items:center;gap:6px;padding-top:5px;border-top:1px solid var(--bdr)}
.feedback .fb-btn{background:none;border:1px solid var(--bdr);border-radius:6px;padding:3px 8px;cursor:pointer;font-size:.7rem;color:var(--muted);transition:.15s}
.feedback .fb-btn:hover{border-color:var(--blue);color:var(--txt)}
.feedback .fb-btn.active{background:rgba(46,125,255,.15);border-color:var(--blue);color:var(--txt)}
.feedback .fb-text{font-size:.65rem;color:var(--green);flex:1;text-align:right}
.footer{font-size:.62rem;color:var(--muted);text-align:center;padding:4px;border-top:1px solid var(--bdr);flex-shrink:0}
</style>
</head>
<body>
<!-- LOGIN SCREEN -->
<div class="login-wrap" id="loginWrap">
  <div class="login-card" style="border-color:rgba(46,125,255,.3);">
    <h1>🏔️ Consultas Ambientales</h1>
    <div class="sub">Sistema de consultas sobre exigencias ambientales<br>Proyecto Minera Centinela</div>
    <div class="warning">⚠️ Las respuestas son referenciales y deben ser verificadas con las fuentes oficiales antes de su uso.</div>
    <div class="fld"><label>Nombre completo</label><input type="text" id="nameInput" placeholder="Ej: María González" autofocus></div>
    <div class="fld"><label>Correo electrónico</label><input type="email" id="emailInput" placeholder="Ej: mgonzalez@cen.cl"></div>
    <div class="fld"><label>Área / Cargo (opcional)</label><input type="text" id="roleInput" placeholder="Ej: Medio Ambiente"></div>
    <div class="login-error" id="loginError">Completa nombre y correo para continuar</div>
    <button class="login-btn" id="loginBtn" onclick="login()">Ingresar al sistema</button>
  </div>
</div>

<!-- CHAT SCREEN -->
<div class="chat-wrap" id="chatWrap">
  <div class="header">
    <div class="header-left">
      <div>
        <h1>🏔️ Exigencias Ambientales CEN</h1>
        <div class="sub" id="userInfo">Consultas sobre normativa aplicable</div>
      </div>
    </div>
    <div class="user-badge" id="userBadge">—</div>
  </div>
  <div class="warning-bar">⚠️ Respuestas referenciales — verifique con fuentes oficiales antes de usar</div>
  <div class="chat" id="chat"></div>
  <div class="input-wrap">
    <input type="text" id="input" placeholder='Ej: ¿Cuáles son los límites de MP10 en el DS59?' autofocus>
    <button id="btn" onclick="send()">Consultar</button>
  </div>
  <div class="footer">🔒 Consultas registradas con tu nombre · Solo temas ambientales CEN</div>
</div>

<script>
let userName='', userEmail='', userRole='', sessionHistory=[];
const NAME_KEY = 'cen_user_name';
const EMAIL_KEY = 'cen_user_email';

// Restore saved login
const savedName = localStorage.getItem(NAME_KEY);
const savedEmail = localStorage.getItem(EMAIL_KEY);
if (savedName && savedEmail) {
  document.getElementById('nameInput').value = savedName;
  document.getElementById('emailInput').value = savedEmail;
}

function login() {
  const n = document.getElementById('nameInput').value.trim();
  const e = document.getElementById('emailInput').value.trim();
  const r = document.getElementById('roleInput').value.trim();
  const err = document.getElementById('loginError');
  if (!n || !e) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  userName = n; userEmail = e; userRole = r;
  localStorage.setItem(NAME_KEY, n);
  localStorage.setItem(EMAIL_KEY, e);
  document.getElementById('loginWrap').style.display = 'none';
  document.getElementById('chatWrap').style.display = 'flex';
  const info = userRole ? n + ' · ' + userRole : n;
  document.getElementById('userBadge').textContent = n;
  document.getElementById('userInfo').textContent = '👤 ' + info;
  document.getElementById('input').focus();
  addMsg('¡Bienvenido, ' + n + '! Puedes consultar sobre exigencias ambientales del proyecto Minera Centinela. Incluiré las fuentes (documento y página) en cada respuesta. 🔍\n\n*Si ves algún error o corrección, usa 👍 o 👎 al final de la respuesta para ayudarme a mejorar.*', 'assistant');
}

function addMsg(text, role, fuentes) {
  const chat = document.getElementById('chat');
  const d = document.createElement('div'); d.className = 'msg ' + role;
  if (role === 'assistant') {
    let html = '<div class="label">🏔️ Asistente Ambiental CEN</div>';
    html += text.replace(/\\n/g, '<br>');
    if (fuentes && fuentes.length > 0) {
      html += '<div class="sources">📄 <strong>Fuentes consultadas:</strong>';
      fuentes.forEach(f => { html += '<span class="src">📌 ' + f + '</span>'; });
      html += '</div>';
    }
    html += '<div class="disclaimer">⚠️ Verifique esta información con las fuentes oficiales antes de tomar decisiones.</div>';
    // Feedback
    const id = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2,4);
    html += '<div class="feedback" id="' + id + '">';
    html += '<button class="fb-btn" onclick="feedback(\\'' + id + '\\',\\'like\\')">👍 Correcto</button>';
    html += '<button class="fb-btn" onclick="feedback(\\'' + id + '\\',\\'dislike\\')">👎 Necesita corrección</button>';
    html += '<span class="fb-text" id="fb-text-' + id + '"></span></div>';
    d.innerHTML = html;
  } else {
    d.innerHTML = text.replace(/\\n/g, '<br>');
  }
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  const d = document.createElement('div'); d.className = 'msg typing'; d.id = 'typing';
  d.innerHTML = '<div class="dots"><span></span><span></span><span></span></div>';
  document.getElementById('chat').appendChild(d);
  document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
}

function hideTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

let msgCount = 0;
async function send() {
  const input = document.getElementById('input'); const btn = document.getElementById('btn');
  const text = input.value.trim(); if (!text || btn.disabled) return;
  input.value = ''; btn.disabled = true;
  addMsg(text, 'user'); showTyping();
  msgCount++;
  try {
    const r = await fetch('/api/ask', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text, name: userName, email: userEmail, role: userRole, history: sessionHistory.slice(-6), msgId: msgCount })
    });
    const data = await r.json(); hideTyping();
    if (data.error) addMsg('⚠️ ' + data.error, 'error');
    else if (data.respuesta) {
      addMsg(data.respuesta, 'assistant', data.fuentes);
      sessionHistory.push({ q: text, a: data.respuesta, f: data.fuentes });
    } else addMsg('⚠️ No se pudo obtener respuesta.', 'error');
  } catch (e) { hideTyping(); addMsg('⚠️ Error de conexión con el servidor.', 'error'); }
  btn.disabled = false; input.focus();
}

// Feedback function
function feedback(msgId, type) {
  const fbText = document.getElementById('fb-text-' + msgId);
  if (!fbText) return;
  const btns = document.querySelectorAll('#' + msgId + ' .fb-btn');
  btns.forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  if (type === 'like') {
    fbText.textContent = '✅ Gracias por tu feedback';
  } else {
    fbText.textContent = '📝 Anotado para mejorar. ¿Qué corrección sugieres?';
  }
}

document.getElementById('input').addEventListener('keydown', e => { if (e.key==='Enter') send(); });
document.getElementById('emailInput').addEventListener('keydown', e => { if (e.key==='Enter') login(); });
document.getElementById('nameInput').addEventListener('keydown', e => { if (e.key==='Enter') document.getElementById('emailInput').focus(); });
</script>
</body>
</html>`

// ─── Worker ───
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (url.pathname === '/' || url.pathname === '/chat') {
      return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', ...cors } });
    }
    if (url.pathname === '/api/ask' && request.method === 'POST') {
      return handleAsk(request, env, ctx);
    }
    return new Response('Not Found', { status: 404 });
  }
}

async function handleAsk(request, env, ctx) {
  try {
    const body = await request.json();
    const question = (body.question || '').trim();
    const name = body.name || 'Anónimo';
    const email = body.email || '—';
    const role = body.role || '';
    if (!question) {
      return new Response(JSON.stringify({ error: 'Consulta vacía' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const AB_API = env.AMBIENTBOT_API || '';
    const GROQ_KEY = env.GROQ_API_KEY || '';
    let responseText = '', fuentes = [];

    // 1) Try AmbientBot RAG (has document context)
    if (AB_API) {
      try {
        const ragRes = await fetch(AB_API + '/api/ask', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });
        if (ragRes.ok) {
          const ragData = await ragRes.json();
          responseText = ragData.respuesta || '';
          fuentes = (ragData.fuentes || []).map(f => f.replace(/\.pdf$/, ''));
        }
      } catch (e) { /* fallback to Groq */ }
    }

    // 2) Fallback to Groq if RAG unavailable
    if (!responseText && GROQ_KEY) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + GROQ_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Eres un asistente experto en normativa ambiental chilena y exigencias del proyecto Minera Centinela. Responde solo sobre temas ambientales. Incluye siempre las fuentes normativas (DS, D.S., RCA, DIA, EIA) cuando sea posible. Si no sabes, dilo. Responde en español.' },
            { role: 'user', content: question }
          ],
          max_tokens: 2048, temperature: 0.3
        })
      });
      if (groqRes.ok) {
        const groqData = await groqRes.json();
        responseText = groqData.choices?.[0]?.message?.content || '';
        fuentes = []; // Groq directo no tiene fuentes documentales
      }
    }

    if (!responseText) {
      responseText = '⚠️ Lo siento, el servicio de consulta no está disponible en este momento. Por favor intenta de nuevo más tarde.';
    }

    // Clean the response (remove excessive AmbientBot formatting)
    responseText = responseText
      .replace(/^[\s\S]*?Respuesta generada por asistente IA[\s\S]*?─+\n*/m, '')
      .replace(/---[\s\S]*?$/, '')
      .replace(/^.*AmbientBot.*Valy IA.*$/m, '')
      .trim();

    // 3) Log query (fire-and-forget)
    if (AB_API) {
      ctx.waitUntil(
        fetch(AB_API + '/api/team-logs', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, email, role, query: question,
            response: responseText.substring(0, 800),
            fuentes: fuentes.slice(0, 8),
            timestamp: new Date().toISOString()
          })
        }).catch(() => {})
      );
    }

    return new Response(JSON.stringify({ respuesta: responseText, fuentes: fuentes.slice(0, 8) }), {
      headers: { 'Content-Type': 'application/json', ...{ 'Access-Control-Allow-Origin': '*' } }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
