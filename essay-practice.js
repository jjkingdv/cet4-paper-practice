const essayPicker = byId("essay-picker");
const essayOutline = byId("essay-outline");
const essayAnswer = byId("essay-answer");
const essayReveal = byId("essay-reveal");
const essayTranslate = byId("essay-translate");
const essayCollapse = byId("essay-collapse");
const essayParagraphs = byId("essay-paragraphs");
const essayPrompts = typeof essaySource === "undefined" ? {} : essaySource;
let essayMode = "";

essayPicker.replaceChildren(...essayBank.map((item) => new Option(item.title, item.id)));

// 切题目后回到只看题干的状态，避免看到上一题的范文。
function renderEssay() {
  const item = currentEssay();
  const original = essayPrompts[item.id];
  text("essay-type", item.type);
  text("essay-source", `${original ? "讲义题干" : "题干改述"} · 对应讲义第 ${item.page} 页`);
  text("essay-topic", item.title);
  text("essay-question", original ?? item.prompt);
  text("essay-task", item.task);
  text("essay-structure", item.structure);
  essayOutline.open = false;
  byId("essay-outline-list").replaceChildren(...item.paragraphs.map(([label, clue]) => {
    const line = document.createElement("li");
    line.textContent = `${label}。 ${clue}`;
    return line;
  }));
  hideEssayAnswer();
}

function currentEssay() {
  return essayBank.find((item) => item.id === essayPicker.value);
}

function hideEssayAnswer() {
  essayMode = "";
  show("essay-answer", false);
  essayParagraphs.replaceChildren();
  updateEssayActions();
}

function updateEssayActions() {
  essayReveal.setAttribute("aria-expanded", String(essayMode === "full"));
  essayReveal.textContent = essayMode === "full" ? "收起完整范文" : "翻开完整范文";
  essayTranslate.setAttribute("aria-expanded", String(essayMode === "chinese"));
  essayTranslate.textContent = essayMode === "chinese" ? "收起中文直译" : "先看中文直译";
}

// 仅在 PDF 有下划线的字符范围添加标记，不改变原文或其他词句。
function appendEssayText(body, english, underlines) {
  let offset = 0;
  for (const [start, end] of underlines) {
    body.append(english.slice(offset, start));
    const line = document.createElement("u");
    line.textContent = english.slice(start, end);
    body.append(line);
    offset = end;
  }
  body.append(english.slice(offset));
}

// 中文先行时，每段独立翻英文；切换模式后重新隐藏英文。
function showEssayAnswer(mode) {
  essayMode = mode;
  const chineseFirst = mode === "chinese";
  const item = currentEssay();
  const words = item.paragraphs.map(([, , english]) => english).join(" ").trim().split(/\s+/).length;
  text("essay-answer-title", chineseFirst ? "中文直译 · 逐段背诵" : "讲义范文原文");
  text("essay-words", `正文约 ${words} 词 · ${item.paragraphs.length} 段`);
  text("essay-answer-help", chineseFirst
    ? "先看这一段的中文，在纸上写英文，再点「翻开本段英文」核对。"
    : "可以收起任一段，只看段落标题，在纸上回忆后再展开核对。");
  const blocks = item.paragraphs.map(([label, , english, chinese, underlines], index) => {
    const block = document.createElement("details");
    block.className = "essay-paragraph";
    block.open = true;
    block.addEventListener("toggle", updateEssayCollapse);
    const heading = document.createElement("summary");
    heading.textContent = label;
    const body = document.createElement("p");
    body.lang = "en";
    appendEssayText(body, english, underlines);
    const translation = document.createElement("p");
    translation.className = "muted essay-translation";
    translation.textContent = chinese;
    if (!chineseFirst) {
      block.append(heading, body, translation);
      return block;
    }
    body.id = `essay-english-${index + 1}`;
    body.hidden = true;
    const actions = document.createElement("div");
    actions.className = "actions essay-english-actions";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary";
    button.textContent = "翻开本段英文";
    button.setAttribute("aria-controls", body.id);
    button.setAttribute("aria-expanded", "false");
    button.onclick = () => {
      body.hidden = !body.hidden;
      button.setAttribute("aria-expanded", String(!body.hidden));
      button.textContent = body.hidden ? "翻开本段英文" : "收起本段英文";
    };
    actions.append(button);
    block.append(heading, translation, actions, body);
    return block;
  });
  essayParagraphs.replaceChildren(...blocks);
  updateEssayCollapse();
  show("essay-answer", true);
  updateEssayActions();
  byId("essay-answer-title").focus();
}

function updateEssayCollapse() {
  essayCollapse.textContent = essayParagraphs.querySelector("details[open]") ? "收起全部段落" : "展开全部段落";
}

essayReveal.onclick = () => {
  if (essayMode !== "full") showEssayAnswer("full");
  else hideEssayAnswer();
};
essayTranslate.onclick = () => {
  if (essayMode !== "chinese") showEssayAnswer("chinese");
  else hideEssayAnswer();
};
essayCollapse.onclick = () => {
  const open = !essayParagraphs.querySelector("details[open]");
  for (const block of essayParagraphs.children) block.open = open;
  updateEssayCollapse();
};
essayPicker.onchange = renderEssay;
byId("nav-essay").onclick = () => goTo("essay");
renderEssay();
