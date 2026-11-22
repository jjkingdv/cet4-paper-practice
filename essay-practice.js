const essayPicker = byId("essay-picker");
const essayOutline = byId("essay-outline");
const essayAnswer = byId("essay-answer");
const essayReveal = byId("essay-reveal");
const essayCollapse = byId("essay-collapse");
const essayParagraphs = byId("essay-paragraphs");
const essayPrompts = typeof essaySource === "undefined" ? {} : essaySource;

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
  show("essay-answer", false);
  essayParagraphs.replaceChildren();
  essayReveal.setAttribute("aria-expanded", "false");
  essayReveal.textContent = "翻开完整范文";
}

function showEssayAnswer() {
  const item = currentEssay();
  const words = item.paragraphs.map(([, , english]) => english).join(" ").trim().split(/\s+/).length;
  text("essay-words", `练习范文 · 正文约 ${words} 词 · ${item.paragraphs.length} 段`);
  const blocks = item.paragraphs.map(([label, , english, chinese]) => {
    const block = document.createElement("details");
    block.className = "essay-paragraph";
    block.open = true;
    block.addEventListener("toggle", updateEssayCollapse);
    const heading = document.createElement("summary");
    heading.textContent = label;
    const body = document.createElement("p");
    body.lang = "en";
    body.textContent = english;
    const translation = document.createElement("p");
    translation.className = "muted";
    translation.textContent = chinese;
    block.append(heading, body, translation);
    return block;
  });
  essayParagraphs.replaceChildren(...blocks);
  updateEssayCollapse();
  show("essay-answer", true);
  essayReveal.setAttribute("aria-expanded", "true");
  essayReveal.textContent = "收起完整范文";
  byId("essay-answer-title").focus();
}

function updateEssayCollapse() {
  essayCollapse.textContent = essayParagraphs.querySelector("details[open]") ? "收起全部段落" : "展开全部段落";
}

essayReveal.onclick = () => {
  if (essayAnswer.hidden) showEssayAnswer();
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
