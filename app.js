const QUIZ_OPTIONS = [
  { id: "quiz_01", label: "Quiz 01" },
  { id: "quiz_02", label: "Quiz 02" },
  { id: "quiz_03", label: "Quiz 03" },
];

const quizSelect = document.getElementById("quiz-select");
const questionsContainer = document.getElementById("questions");
const quizMeta = document.getElementById("quiz-meta");
const statusEl = document.getElementById("status");
const referencePanel = document.getElementById("reference-panel");
const answersContent = document.getElementById("answers-content");
const explanationContent = document.getElementById("explanation-content");
const showReferenceButton = document.getElementById("show-reference-button");
const copyButton = document.getElementById("copy-button");
const clearButton = document.getElementById("clear-button");

let currentQuizId = QUIZ_OPTIONS[0].id;
let currentQuizData = null;
let gradingCache = {};

init();

async function init() {
  renderQuizOptions();
  bindEvents();
  await loadAndRenderQuiz(currentQuizId);
}

function renderQuizOptions() {
  quizSelect.innerHTML = "";
  QUIZ_OPTIONS.forEach((quiz) => {
    const option = document.createElement("option");
    option.value = quiz.id;
    option.textContent = quiz.label;
    quizSelect.appendChild(option);
  });
  quizSelect.value = currentQuizId;
}

function bindEvents() {
  quizSelect.addEventListener("change", async (event) => {
    currentQuizId = event.target.value;
    hideReferencePanel();
    await loadAndRenderQuiz(currentQuizId);
  });

  showReferenceButton.addEventListener("click", async () => {
    await showReferenceFiles(currentQuizId);
  });

  copyButton.addEventListener("click", async () => {
    if (!currentQuizData) {
      return;
    }

    const markdown = buildAnswersMarkdown(currentQuizData, currentQuizId);
    try {
      await navigator.clipboard.writeText(markdown);
      setStatus("`answers.md` 형식으로 복사했습니다.");
    } catch (error) {
      setStatus("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
      // Fallback for environments where clipboard API is not available.
      const fallback = document.createElement("textarea");
      fallback.value = markdown;
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      document.body.removeChild(fallback);
    }
  });

  clearButton.addEventListener("click", () => {
    if (!currentQuizData) {
      return;
    }
    const ok = window.confirm("현재 퀴즈의 저장된 답안을 모두 지울까요?");
    if (!ok) {
      return;
    }
    currentQuizData.questions.forEach((q) => {
      saveAnswer(currentQuizId, q.number, "");
    });
    renderQuestions(currentQuizData);
    setStatus("현재 퀴즈 답안을 초기화했습니다.");
  });
}

async function loadAndRenderQuiz(quizId) {
  setStatus(`${quizId} 문제를 불러오는 중...`);
  try {
    const response = await fetch(`./${quizId}/questions.md`);
    if (!response.ok) {
      throw new Error("문제 파일을 불러오지 못했습니다.");
    }
    const markdown = await response.text();
    const parsed = parseQuestionsMarkdown(markdown);
    currentQuizData = parsed;
    renderQuizMeta(parsed);
    renderQuestions(parsed);
    setStatus(`${quizId} 준비 완료`);
  } catch (error) {
    currentQuizData = null;
    quizMeta.innerHTML = "";
    questionsContainer.innerHTML = `<p>문제를 불러오지 못했습니다: ${error.message}</p>`;
    setStatus("오류가 발생했습니다.");
  }
}

async function showReferenceFiles(quizId) {
  setStatus(`${quizId} 답안/설명을 불러오는 중...`);
  try {
    const [answersText, explanationText] = await Promise.all([
      fetchMarkdownText(`./${quizId}/answers.md`, "답안 파일"),
      fetchMarkdownText(`./${quizId}/explanation.md`, "설명 파일"),
    ]);

    answersContent.textContent = answersText;
    explanationContent.textContent = explanationText;
    referencePanel.classList.remove("hidden");
    setStatus(`${quizId} 답안/설명 표시 완료`);
  } catch (error) {
    hideReferencePanel();
    setStatus(`답안/설명 표시 실패: ${error.message}`);
  }
}

async function fetchMarkdownText(path, label) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`${label}을 불러오지 못했습니다.`);
  }
  return response.text();
}

function hideReferencePanel() {
  referencePanel.classList.add("hidden");
  answersContent.textContent = "";
  explanationContent.textContent = "";
}

function parseQuestionsMarkdown(markdown) {
  const lines = markdown.split("\n");
  const title = (lines.find((line) => line.startsWith("# ")) || "").replace("# ", "").trim();
  const scoreLine = lines.find((line) => line.includes("총 10문제 / 15점")) || "";
  const sectionByQuestion = {};
  const questions = [];

  let currentSection = "";
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      currentSection = line.replace("## ", "").trim();
    }

    const headingMatch = line.match(/^### 문제 (\d+)\s*\(([^)]+)\)/);
    if (!headingMatch) {
      continue;
    }

    const number = Number(headingMatch[1]);
    const points = headingMatch[2];
    sectionByQuestion[number] = currentSection;

    const bodyLines = [];
    let cursor = i + 1;
    while (cursor < lines.length && !lines[cursor].startsWith("### 문제 ")) {
      if (lines[cursor] !== "---") {
        bodyLines.push(lines[cursor]);
      }
      cursor += 1;
    }

    questions.push({
      number,
      points,
      section: currentSection,
      heading: line.replace("### ", "").trim(),
      body: bodyLines.join("\n").trim(),
    });

    i = cursor - 1;
  }

  return {
    title,
    scoreLine,
    questions,
    sectionByQuestion,
  };
}

function renderQuizMeta(quizData) {
  quizMeta.innerHTML = `
    <strong>${escapeHtml(quizData.title)}</strong>
    <div>${escapeHtml(quizData.scoreLine)}</div>
  `;
}

function renderQuestions(quizData) {
  questionsContainer.innerHTML = "";
  quizData.questions.forEach((question) => {
    const card = document.createElement("article");
    card.className = "question-card";

    const answer = loadAnswer(currentQuizId, question.number);
    const body = question.body || "(문제 설명 없음)";

    card.innerHTML = `
      <div class="question-head">
        <span class="question-no">문제 ${question.number}</span>
        <span class="question-points">${escapeHtml(question.points)}</span>
      </div>
      <div class="question-body">${escapeHtml(body)}</div>
      <textarea placeholder="여기에 답안을 작성하세요...">${escapeHtml(answer)}</textarea>
      <div style="margin-top: 10px;">
        <button type="button" class="reveal-answer-button">정답 보기</button>
      </div>
      <div class="question-solution hidden"></div>
    `;

    const textarea = card.querySelector("textarea");
    textarea.addEventListener("input", (event) => {
      saveAnswer(currentQuizId, question.number, event.target.value);
      setStatus(`문제 ${question.number} 답안 자동 저장됨`);
    });

    const revealButton = card.querySelector(".reveal-answer-button");
    const solutionBox = card.querySelector(".question-solution");
    revealButton.addEventListener("click", async () => {
      const solution = await getQuestionSolution(currentQuizId, question.number);
      if (!solution) {
        solutionBox.classList.remove("hidden");
        solutionBox.innerHTML = "<strong>정답 정보가 없습니다.</strong>";
        setStatus(`문제 ${question.number} 정답 정보를 찾지 못했습니다.`);
        return;
      }

      solutionBox.classList.remove("hidden");
      solutionBox.innerHTML = `
        <div><strong>정답</strong>: ${escapeHtml(solution.answer)}</div>
        <div style="margin-top:6px;"><strong>설명</strong>: ${escapeHtml(solution.explanation)}</div>
      `;
      setStatus(`문제 ${question.number} 정답/설명 표시 완료`);
    });

    questionsContainer.appendChild(card);
  });
}

async function getQuestionSolution(quizId, questionNumber) {
  if (!gradingCache[quizId]) {
    try {
      const gradingText = await fetchMarkdownText(`./${quizId}/grading.md`, "채점 파일");
      gradingCache[quizId] = parseGradingMarkdown(gradingText);
    } catch (error) {
      setStatus(`채점 파일 로드 실패: ${error.message}`);
      gradingCache[quizId] = {};
    }
  }
  return gradingCache[quizId][questionNumber] || null;
}

function parseGradingMarkdown(markdown) {
  const result = {};
  const lines = markdown.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    const headerMatch = lines[i].match(/^### 문제 (\d+)/);
    if (!headerMatch) {
      continue;
    }

    const questionNumber = Number(headerMatch[1]);
    const block = [];
    let cursor = i + 1;
    while (cursor < lines.length && !lines[cursor].startsWith("### 문제 ")) {
      block.push(lines[cursor]);
      cursor += 1;
    }

    const answerLine = block.find((line) => line.startsWith("- **정답**:"));
    let answer = answerLine ? answerLine.replace("- **정답**:", "").trim() : "정답 정보 없음";

    if (answer === "완벽!") {
      const myAnswerLine = block.find((line) => line.startsWith("- **네 답**:"));
      if (myAnswerLine) {
        answer = myAnswerLine.replace("- **네 답**:", "").trim();
      }
    }

    let explanation = "";
    const explanationIndex = block.findIndex((line) => line.startsWith("- **해설**:"));
    if (explanationIndex >= 0) {
      const explanationLines = [block[explanationIndex].replace("- **해설**:", "").trim()];
      for (let j = explanationIndex + 1; j < block.length; j += 1) {
        const line = block[j];
        if (line.startsWith("- **")) {
          break;
        }
        if (line.trim().length === 0) {
          continue;
        }
        explanationLines.push(line.trim());
      }
      explanation = explanationLines.join(" ");
    }

    if (!explanation) {
      const fallbackLine = block.find(
        (line) =>
          line.trim().length > 0 &&
          !line.startsWith("- **네 답**:") &&
          !line.startsWith("- **정답**:")
      );
      explanation = fallbackLine ? fallbackLine.replace(/^- /, "").trim() : "해설 정보 없음";
    }

    result[questionNumber] = { answer, explanation };
    i = cursor - 1;
  }

  return result;
}

function buildAnswersMarkdown(quizData, quizId) {
  const lines = [];
  lines.push(`# ${quizData.title.replace("Practice ", "")} — My Answers`);
  lines.push("");
  lines.push(`답안 작성 후 "${quizId.replace("_", " ")} 채점해줘" 라고 요청하세요.`);
  lines.push("");
  lines.push("---");
  lines.push("");

  let lastSection = "";
  quizData.questions.forEach((question) => {
    const section = sectionToAnswerHeading(question.section);
    if (section !== lastSection) {
      if (lastSection) {
        lines.push("---");
        lines.push("");
      }
      lines.push(`## ${section}`);
      lines.push("");
      lastSection = section;
    }

    lines.push(`### 문제 ${question.number} (${question.points})`);
    lines.push(loadAnswer(currentQuizId, question.number) || "");
    lines.push("");
  });

  return lines.join("\n");
}

function sectionToAnswerHeading(section) {
  if (section.includes("객관식")) {
    return "객관식";
  }
  if (section.includes("단답형")) {
    return "단답형";
  }
  if (section.includes("서술형")) {
    return "서술형";
  }
  return section || "기타";
}

function answerKey(quizId, questionNumber) {
  return `quiz-answer:${quizId}:${questionNumber}`;
}

function saveAnswer(quizId, questionNumber, answer) {
  localStorage.setItem(answerKey(quizId, questionNumber), answer);
}

function loadAnswer(quizId, questionNumber) {
  return localStorage.getItem(answerKey(quizId, questionNumber)) || "";
}

function setStatus(message) {
  statusEl.textContent = message;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
