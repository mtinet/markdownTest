const sampleMarkdown = `# 안녕, Markdown!

**굵은 글씨**와 *기울임 글씨*를 바로 테스트할 수 있어요.

> 인용문은 이렇게 표시됩니다.

## 할 일 목록
- [x] 제목 문법 테스트
- [ ] 링크 추가하기
- [ ] 코드 블록 확인하기

## 일반 목록
1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

[OpenAI](https://openai.com) 링크도 지원합니다.

\`인라인 코드\`는 이렇게 쓰고, 코드 블록은 아래처럼 작성해요.

\`\`\`js
const message = "Markdown preview ready!";
console.log(message);
\`\`\`
`;

const input = document.querySelector("#markdown-input");
const preview = document.querySelector("#preview");
const resetButton = document.querySelector("#reset-button");

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderInline = (value) =>
  escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

const closeList = (state, html) => {
  if (!state.listType) {
    return;
  }

  html.push(`</${state.listType}>`);
  state.listType = null;
  state.listClassName = "";
};

const openList = (state, html, listType, className = "") => {
  if (state.listType === listType && state.listClassName === className) {
    return;
  }

  closeList(state, html);
  html.push(`<${listType}${className ? ` class="${className}"` : ""}>`);
  state.listType = listType;
  state.listClassName = className;
};

const renderMarkdown = (markdown) => {
  const html = [];
  const state = { inCodeBlock: false, codeLines: [], listType: null, listClassName: "" };

  markdown.split("\n").forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (state.inCodeBlock) {
        html.push(`<pre><code>${escapeHtml(state.codeLines.join("\n"))}</code></pre>`);
        state.codeLines = [];
      } else {
        closeList(state, html);
      }

      state.inCodeBlock = !state.inCodeBlock;
      return;
    }

    if (state.inCodeBlock) {
      state.codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      closeList(state, html);
      return;
    }

    const taskMatch = line.match(/^- \[(x| )\] (.+)$/i);
    if (taskMatch) {
      openList(state, html, "ul", "task-list");
      const checked = taskMatch[1].toLowerCase() === "x" ? " checked" : "";
      html.push(`<li><label><input type="checkbox" disabled${checked}>${renderInline(taskMatch[2])}</label></li>`);
      return;
    }

    const unorderedMatch = line.match(/^- (.+)$/);
    if (unorderedMatch) {
      openList(state, html, "ul");
      html.push(`<li>${renderInline(unorderedMatch[1])}</li>`);
      return;
    }

    const orderedMatch = line.match(/^\d+\. (.+)$/);
    if (orderedMatch) {
      openList(state, html, "ol");
      html.push(`<li>${renderInline(orderedMatch[1])}</li>`);
      return;
    }

    closeList(state, html);

    if (line.startsWith("### ")) {
      html.push(`<h3>${renderInline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      html.push(`<h2>${renderInline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      html.push(`<h1>${renderInline(line.slice(2))}</h1>`);
    } else if (line.startsWith("> ")) {
      html.push(`<blockquote>${renderInline(line.slice(2))}</blockquote>`);
    } else {
      html.push(`<p>${renderInline(line)}</p>`);
    }
  });

  if (state.inCodeBlock) {
    html.push(`<pre><code>${escapeHtml(state.codeLines.join("\n"))}</code></pre>`);
  }

  closeList(state, html);
  return html.join("\n");
};

const updatePreview = () => {
  preview.innerHTML = renderMarkdown(input.value);
};

resetButton.addEventListener("click", () => {
  input.value = sampleMarkdown;
  updatePreview();
  input.focus();
});

input.value = sampleMarkdown;
updatePreview();
