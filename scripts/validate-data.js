const path = require("path");

const jiti = require("jiti")(__filename);
const { quizzes } = jiti("../src/data/quizzes.ts");
const { allCards } = jiti("../src/data/index.ts");

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const cardById = new Map(allCards.map((card) => [card.id, card]));

const quizIdSet = new Set();
for (const quiz of quizzes) {
  if (quizIdSet.has(quiz.id)) {
    fail(`[duplicate quiz id] ${quiz.id}`);
  }
  quizIdSet.add(quiz.id);

  const card = cardById.get(quiz.cardId);
  if (!card) {
    fail(`[missing card] quiz=${quiz.id} cardId=${quiz.cardId}`);
  } else if (card.category !== quiz.category) {
    fail(
      `[category mismatch] quiz=${quiz.id} quizCategory=${quiz.category} cardCategory=${card.category}`,
    );
  }

  if (!Array.isArray(quiz.options) || quiz.options.length !== 4) {
    fail(`[options length] quiz=${quiz.id} length=${quiz.options?.length}`);
  } else {
    const correctCount = quiz.options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      fail(`[correct count] quiz=${quiz.id} correctCount=${correctCount}`);
    }

    const optionTexts = quiz.options.map((o) => (o.text ?? "").trim());
    if (optionTexts.some((t) => t.length === 0)) {
      fail(`[empty option text] quiz=${quiz.id}`);
    }
    if (new Set(optionTexts).size !== optionTexts.length) {
      fail(`[duplicate option text] quiz=${quiz.id}`);
    }
  }

  if (!quiz.question || quiz.question.trim().length === 0) {
    fail(`[empty question] quiz=${quiz.id}`);
  }
  if (!quiz.explanation || quiz.explanation.trim().length === 0) {
    fail(`[empty explanation] quiz=${quiz.id}`);
  }

  if (!Array.isArray(quiz.sources) || quiz.sources.length === 0) {
    fail(`[missing sources] quiz=${quiz.id}`);
  } else {
    for (const source of quiz.sources) {
      if (!source?.title || source.title.trim().length === 0) {
        fail(`[empty source title] quiz=${quiz.id}`);
      }
      if (!source?.url || source.url.trim().length === 0) {
        fail(`[empty source url] quiz=${quiz.id}`);
      }
    }
  }
}

const quizCardIds = new Set(quizzes.map((q) => q.cardId));
for (const card of allCards) {
  if (!quizCardIds.has(card.id)) {
    fail(`[card has no quiz] cardId=${card.id}`);
  }
}

if (process.exitCode) {
  console.error("\nData validation failed.");
} else {
  console.log("Data validation passed.");
}
