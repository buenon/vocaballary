export type WordItem = {
  word: string;
  cat: string;
  path: string; // relative path under assets/svg
};

export type WordsDB = Record<string, WordItem[]>;
export type RoundOptions = readonly [WordItem, WordItem];

export type Round = {
  target: WordItem;
  options: RoundOptions;
  correctIndex: 0 | 1;
};
