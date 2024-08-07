export function parseAndCountOccurence(
  string: String,
  filter: String[] = [],
  type?: string
): { words: string; count: number; percent: number; type: string }[] {
  const parsedString = string
    .toLowerCase()
    .split(/\/|\.|\?|\-|\=|\s+|,/)
    .filter((word) => {
      if (filter.includes(word) || word.length < 2 || !word) {
        return false;
      }
      return true;
    });
  const topWords: {
    words: string;
    count: number;
    percent: number;
    type: string;
  }[] = [];

  const total = parsedString.length;

  parsedString.forEach((word) => {
    const currentWord = topWords.find((topWord) => topWord.words === word);
    if (currentWord) {
      currentWord.count++;
    } else {
      topWords.push({
        words: word,
        count: 1,
        percent: 0,
        type: type || "unknown",
      });
    }
  });
  topWords.map((word) => {
    word.percent = Math.round((word.count / total) * 10000) / 100;
    return word;
  });

  topWords.sort((a, b) => (a.count < b.count ? 1 : -1));

  return topWords;
}
