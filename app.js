const byId = (id) => document.getElementById(id);
const text = (id, value) => { byId(id).textContent = value; };
const show = (id, visible) => { byId(id).hidden = !visible; };
const storageKey = "cet4-paper-practice-v1";
const normalize = (value) => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
const entryKey = (entry) => JSON.stringify([normalize(entry.category), normalize(entry.prompt)]);
const cardKey = (entry, answer) => JSON.stringify([entryKey(entry), normalize(answer)]);
const presetBank = sourceBank.map((entry) => ({
  ...entry, examples: entry.answers.map((answer) => examples.get(answer)).filter(Boolean)
}));

// 合并时补充新写法和缺失的例句，不覆盖已有内容或改变练习记录键。
function mergeBank(...banks) {
  const merged = new Map();
  for (const entry of banks.flat()) {
    const key = entryKey(entry);
    const saved = merged.get(key) ?? { ...entry, answers: [], examples: [] };
    const known = new Set(saved.answers.map(normalize));
    for (const answer of entry.answers) {
      const value = normalize(answer);
      if (!known.has(value)) {
        saved.answers.push(answer);
        known.add(value);
      }
    }
    const illustrated = new Set(saved.examples.map((example) => normalize(example.answer)));
    for (const example of entry.examples ?? []) {
      const value = normalize(example.answer);
      if (!illustrated.has(value)) {
        saved.examples.push(example);
        illustrated.add(value);
      }
    }
    merged.set(key, saved);
  }
  return [...merged.values()];
}

function cleanEntry(entry, number) {
  const category = typeof entry?.category === "string" ? entry.category.trim() : "";
  const prompt = typeof entry?.prompt === "string" ? entry.prompt.trim() : "";
  const answers = Array.isArray(entry?.answers) ? entry.answers : [];
  if (!category || category.length > 32 || !prompt || prompt.length > 180 || !answers.length ||
    answers.some((answer) => typeof answer !== "string" || !answer.trim() || answer.trim().length > 500 || /[\r\n]/.test(answer.trim()))) {
    throw new Error(`第 ${number} 条格式不正确：需要分类、中文提示和至少一条英文答案。`);
  }
  const answerMap = new Map(answers.map((answer) => [normalize(answer), answer.trim()]));
  if (entry.examples !== undefined && !Array.isArray(entry.examples)) {
    throw new Error(`第 ${number} 条的例句必须是列表。`);
  }
  const checked = (entry.examples ?? []).map((example) => {
    const answer = typeof example?.answer === "string" ? answerMap.get(normalize(example.answer)) : null;
    const sentence = typeof example?.sentence === "string" ? example.sentence.trim() : "";
    const translation = typeof example?.translation === "string" ? example.translation.trim() : "";
    if (!answer || !sentence || sentence.length > 1000 || translation.length > 1000 ||
      (example.translation !== undefined && typeof example.translation !== "string")) {
      throw new Error(`第 ${number} 条的例句无效：请指定本条素材中的英文答案，并填写英文例句。`);
    }
    const source = ["pdf", "adapted", "original"].includes(example.source) ? example.source : "custom";
    const page = example.page;
    if ((source === "pdf" || source === "adapted") && (!Number.isInteger(page) || page < 1 || page > 17)) {
      throw new Error(`第 ${number} 条的讲义例句缺少有效页码。`);
    }
    return { answer, sentence, translation, source, ...(source === "pdf" || source === "adapted" ? { page } : {}) };
  });
  return { category, prompt, answers: answers.map((answer) => answer.trim()), examples: checked };
}

let custom = [];
let marks = new Map();
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
  if (saved) {
    custom = saved.entries.map((entry, index) => cleanEntry(entry, index + 1));
    marks = new Map(Object.entries(saved.marks).filter(([, mark]) => mark === "right" || mark === "wrong"));
  }
} catch {
  show("storage-warning", true);
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ entries: custom, marks: Object.fromEntries(marks) }));
    show("storage-warning", false);
    return true;
  } catch {
    show("storage-warning", true);
    return false;
  }
}

let bank = [];
let cards = [];
let round = [];
let mode = "all";
let cursor = 0;
let revealed = false;
let counts = { right: 0, wrong: 0, skip: 0 };
let missed = [];
const recent = new Map();
let attempts = 0;

function updateBank() {
  bank = mergeBank(presetBank, custom);
  cards = bank.flatMap((entry) => entry.answers.map((answer, index) => ({
    id: cardKey(entry, answer), entry, answer, index
  })));
  const categories = [...new Set(bank.map((entry) => entry.category))];
  for (const id of ["category", "bank-category"]) {
    const select = byId(id);
    const previous = select.value;
    select.replaceChildren(new Option("全部分类", ""), ...categories.map((name) => new Option(name, name)));
    select.value = categories.includes(previous) ? previous : "";
  }
  byId("categories").replaceChildren(...categories.map((name) => new Option(name, name)));
  renderStats();
  renderLibrary();
}

function renderStats() {
  const right = cards.filter((card) => marks.get(card.id) === "right").length;
  const wrong = cards.filter((card) => marks.get(card.id) === "wrong").length;
  text("mastered", right);
  text("wrong", wrong);
  text("total", `共 ${cards.length} 张默写卡 · ${bank.length} 条素材`);
  byId("wrong-only").disabled = wrong === 0;
}

function shuffle(queue) {
  for (let index = queue.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [queue[index], queue[other]] = [queue[other], queue[index]];
  }
}

// 每种写法独立出卡；作答结果只由纸笔自评决定。
function start(retry = null, moveFocus = true) {
  mode = retry ? "retry" : byId("scope").value;
  const category = byId("category").value;
  const limit = byId("amount").value;
  const queue = retry ? [...retry] : cards.filter((card) =>
    (!category || card.entry.category === category) && (mode !== "wrong" || marks.get(card.id) === "wrong")
  );
  if (byId("order").value === "random") {
    shuffle(queue);
  } else {
    queue.sort((left, right) =>
      Number(marks.get(left.id) === "right") - Number(marks.get(right.id) === "right") ||
      (recent.get(left.id) ?? 0) - (recent.get(right.id) ?? 0)
    );
  }
  round = limit === "all" || retry ? queue : queue.slice(0, Number(limit));
  cursor = 0;
  counts = { right: 0, wrong: 0, skip: 0 };
  missed = [];
  text("round-mode", { all: "本轮练习", wrong: "错题复练", retry: "本轮错题" }[mode]);
  renderRound(moveFocus);
}

function renderRound(moveFocus) {
  revealed = false;
  const card = round[cursor];
  const progress = byId("progress");
  progress.max = round.length || 1;
  progress.value = cursor;
  text("position", `${card ? cursor + 1 : cursor} / ${round.length}`);
  show("question", Boolean(card));
  show("finished", !card);

  if (!card) {
    const finished = round.length > 0;
    text("finish-title", finished ? "这一轮写完了。" : "这个范围暂时没有题目。");
    text("finish-detail", finished ? "没写熟的题会留在待复习里，下次还可以单练。" : "换个分类，或回到全部题目继续写。");
    text("continue", finished ? "再练一轮" : "练习全部题目");
    show("round-result", finished);
    show("retry", missed.length > 0);
    for (const [grade, count] of Object.entries(counts)) text(`count-${grade}`, count);
    if (moveFocus) byId("finish-title").focus();
    return;
  }

  const { entry, index } = card;
  text("category-label", entry.category);
  text("variant-label", entry.answers.length > 1 ? `写法 ${index + 1} / ${entry.answers.length}` : "");
  text("prompt", entry.prompt);
  text("answer", "");
  text("hint-text", "");
  show("hint-text", false);
  show("answer-area", false);
  show("reveal-actions", true);
  show("grade-actions", false);
  if (moveFocus) byId("prompt").focus();
}

function reveal() {
  const card = round[cursor];
  if (!card || revealed) return;
  revealed = true;
  text("answer", card.answer);
  renderExample(cards.find((item) => item.id === card.id) ?? card);
  show("answer-area", true);
  show("hint-text", false);
  show("grade-actions", true);
  show("reveal-actions", false);
  byId("answer").focus({ preventScroll: true });
}

// 例句跟随当前英文写法，始终随答案一起隐藏或展开。
function renderExample(card) {
  const example = card.entry.examples.find((item) => normalize(item.answer) === normalize(card.answer));
  show("example", Boolean(example));
  if (!example) return;
  const { sentence, translation, source, page } = example;
  const labels = {
    pdf: `讲义原句 · 第 ${page} 页`,
    adapted: `根据讲义搭配改写 · 第 ${page} 页`,
    original: "四级写作自拟例句",
    custom: "自定义例句"
  };
  text("example-source", labels[source]);
  text("example-sentence", sentence);
  text("example-translation", translation);
  show("example-translation", Boolean(translation));
}

function hint() {
  const card = round[cursor];
  if (!card || revealed) return;
  const words = card.answer.split(/\s+/);
  const others = card.entry.answers.filter((answer) => answer !== card.answer).map(normalize);
  let length = 1;
  while (length < words.length - 1 && others.some((answer) => answer.startsWith(`${normalize(words.slice(0, length).join(" "))} `))) length++;
  const prefix = words.length === 1 ? Array.from(words[0])[0] : words.slice(0, length).join(" ");
  text("hint-text", `开头：${prefix}…`);
  show("hint-text", true);
  byId("hint-text").focus({ preventScroll: true });
}

function grade(mark) {
  const card = round[cursor];
  if (!card || (mark !== "skip" && !revealed)) return;
  counts[mark]++;
  recent.set(card.id, ++attempts);
  if (mark !== "skip") {
    marks.set(card.id, mark);
    if (mark === "wrong") missed.push(card);
    save();
    renderStats();
  }
  cursor++;
  renderRound(true);
}

function goTo(view) {
  for (const [section, nav] of [["practice", "nav-practice"], ["materials", "nav-materials"], ["library", "nav-bank"]]) {
    show(section, section === view);
    if (section === view) byId(nav).setAttribute("aria-current", "page");
    else byId(nav).removeAttribute("aria-current");
  }
  byId(`${view}-title`).focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function renderLibrary() {
  const query = normalize(byId("search").value);
  const category = byId("bank-category").value;
  const matches = bank.filter((entry) => (!category || entry.category === category) &&
    [entry.prompt, entry.category, ...entry.answers].some((value) => normalize(value).includes(query))
  );
  text("bank-count", `${matches.length} / ${bank.length} 条`);
  const list = byId("entries");
  const fragment = document.createDocumentFragment();
  for (const entry of matches) {
    const item = document.createElement("article");
    item.className = "entry";
    const label = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = entry.prompt;
    const group = document.createElement("span");
    group.textContent = entry.category;
    label.append(title, group);
    const answers = document.createElement("ul");
    answers.lang = "en";
    for (const answer of entry.answers) {
      const row = document.createElement("li");
      row.textContent = answer;
      answers.append(row);
    }
    item.append(label, answers);
    fragment.append(item);
  }
  if (!matches.length) {
    const empty = document.createElement("p");
    empty.textContent = "没有找到匹配的素材。";
    empty.className = "muted";
    fragment.append(empty);
  }
  list.replaceChildren(fragment);
}

function message(value, warning = false) {
  text("bank-message", value);
  byId("bank-message").classList.toggle("warning", warning);
  show("bank-message", true);
}

// 导入格式为带版本号的题库；先验证整份文件，再一次性合并。
function addEntries(entries) {
  const clean = entries.map((entry, index) => cleanEntry(entry, index + 1));
  const known = new Set(cards.map((card) => card.id));
  const illustrated = new Set(bank.flatMap((entry) => entry.examples.map((example) => cardKey(entry, example.answer))));
  let count = 0;
  let exampleCount = 0;
  const added = mergeBank(clean).flatMap((entry) => {
    const answers = entry.answers.filter((answer) => !known.has(cardKey(entry, answer)));
    const fresh = entry.examples.filter((example) => !illustrated.has(cardKey(entry, example.answer)));
    count += answers.length;
    exampleCount += fresh.length;
    if (!answers.length && !fresh.length) return [];
    const keep = new Set([...answers, ...fresh.map((example) => example.answer)].map(normalize));
    return [{ ...entry, answers: entry.answers.filter((answer) => keep.has(normalize(answer))), examples: fresh }];
  });
  if (!count && !exampleCount) {
    message("没有新素材：这些写法和例句无需重复导入。");
    return false;
  }
  custom = mergeBank(custom, added);
  const saved = save();
  byId("search").value = "";
  byId("bank-category").value = "";
  updateBank();
  const summary = [count && `已加入 ${count} 张默写卡`, exampleCount && `已添加 ${exampleCount} 条例句`].filter(Boolean).join("，");
  message(saved ? `${summary}。` : `${summary}，但没有保存成功，请先导出题库。`, !saved);
  return true;
}

async function importBank() {
  const input = byId("file");
  const [file] = input.files;
  input.value = "";
  if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error("文件超过 2 MB，请拆成小份再导入。");
    const data = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
    if (data?.version !== 1 || !Array.isArray(data.entries) || !data.entries.length) {
      throw new Error("请使用题库导出的 JSON 格式，文件内需要至少一条素材。");
    }
    addEntries(data.entries);
  } catch (error) {
    message(error instanceof SyntaxError ? "无法读取这个 JSON 文件，请检查格式。" : error.message, true);
  }
}

function exportBank() {
  const data = JSON.stringify({ version: 1, entries: bank }, null, 2);
  const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "四级默写题库.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

byId("hint-text").tabIndex = -1;
byId("answer").tabIndex = -1;
byId("nav-practice").onclick = () => goTo("practice");
byId("nav-bank").onclick = () => goTo("library");
byId("reveal").onclick = reveal;
byId("hint").onclick = hint;
for (const button of document.querySelectorAll("[data-grade]")) button.onclick = () => grade(button.dataset.grade);
byId("settings").onsubmit = (event) => { event.preventDefault(); start(); };
byId("wrong-only").onclick = () => { byId("scope").value = "wrong"; byId("category").value = ""; start(); };
byId("continue").onclick = () => {
  if (!round.length) {
    byId("scope").value = "all";
    byId("category").value = "";
  }
  start();
};
byId("retry").onclick = () => start(missed);
byId("search").oninput = renderLibrary;
byId("bank-category").onchange = renderLibrary;
byId("add").onsubmit = (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    const answers = form.get("answers").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const sentences = form.get("sentences").split(/\r?\n/).map((line) => line.trim());
    const translations = form.get("translations").split(/\r?\n/).map((line) => line.trim());
    if (sentences.slice(answers.length).some(Boolean) ||
      translations.some((line, index) => line && !sentences[index])) {
      throw new Error("例句请按英文答案的顺序逐行填写；译文必须对应同一行的英文例句。");
    }
    const examples = answers.flatMap((answer, index) => sentences[index] ?
      [{ answer, sentence: sentences[index], translation: translations[index] ?? "" }] : []);
    if (addEntries([{ category: form.get("category"), prompt: form.get("prompt"), answers, examples }])) {
      event.currentTarget.reset();
      byId("new-category").value = form.get("category");
      byId("new-prompt").focus();
    }
  } catch (error) {
    message(error.message, true);
  }
};
byId("import").onclick = () => byId("file").click();
byId("file").onchange = importBank;
byId("export").onclick = exportBank;

document.addEventListener("keydown", (event) => {
  if (event.repeat || event.isComposing || event.altKey || event.ctrlKey || event.metaKey ||
      byId("practice").hidden || event.target.closest("input, textarea, select, [contenteditable]")) return;
  if (event.code === "Space" && !revealed && round[cursor] && !event.target.closest("button")) {
    event.preventDefault();
    reveal();
  } else if (revealed && (event.key === "1" || event.key === "2")) {
    event.preventDefault();
    grade(event.key === "1" ? "right" : "wrong");
  }
});

updateBank();
start(null, false);
