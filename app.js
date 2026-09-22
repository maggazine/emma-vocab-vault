let words = [];
let filteredWords = [];
let currentIndex = 0;

const flashcard = document.getElementById('flashcard');
const wordEl = document.getElementById('card-word');
const posEl = document.getElementById('card-pos');
const categoryEl = document.getElementById('card-category');
const defEl = document.getElementById('card-definition');
const sentenceEl = document.getElementById('card-sentence');
const synEl = document.getElementById('card-synonyms');
const antEl = document.getElementById('card-antonyms');
const totalWordsEl = document.getElementById('total-words');
const categoryFilter = document.getElementById('category-filter');

// Load stored words or fetch default JSON
async function init() {
  const localData = localStorage.getItem('emma_vocab_words');
  if (localData) {
    words = JSON.parse(localData);
  } else {
    try {
      const res = await fetch('words.json');
      words = await res.json();
      localStorage.setItem('emma_vocab_words', JSON.stringify(words));
    } catch (e) {
      console.error('Error loading default words:', e);
    }
  }
  applyFilter();
}

function applyFilter() {
  const selected = categoryFilter.value;
  filteredWords = selected === 'all' 
    ? words 
    : words.filter(item => item.category === selected);
  
  currentIndex = 0;
  updateStats();
  renderCard();
}

function renderCard() {
  flashcard.classList.remove('flipped');
  if (filteredWords.length === 0) {
    wordEl.textContent = 'No words found';
    posEl.textContent = '';
    categoryEl.textContent = 'Empty';
    return;
  }

  const current = filteredWords[currentIndex];
  wordEl.textContent = current.word;
  posEl.textContent = current.partOfSpeech;
  categoryEl.textContent = current.category;
  defEl.textContent = current.definition;
  sentenceEl.textContent = `"${current.sentence}"`;
  synEl.textContent = current.synonyms.join(', ');
  antEl.textContent = current.antonyms.join(', ');
}

function updateStats() {
  totalWordsEl.textContent = words.length;
}

// Flip Card
flashcard.addEventListener('click', () => {
  flashcard.classList.toggle('flipped');
});

// Navigation
document.getElementById('next-btn').addEventListener('click', () => {
  if (filteredWords.length === 0) return;
  currentIndex = (currentIndex + 1) % filteredWords.length;
  renderCard();
});

document.getElementById('prev-btn').addEventListener('click', () => {
  if (filteredWords.length === 0) return;
  currentIndex = (currentIndex - 1 + filteredWords.length) % filteredWords.length;
  renderCard();
});

document.getElementById('shuffle-btn').addEventListener('click', () => {
  filteredWords.sort(() => Math.random() - 0.5);
  currentIndex = 0;
  renderCard();
});

categoryFilter.addEventListener('change', applyFilter);

// Add new word form
document.getElementById('add-word-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const newWordObj = {
    id: Date.now(),
    word: document.getElementById('new-word').value.trim(),
    category: document.getElementById('new-category').value,
    partOfSpeech: document.getElementById('new-pos').value.trim(),
    definition: document.getElementById('new-definition').value.trim(),
    sentence: document.getElementById('new-sentence').value.trim(),
    synonyms: document.getElementById('new-synonyms').value.split(',').map(s => s.trim()),
    antonyms: document.getElementById('new-antonyms').value.split(',').map(a => a.trim())
  };

  words.unshift(newWordObj);
  localStorage.setItem('emma_vocab_words', JSON.stringify(words));
  
  e.target.reset();
  categoryFilter.value = 'all';
  applyFilter();
  alert(`Added "${newWordObj.word}" to the Vault!`);
});

init();