export type WordItem = {
  w: string;
  c: string;
  u?: string;
  p: string; // public asset path
  aliases?: string[];
};

export type Round = {
  target: WordItem;
  options: [WordItem, WordItem];
  correctIndex: 0 | 1;
};
