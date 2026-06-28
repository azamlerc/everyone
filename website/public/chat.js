// chat.js — chatbot UI for chat.html

let history = [];

function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // escape HTML
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')                   // **bold**
    .replace(/\*(.+?)\*/g, '<em>$1</em>')                               // *italic*
    .replace(/((?:^- .+\n?)+)/gm, match => {                           // - lists
      const items = match.trim().split('\n')
        .map(line => `<li>${line.replace(/^- /, '')}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    })
    .replace(/\n/g, '<br>');                                            // line breaks
}

async function sendMessage(message) {
  appendMessage('user', message);
  const thinking = appendMessage('assistant', '…');

  const res  = await fetch('/api/chat', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ history, message }),
  });
  const data = await res.json();
  history = data.history;

  thinking.querySelector('.bubble').innerHTML = renderMarkdown(data.reply);
  thinking.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function appendMessage(role, text) {
  const wrap = document.createElement('div');
  wrap.className = `chatMessage ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  document.getElementById('messages').appendChild(wrap);
  wrap.scrollIntoView({ behavior: 'smooth', block: 'end' });
  return wrap;
}

document.getElementById('input').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const val = e.target.value.trim();
  if (!val) return;
  e.target.value = '';
  sendMessage(val);
});
