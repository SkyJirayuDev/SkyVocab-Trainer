export const QUIZ_SCORE = {
  flashcard: (isCorrect: boolean) => isCorrect ? 1 : 0,
  multiple: (isCorrect: boolean) => isCorrect ? 2 : 0,
  fill: (isCorrect: boolean) => isCorrect ? 3 : 0,
  typing: (isCorrect: boolean) => isCorrect ? 2.5 : 0,
  listening: (isCorrect: boolean) => isCorrect ? 1.5 : 0,
};
