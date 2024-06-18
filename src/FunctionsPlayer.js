// FunctionsPlayer.js
let selectedWords = [];
let currentQset;
let guessedGroups = new Set();
let dimensionX = 0;
let dimensionY = 0;

export function setCurrentQset(qset) {
  currentQset = qset;
}

export function getCurrentQset() {
  return currentQset;
}

export function setDimensions(x, y) {
  dimensionX = x;
  dimensionY = y;
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
    button.setAttribute("tabindex", "0");
  } else {
    button.classList.remove("styled-button");
    button.classList.add("greyOutButton");
    button.setAttribute("tabindex", "-1");
  }
}

export function updateSelectionStyles() {
  const wordsGrid = document.querySelector(".wordsPreview");

  wordsGrid.querySelectorAll(".previewItem").forEach((item) => {
    item.classList.remove(
      "selected-4",
      "selected-8",
      "selected-12",
      "selected-16",
      "selected-tan",
      "selected-grey",
    );
  });

  selectedWords.forEach((word, index) => {
    const checkbox = [
      ...document.querySelectorAll('.previewItem input[type="checkbox"]'),
    ].find((input) => input.nextElementSibling.textContent === word);
    const item = checkbox.parentNode;
    console.log("The index is ", index);
    if (index < dimensionX) item.classList.add("selected-4");
    else if (index < dimensionX * 2) item.classList.add("selected-8");
    else if (index < dimensionX * 3) item.classList.add("selected-12");
    else if (index < dimensionX * 4) item.classList.add("selected-16");
    else if (index < dimensionX * 5) {
      item.classList.add("selected-tan");
      console.log("the index is", index, "and the tan index is", index % 5);
    } else item.classList.add("selected-grey");
  });

  const selectionCount = selectedWords.length;
  updateButtonStyles("check4", selectionCount === dimensionX);
  updateButtonStyles("check8", selectionCount === dimensionX * 2);
  updateButtonStyles("check12", selectionCount === dimensionX * 3);
  updateButtonStyles("check16", selectionCount === dimensionX * 4);
}

export function createAnswerDiv(description, group, className) {
  console.log("CREATING ANSWER DIV", description, group, className);
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
  console.log("DIMENSION X AND Y ARE", dimensionX, dimensionY);
  const wordIndex = selectedWords.indexOf(word);
  if (wordIndex > -1) {
    // Deselect word
    selectedWords.splice(wordIndex, 1);
  } else if (selectedWords.length < dimensionX * dimensionY) {
    // Select word
    selectedWords.push(word);
  }
  console.log("Selected Words:", selectedWords);
  updateSelectionStyles();
}
