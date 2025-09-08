export type WordItem = {
  word: string;
  cat: string;
  path: string; // relative path under assets/svg
};

export type Round = {
  target: WordItem;
  options: [WordItem, WordItem];
  correctIndex: 0 | 1;
};
