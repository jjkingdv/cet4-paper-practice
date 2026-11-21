// 长素材使用独立的浏览器存储，不改变原短语卡和错题记录。
const materialKey = "cet4-writing-materials-v1";
const sourceNotes = typeof materialSource === "undefined" ? {} : materialSource;
const materials = materialRows.map(([id, category, title, page, variant, english, chinese, topic, use], index) => {
  const source = sourceNotes[id];
  return {
    id, category, title: variant ? `${title} · ${variant}` : title, page, topic, use,
    chunks: source?.[0] ?? english.split("|").map((part) => part.trim()),
    hints: source?.[1] ?? chinese.split("|"),
    translation: source?.[2] ?? materialTranslations[index],
    original: Boolean(source)
  };
});

const materialMarks = new Map();
try {
  const saved = JSON.parse(localStorage.getItem(materialKey) ?? "{}");
  for (const item of materials) {
    if (saved?.[item.id] === "right" || saved?.[item.id] === "review") materialMarks.set(item.id, saved[item.id]);
  }
} catch {
  show("storage-warning", true);
}

const materialCategory = byId("material-category");
const materialPicker = byId("material-picker");
const materialModes = [...document.querySelectorAll("[data-material-mode]")];
let currentMaterial = materials[0];
let materialMode = "read";
let materialChunk = 0;
let materialRevealed = false;

function materialChoices() {
  return materials.filter((item) => !materialCategory.value || item.category === materialCategory.value);
}

function refreshMaterialStats() {
  const mastered = [...materialMarks.values()].filter((mark) => mark === "right").length;
  const pending = materialMarks.size - mastered;
  text("material-mastered", mastered);
  text("material-pending", pending);
  text("material-total", `共 ${materials.length} 段 · ${materials.length - materialMarks.size} 段未自评`);
  byId("material-review").disabled = pending === 0;
  materialPicker.replaceChildren(...materialChoices().map((item) => {
    const mark = materialMarks.get(item.id);
    return new Option(`${item.title}${mark === "right" ? "（已写熟）" : mark === "review" ? "（待复习）" : ""}`, item.id);
  }));
  materialPicker.value = currentMaterial.id;
}

function startMaterial(item, mode = materialMode, focus = "") {
  currentMaterial = item;
  materialMode = mode;
  materialChunk = 0;
  text("material-status", "");
  refreshMaterialStats();
  renderMaterial(focus);
}

// 英文只在阅读或翻开当前答案后生成；下一块会清空上一块的答案。
function renderMaterial(focus = "") {
  const item = currentMaterial;
  const read = materialMode === "read";
  const chunk = materialMode === "chunk";
  materialRevealed = false;
  for (const button of materialModes) button.setAttribute("aria-pressed", String(button.dataset.materialMode === materialMode));
  text("material-type", item.category);
  text("material-source", `${item.original ? "讲义原文" : "四级写作改写"} · 对应讲义第 ${item.page} 页`);
  text("material-title", item.title);
  text("material-topic", `换一个题目：${item.topic}`);
  text("material-use", read ? item.use : "");
  byId("material-application").open = false;
  show("material-application", read);

  const instruction = document.createElement("p");
  instruction.className = "card-label";
  instruction.textContent = read ? "中文思路与对应英文" :
    chunk ? `第 ${materialChunk + 1} / ${item.chunks.length} 块 · 在纸上写对应英文` : "只看中文提纲，在纸上写完整段";
  const list = document.createElement("ol");
  if (chunk) list.start = materialChunk + 1;
  for (const index of chunk ? [materialChunk] : item.hints.keys()) {
    const row = document.createElement("li");
    row.textContent = item.hints[index];
    if (read) {
      const line = document.createElement("span");
      line.lang = "en";
      line.className = "material-fragment";
      line.textContent = item.chunks[index];
      row.append(line);
    }
    list.append(row);
  }
  const content = byId("material-content");
  content.replaceChildren(instruction, list);
  if (item.chunks.some((line) => /\[.+?\]|主题名词|行为|例子\d/.test(line))) {
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = "这是可套用模板。占位处写成当前作文题目的具体话题、行为或例子。";
    content.append(note);
  }
  if (read && item.translation) {
    const translation = document.createElement("p");
    translation.className = "muted";
    translation.textContent = `${item.original ? "讲义译文" : "参考译文"}：${item.translation}`;
    content.append(translation);
  }
  text("material-hint", "");
  text("material-english", "");
  text("material-translation", "");
  show("material-hint", false);
  show("material-answer", false);
  show("material-reveal-actions", !read);
  show("material-show-hint", chunk);
  show("material-chunk-actions", false);
  show("material-grade-actions", false);
  if (focus) byId(focus).focus();
}

function revealMaterial() {
  if (materialMode === "read" || materialRevealed) return;
  materialRevealed = true;
  const item = currentMaterial;
  const chunk = materialMode === "chunk";
  text("material-english", chunk ? item.chunks[materialChunk] : item.chunks.join(" "));
  text("material-translation", chunk ? item.hints[materialChunk] : item.translation);
  show("material-translation", chunk || Boolean(item.translation));
  show("material-answer", true);
  show("material-hint", false);
  show("material-reveal-actions", false);
  show("material-chunk-actions", chunk);
  show("material-grade-actions", !chunk);
  if (chunk) {
    text("material-next-chunk", materialChunk + 1 === item.chunks.length ? "开始整段回忆" : "下一块");
  } else {
    text("material-use", item.use);
    show("material-application", true);
  }
  byId("material-answer").focus({ preventScroll: true });
}

function gradeMaterial(mark) {
  if (materialMode !== "whole" || !materialRevealed) return;
  materialMarks.set(currentMaterial.id, mark);
  try {
    localStorage.setItem(materialKey, JSON.stringify(Object.fromEntries(materialMarks)));
    text("material-status", mark === "right" ? "已标为写熟。" : "已加入长素材待复习。");
  } catch {
    show("storage-warning", true);
    text("material-status", "本次已标记，但浏览器未能保存进度。");
  }
  refreshMaterialStats();
}

byId("material-answer").tabIndex = -1;
byId("nav-materials").onclick = () => goTo("materials");
for (const button of materialModes) {
  button.onclick = () => startMaterial(currentMaterial, button.dataset.materialMode);
}
materialCategory.onchange = () => startMaterial(materialChoices()[0]);
materialPicker.onchange = () => startMaterial(materials.find((item) => item.id === materialPicker.value));
byId("material-next").onclick = () => {
  const choices = materialChoices();
  const next = (choices.indexOf(currentMaterial) + 1) % choices.length;
  startMaterial(choices[next], materialMode, "material-title");
};
byId("material-review").onclick = () => {
  const pending = materials.filter((item) => materialMarks.get(item.id) === "review");
  if (!pending.length) return;
  const next = (pending.indexOf(currentMaterial) + 1) % pending.length;
  materialCategory.value = "";
  startMaterial(pending[next], "whole", "material-title");
};
byId("material-show-hint").onclick = () => {
  if (materialMode !== "chunk" || materialRevealed) return;
  const words = currentMaterial.chunks[materialChunk].split(/\s+/);
  const length = Math.min(3, words.length - 1);
  text("material-hint", `英文开头：${length > 0 ? words.slice(0, length).join(" ") : words[0][0]}…`);
  show("material-hint", true);
};
byId("material-reveal").onclick = revealMaterial;
byId("material-next-chunk").onclick = () => {
  if (materialChunk + 1 === currentMaterial.chunks.length) startMaterial(currentMaterial, "whole", "material-title");
  else {
    materialChunk++;
    renderMaterial("material-reveal");
  }
};
byId("material-right").onclick = () => gradeMaterial("right");
byId("material-wrong").onclick = () => gradeMaterial("review");
startMaterial(currentMaterial);
