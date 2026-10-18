/**
 * Minimal, dependency-free Markdown renderer.
 * Escapes HTML first, then applies a small, safe subset:
 * headings, bold/italic, inline code, fenced code, links, blockquotes,
 * unordered + ordered lists and paragraphs.
 */

export function escapeHtml(input = '') {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inline(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}

export function renderMarkdown(markdown = '') {
  const src = escapeHtml(markdown);
  const lines = src.split(/\r?\n/);

  let html = '';
  let listOpen = null; // 'ul' | 'ol' | null
  let inFence = false;
  let fenceBuf = [];

  const closeList = () => {
    if (listOpen) {
      html += `</${listOpen}>`;
      listOpen = null;
    }
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');

    // Fenced code blocks
    if (/^```/.test(line.trim())) {
      if (inFence) {
        html += `<pre><code>${fenceBuf.join('\n')}</code></pre>`;
        fenceBuf = [];
        inFence = false;
      } else {
        closeList();
        inFence = true;
      }
      continue;
    }
    if (inFence) {
      fenceBuf.push(raw);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    let m;
    if ((m = line.match(/^###\s+(.*)$/))) {
      closeList();
      html += `<h3>${inline(m[1])}</h3>`;
      continue;
    }
    if ((m = line.match(/^##\s+(.*)$/)) || (m = line.match(/^#\s+(.*)$/))) {
      closeList();
      html += `<h2>${inline(m[1])}</h2>`;
      continue;
    }
    if ((m = line.match(/^&gt;\s?(.*)$/))) {
      closeList();
      html += `<blockquote>${inline(m[1])}</blockquote>`;
      continue;
    }
    if ((m = line.match(/^[-*]\s+(.*)$/))) {
      if (listOpen !== 'ul') {
        closeList();
        html += '<ul>';
        listOpen = 'ul';
      }
      html += `<li>${inline(m[1])}</li>`;
      continue;
    }
    if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      if (listOpen !== 'ol') {
        closeList();
        html += '<ol>';
        listOpen = 'ol';
      }
      html += `<li>${inline(m[1])}</li>`;
      continue;
    }

    closeList();
    html += `<p>${inline(line)}</p>`;
  }

  if (inFence && fenceBuf.length) {
    html += `<pre><code>${fenceBuf.join('\n')}</code></pre>`;
  }
  closeList();
  return html;
}

/** Rough word-count based reading time. */
export function readingTime(markdown = '') {
  const words = String(markdown).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Pretty date: 18 Oct 2026 */
export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function initials(name = '?') {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70)
    .replace(/^-|-$/g, '');
}
