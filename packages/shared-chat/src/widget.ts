/**
 * Lightweight TypeScript browser widget (no frameworks).
 * Builds to dist/widget.js and can be loaded on any static page.
 *
 * Usage in any static HTML:
 * <script src="/assets/shared-chat/widget.js" data-api-base="https://your-vercel-proxy.example.com"></script>
 *
 * The script reads data-api-base attribute on its script tag to determine the API base URL.
 */

type Role = 'system' | 'user' | 'assistant';
type Message = { role: Role; content: string };

const DEFAULT_SYSTEM_PROMPT = 'You are a helpful assistant integrated into the Geofy site. Keep answers concise.';

function readApiBase(): string {
  // get the last script tag (this script) and read data-api-base
  const scripts = document.getElementsByTagName('script');
  const me = scripts[scripts.length - 1];
  const attr = me.getAttribute('data-api-base') || '';
  return attr.replace(/\/+$/, '') || '';
}

function createNode<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, html?: string) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html) el.innerHTML = html;
  return el;
}

function styles() {
  return `
#geofy-chat {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 360px;
  max-width: calc(100% - 48px);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  z-index: 999999;
}
#geofy-chat .gc-card{
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.16);
  overflow: hidden;
  border: 1px solid rgba(16,24,40,0.05);
}
#geofy-chat .gc-header {
  padding: 12px;
  display:flex;
  align-items:center;
  gap: 8px;
  border-bottom: 1px solid rgba(16,24,40,0.04);
}
#geofy-chat .gc-header .title { font-weight:600; }
#geofy-chat .gc-body { max-height:280px; overflow:auto; padding:10px; }
#geofy-chat .gc-msg { margin:8px 0; }
#geofy-chat .gc-msg .role { display:block; font-size:12px; color:#666; }
#geofy-chat .gc-input {
  display:flex;
  gap:8px;
  padding:10px;
  border-top:1px solid rgba(16,24,40,0.04);
}
#geofy-chat input.gc-text {
  flex:1;
  padding:8px 10px;
  border-radius:8px;
  border:1px solid #e6e6e6;
}
#geofy-chat button.gc-send {
  padding:8px 12px;
  border-radius:8px;
  border: none;
  background:#2563eb;
  color:#fff;
  cursor:pointer;
}
#geofy-chat .gc-toggle {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow: 0 8px 20px rgba(37,99,235,0.18);
  cursor:pointer;
  z-index: 999998;
}
`;
}

async function sendMessageToAI(userMessage: string) {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage })
  });

  const data = await response.json();
  return data.reply; // This is the string from Gemini
}
  const data = await resp.json();
  // adapt to OpenAI response shape
  const assistant = data.choices?.[0]?.message?.content ?? data.choices?.[0]?.text ?? JSON.stringify(data);
  return assistant;
}

function mountWidget() {
  const apiBase = readApiBase();

  // CSS
  const style = document.createElement('style');
  style.innerHTML = styles();
  document.head.appendChild(style);

  // container
  const container = createNode('div', undefined, '');
  container.id = 'geofy-chat';

  // card
  const card = createNode('div', 'gc-card');
  const header = createNode('div', 'gc-header');
  header.innerHTML = `<div class="title">Geofy Assistant</div><div style="margin-left:auto;font-size:12px;color:#666">Chat</div>`;
  const body = createNode('div', 'gc-body');
  const inputRow = createNode('div', 'gc-input');
  const input = createNode('input', 'gc-text') as HTMLInputElement;
  input.placeholder = 'Ask me about the site...';
  const send = createNode('button', 'gc-send');
  send.textContent = 'Send';
  inputRow.appendChild(input);
  inputRow.appendChild(send);

  card.appendChild(header);
  card.appendChild(body);
  card.appendChild(inputRow);
  container.appendChild(card);

  // toggle (small button to open/close)
  const toggle = createNode('div', 'gc-toggle');
  toggle.innerHTML = '&#128172;';

  let open = false;
  function setOpen(v: boolean) {
    open = v;
    if (open) {
      if (!document.body.contains(container)) document.body.appendChild(container);
      if (document.body.contains(toggle)) toggle.style.display = 'none';
    } else {
      if (document.body.contains(container)) document.body.removeChild(container);
      toggle.style.display = 'flex';
    }
  }

  toggle.addEventListener('click', () => setOpen(true));
  document.body.appendChild(toggle);
  setOpen(false);

  // chat state
  const messages: Message[] = [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }];

  function renderMessages() {
    body.innerHTML = '';
    for (const m of messages.slice(1)) {
      const el = createNode('div', 'gc-msg');
      el.innerHTML = `<div class="role">${m.role}</div><div class="content">${escapeHtml(m.content)}</div>`;
      body.appendChild(el);
    }
    body.scrollTop = body.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    messages.push({ role: 'user', content: text });
    input.value = '';
    renderMessages();
    send.disabled = true;
    try {
      const assistantText = await postChat(apiBase, messages);
      messages.push({ role: 'assistant', content: String(assistantText) });
      renderMessages();
    } catch (err: any) {
      messages.push({ role: 'assistant', content: 'Error: ' + (err.message || String(err)) });
      renderMessages();
    } finally {
      send.disabled = false;
    }
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') sendMessage();
  });
  renderMessages();
}

// small helper to escape HTML in messages
function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// auto-mount
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountWidget);
} else {
  mountWidget();
}
