import { ReadabilityMetrics } from '../types/readability';
import { daleChallWordList } from './daleChallWords';

export function calculateReadabilityMetrics(text: string): ReadabilityMetrics {
  // Clean the text - remove excess whitespace and normalize
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Count sentences, words, characters
  const sentenceCount = countSentences(cleanText);
  const words = getWords(cleanText);
  const wordCount = words.length;
  const characterCount = cleanText.length;
  
  // Calculate syllables
  const syllableCounts = words.map(countSyllables);
  const syllableCount = syllableCounts.reduce((sum, count) => sum + count, 0);
  
  // Calculate complex words (3+ syllables, excluding proper nouns and compound words)
  const complexWords = words.filter(word => {
    const syllables = countSyllables(word);
    return syllables >= 3 && !isProperNoun(word);
  });
  const complexWordCount = complexWords.length;
  
  // Calculate percentage of complex words
  const complexWordPercentage = (complexWordCount / wordCount) * 100;
  
  // Average words per sentence
  const avgWordsPerSentence = wordCount / sentenceCount;
  
  // Average syllables per word
  const avgSyllablesPerWord = syllableCount / wordCount;
  
  // Calculate difficult words (not in Dale-Chall list)
  const difficultWords = countDifficultWords(words);
  const difficultWordPercentage = (difficultWords / wordCount) * 100;
  
  // Calculate readability metrics
  const gunningFog = 0.4 * (avgWordsPerSentence + complexWordPercentage);
  
  const fleschReadingEase = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  const fleschKincaidGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
  
  // SMOG formula
  const smogIndex = 1.043 * Math.sqrt(complexWordCount * (30 / sentenceCount)) + 3.1291;
  
  // Coleman-Liau
  const l = (characterCount / wordCount) * 100; // letters per 100 words
  const s = (sentenceCount / wordCount) * 100; // sentences per 100 words
  const colemanLiauIndex = 0.0588 * l - 0.296 * s - 15.8;
  
  // Automated Readability Index
  const automatedReadabilityIndex = 4.71 * (characterCount / wordCount) + 0.5 * avgWordsPerSentence - 21.43;
  
  // Dale-Chall
  let daleChallReadabilityScore = 0.1579 * difficultWordPercentage + 0.0496 * avgWordsPerSentence;
  if (difficultWordPercentage > 5) {
    // Add adjustment constant if percentage of difficult words is above 5%
    daleChallReadabilityScore += 3.6365;
  }
  
  // Linsear Write Formula
  const linsearWriteFormula = calculateLinsearWriteFormula(words, sentenceCount);
  
  return {
    gunningFog: Math.max(0, gunningFog),
    fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)),
    fleschKincaidGrade: Math.max(0, fleschKincaidGrade),
    smogIndex: Math.max(0, smogIndex),
    colemanLiauIndex: Math.max(0, colemanLiauIndex),
    automatedReadabilityIndex: Math.max(0, automatedReadabilityIndex),
    daleChallReadabilityScore: Math.max(0, daleChallReadabilityScore),
    difficultWords,
    linsearWriteFormula: Math.max(0, linsearWriteFormula),
    
    wordCount,
    sentenceCount,
    syllableCount,
    characterCount
  };
}

// Helper functions

function getWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s']|_/g, ' ')  // Keep apostrophes, replace other punctuation with space
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim()
    .split(' ')
    .filter(word => word.length > 0);
}

function countSentences(text: string): number {
  // Match for sentence endings: periods, exclamation marks, question marks
  // But avoid counting periods in abbreviations, numbers, etc.
  const sentenceEndings = text.match(/[.!?]+(?=\s+[A-Z]|$)/g) || [];
  return Math.max(1, sentenceEndings.length);
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  
  // Special cases
  if (word.length <= 3) return 1;
  
  // Count vowel groups
  const vowels = 'aeiouy';
  let count = 0;
  let prevIsVowel = false;
  
  // Count vowel groups
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }
  
  // Adjust for endings
  if (word.endsWith('e') && count > 1) {
    count--;
  }
  
  // Ensure at least one syllable
  return Math.max(1, count);
}

function isProperNoun(word: string): boolean {
  // A basic heuristic: first letter is uppercase
  return word.length > 0 && /[A-Z]/.test(word[0]);
}

function countDifficultWords(words: string[]): number {
  // Count words not in Dale-Chall list
  return words.filter(word => !daleChallWordList.includes(word.toLowerCase())).length;
}

function calculateLinsearWriteFormula(words: string[], sentenceCount: number): number {
  // Sample the first 100 words (or all if less than 100)
  const sampleWords = words.slice(0, 100);
  
  // Count easy words (1-2 syllables) and difficult words (3+ syllables)
  let easyWordCount = 0;
  let difficultWordCount = 0;
  
  for (const word of sampleWords) {
    const syllables = countSyllables(word);
    if (syllables <= 2) {
      easyWordCount++;
    } else {
      difficultWordCount++;
    }
  }
  
  // Calculate the raw score
  const rawScore = (easyWordCount * 1 + difficultWordCount * 3) / (sampleWords.length / sentenceCount);
  
  // Apply the formula
  let grade;
  if (rawScore > 10) {
    grade = rawScore / 2;
  } else {
    grade = (rawScore - 2) / 2;
  }
  
  return Math.max(0, grade);
}