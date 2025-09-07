export type WordItem = {
  word: string;
  cat: string;
  code?: string;
  path: string; // relative path under assets/svg
  aliases?: string[];
};

export type Round = {
  target: WordItem;
  options: [WordItem, WordItem];
  correctIndex: 0 | 1;
};
