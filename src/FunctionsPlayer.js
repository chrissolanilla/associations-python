// FunctionsPlayer.js
let selectedWords = [];
let currentQset;
let guessedGroups = new Set();
let dimensionX = 0;
let dimensionY = 0;
let buttonIDs = [];
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

export function addCurrentButtons(buttonId) {
  //add it to the list or array of buttons
  buttonIDs.push(buttonId);
}
export function updateButtonStyles(buttonId, isEnabled) {
  const button = document.getElementById(buttonId);
  if (isEnabled) {
    button.classList.remove('greyOutButton');
    button.classList.add('styled-button');
    button.setAttribute('tabindex', '0');
  } else {
    console.log('button is ', buttonId);
    button.classList.remove('styled-button');
    button.classList.add('greyOutButton');
    button.setAttribute('tabindex', '-1');
  }
}

export function updateSelectionStyles() {
  const wordsGrid = document.querySelector('.wordsPreview');

  wordsGrid.querySelectorAll('.previewItem').forEach((item) => {
    item.classList.remove(
      'selected-4',
      'selected-8',
      'selected-12',
      'selected-16',
      'selected-tan',
      'selected-grey',
    );
  });

  selectedWords.forEach((word, index) => {
    const checkbox = [
      ...document.querySelectorAll('.previewItem input[type="checkbox"]'),
    ].find((input) => input.nextElementSibling.textContent === word);
    const item = checkbox.parentNode;
    console.log('The index is ', index);
    if (index < dimensionX) item.classList.add('selected-4');
    // if (index < dimensionX) item.classList.add('singleSelectionBlue');
    else if (index < dimensionX * 2) item.classList.add('selected-8');
    else if (index < dimensionX * 3) item.classList.add('selected-12');
    else if (index < dimensionX * 4) item.classList.add('selected-16');
    else if (index < dimensionX * 5) {
      item.classList.add('selected-tan');
      console.log('the index is', index, 'and the tan index is', index % 5);
    } else item.classList.add('selected-grey');
  });

  const selectionCount = selectedWords.length;
  //call the function dimensinoX times for the button ids that are dynamically created.
  console.log('buttonIDs are ', buttonIDs);
  for (let i = 0; i < dimensionY; i++) {
    updateButtonStyles(buttonIDs[i], selectionCount === dimensionX * (i + 1));
  }
  toggleCheckbox();
}

export function createAnswerDiv(description, group, className) {
  console.log('CREATING ANSWER DIV', description, group, className);
  const answerDiv = document.createElement('div');
  answerDiv.classList.add('AnswerDivBackground', className);

  const strongDiv = document.createElement('div');
  const strongElement = document.createElement('strong');
  strongElement.textContent = description;
  strongDiv.appendChild(strongElement);

  const answerDivWords = document.createElement('div');
  answerDivWords.textContent = group.join(', ');

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
  console.log('DIMENSION X AND Y ARE', dimensionX, dimensionY);
  const wordIndex = selectedWords.indexOf(word);
  if (wordIndex > -1) {
    // Deselect word
    selectedWords.splice(wordIndex, 1);
    //don't let them select more than X amonut of words sadly
  } else if (selectedWords.length < dimensionX) {
    // Select word
    selectedWords.push(word);
  }
  console.log('Selected Words:', selectedWords);
  updateSelectionStyles();
  toggleCheckbox();
}

function toggleCheckbox() {
  const checkboxes = document.querySelectorAll(
    '.previewItem input[type="checkbox"]',
  );
  checkboxes.forEach((checkbox) => {
    if (!checkbox.checked && selectedWords.length >= dimensionX) {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });
}

export function showToast(message, type) {
  const toastContainer = document.getElementById('toastContainer');
  setTimeout(() => {}, 500);
  toastContainer.classList.add('show');
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.className = 'toast';
  if (type === 'success') {
    toast.style.backgroundColor = 'green';
  } else if (type === 'error') {
    toast.style.backgroundColor = 'red';
  }
  toast.style.display = 'none';
  console.log(toast.offsetHeight); // This forces a reflow and allows error messages to be read
  toast.style.display = 'block';
  //after 5 seconds get rid of the toast
  setTimeout(() => {
    toastContainer.classList.remove('show');
    toast.classList.add('hide');
  }, 5000);
}
