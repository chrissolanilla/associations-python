let selectedWords = [];
let currentQset;
let guessedGroups = new Set();
let dimensionX = 0;

export function setCurrentQset(qset) {
  currentQset = qset;
  dimensionX = qset.items[0].answers[0].text.split(",").length;
}

export function getCurrentQset() {
  return currentQset;
}

export function setSelectedWords(words) {
  selectedWords = words;
}

export function getSelectedWords() {
  return selectedWords;
}

export function setGuessedGroups(groups) {
  guessedGroups = groups;
}

export function getGuessedGroups() {
  return guessedGroups;
}

export function resetSelectedWords() {
  selectedWords = [];
}

export function resetGuessedGroups() {
  guessedGroups = new Set();
}

export function updateButtonStyles(buttonId, isEnabled) {
  const button = document.getElementById(buttonId);
  if (isEnabled) {
    button.classList.remove("greyOutButton");
    button.classList.add("styled-button");
  } else {
    button.classList.remove("styled-button");
    button.classList.add("greyOutButton");
  }
}

export function updateSelectionStyles() {
  const wordsGrid = document.querySelector(".wordsPreview");

  wordsGrid.querySelectorAll(".previewItem").forEach((item) => {
    for (let i = 1; i <= 16; i++) {
      item.classList.remove(`selected-${i}`);
    }
  });

  selectedWords.forEach((word, index) => {
    const checkbox = [
      ...document.querySelectorAll('.previewItem input[type="checkbox"]'),
    ].find((input) => input.nextElementSibling.textContent === word);
    const item = checkbox.parentNode;
    item.classList.add(`selected-${index + 1}`);
  });

  const selectionCount = selectedWords.length;
  for (let i = 1; i <= 16; i++) {
    updateButtonStyles(`check${i}`, selectionCount === i);
  }
}

export function createAnswerDiv(description, group, className) {
  const answerDiv = document.createElement("div");
  answerDiv.classList.add("AnswerDivBackground", className);

  const strongDiv = document.createElement("div");
  const strongElement = document.createElement("strong");
  strongElement.textContent = description;
  strongDiv.appendChild(strongElement);

  const answerDivWords = document.createElement("div");
  answerDivWords.textContent = group.join(", ");

  answerDiv.appendChild(strongDiv);
  answerDiv.appendChild(answerDivWords);

  return answerDiv;
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function selectWord(word, wordElement, checkbox) {
  const wordIndex = selectedWords.indexOf(word);
  if (wordIndex > -1) {
    // Deselect word
    selectedWords.splice(wordIndex, 1);
  } else if (selectedWords.length < 16) {
    // Select word
    selectedWords.push(word);
  }
  console.log("Selected Words:", selectedWords);
  updateSelectionStyles();
}
