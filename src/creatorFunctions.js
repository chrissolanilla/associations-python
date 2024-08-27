export let widgetState = {
  words1: [],
  words2: [],
  words3: [],
  words4: [],
  words5: [],
  words6: [],
  description1: '',
  description2: '',
  description3: '',
  description4: '',
  description5: '',
  description6: '',
  dimensionX: 4,
  dimensionY: 4,
  _title: '',
  _qset: {},
  showanswers: false,
  lives: 1,
};

export let savedWidgetState = {
  words1: [],
  words2: [],
  words3: [],
  words4: [],
  words5: [],
  words6: [],
  description1: '',
  description2: '',
  description3: '',
  description4: '',
  description5: '',
  description6: '',
};

export let wordSet = new Set();
export let descriptionSet = new Set();

export const placeholders = [
  [
    'Restaurants',
    "McDonald's",
    'Taco Bell',
    'Burger King',
    "Wendy's",
    'Pizza Hut',
    'Dairy Queen',
  ],
  ['Names', 'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'],
  ['Foods', 'Pizza', 'Burger', 'Salad', 'Steak', 'Pasta', 'Fish'],
  ['Fruits', 'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig'],
  ['Animals', 'Cat', 'Dog', 'Elephant', 'Frog', 'Giraffe', 'Horse'],
  ['Colors', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo'],
];

export function updateGameName() {
  const gamename1 = document.getElementById('GameName').value;
  const gamename2 = document.getElementById('GameName2').value;
  if (gamename1 === '') {
    console.log('inside the if');
    widgetState._title = gamename2;
  } else {
    console.log('inside the else');
    widgetState._title = gamename1;
  }
  console.log('Game name updated:', widgetState._title);
}

export function updatePreview() {
  const allWords = [];
  for (let i = 1; i <= widgetState.dimensionY; i++) {
    const words = widgetState[`words${i}`];
    allWords.push(...words);
    console.log('SUCSS');
  }

  const previewItems = document.querySelectorAll('.previewItem');
  previewItems.forEach((item, index) => {
    item.textContent = allWords[index] || '';
  });
}

export function createDynamicInputs() {
  const colors = ['Pink', 'Blue', 'Green', 'Tan', 'Grey', 'Yellow'];

  const dynamicInputs = document.getElementById('dynamicInputs');
  if (!dynamicInputs) return;
  dynamicInputs.innerHTML = ''; // Clear previous inputs
  updateSets();

  for (let j = 0; j < widgetState.dimensionY; j++) {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('CreatorKVP', colors[j]);

    const creatorAnswersDiv = document.createElement('div');
    creatorAnswersDiv.classList.add('CreatorAnswers');

    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = `Group ${j + 1}`;
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.name = `Description${j + 1}`;
    descriptionInput.id = `Description${j + 1}`;
    descriptionInput.required = true;
    descriptionInput.placeholder = `Enter a description for a group of words, e.g., ${placeholders[j][0]}`;
    descriptionInput.value = savedWidgetState[`description${j + 1}`] || '';
    if (descriptionInput.value.trim() !== '') {
      descriptionInput.classList.add('valid');
    } //
    else {
      descriptionInput.classList.add('invalid');
    }
    descriptionInput.classList.add('dInput');
    descriptionInput.addEventListener('input', () => {
      updateDescriptionState(j + 1, descriptionInput.value);
      console.log(
        'The widget state for description is:',
        widgetState[`description${j + 1}`],
      );

      if (
        descriptionInput.value.trim() !== '' &&
        !descriptionSet.has(descriptionInput.value.trim())
      ) {
        descriptionInput.classList.add('valid');
        descriptionInput.classList.remove('invalid');
      } //
      else {
        descriptionInput.classList.add('invalid');
      }
      //update the hash map
      updateSets();
    });
    creatorAnswersDiv.appendChild(descriptionLabel);
    creatorAnswersDiv.appendChild(descriptionInput);

    const wordsGrid = document.createElement('div');
    wordsGrid.classList.add('wordsGrid');
    wordsGrid.style.gridTemplateColumns = `repeat(${widgetState.dimensionX}, 1fr)`;

    for (let i = 0; i < widgetState.dimensionX; i++) {
      const wordCell = document.createElement('div');
      wordCell.classList.add('previewItem');
      wordCell.id = `Word${j + 1}-${i + 1}`;

      const wordInput = document.createElement('input');
      const duplicateWarning = document.createElement('p');
      duplicateWarning.textContent = 'Please do not use duplicate words';
      duplicateWarning.classList.add('hidden');
      duplicateWarning.classList.add('commaWarning');
      wordInput.type = 'text';
      wordInput.classList.add('grid-input');
      wordInput.name = `Word${j + 1}-${i + 1}`;
      wordInput.id = `Word${j + 1}-${i + 1}`;
      wordInput.required = true;
      wordInput.placeholder = placeholders[j][i];
      wordInput.value = widgetState[`words${j + 1}`][i] || '';
      wordCell.appendChild(wordInput);
      wordCell.appendChild(duplicateWarning);
      const wordParent = wordInput.parentNode;
      if (!wordInput.value) {
        wordParent.classList.add('invalid');
      } //
      else {
        wordParent.classList.add('valid');
      }

      wordInput.addEventListener('input', () => {
        if (wordParent) {
          const trimmedValue = wordInput.value.trim();

          //check if our word is a duplicate but not on ourselve
          const isDuplicate = [...wordSet].some(
            (word) =>
              word === trimmedValue && word !== widgetState[`words${j + 1}`][i],
          );

          if (trimmedValue !== '' && !isDuplicate) {
            wordParent.classList.add('valid');
            wordParent.classList.remove('invalid');
            duplicateWarning.classList.add('hidden');
          } else {
            wordParent.classList.add('invalid');
            duplicateWarning.classList.remove('hidden');
          }
          if (!isDuplicate) {
            duplicateWarning.classList.add('hidden');
          }
        }

        const finalValue = wordInput.value.trim();

        if (!wordSet.has(finalValue)) {
          wordSet.add(finalValue);
          wordInput.value = finalValue;
          updateWidgetState(j + 1, i + 1, wordInput.value.trim());
        }
        updateSets();
      });

      wordsGrid.appendChild(wordCell);
    }

    creatorAnswersDiv.appendChild(wordsGrid);
    inputContainer.appendChild(creatorAnswersDiv);
    dynamicInputs.appendChild(inputContainer);
  }
}

function updateSets() {
  wordSet.clear();
  descriptionSet.clear();

  for (let i = 1; i <= 6; i++) {
    widgetState[`words${i}`].forEach((word) => wordSet.add(word.trim()));
    descriptionSet.add(savedWidgetState[`description${i}`].trim());
  }
  console.log('WORDSET', wordSet);
  console.log('DESCRIPTIONSET', descriptionSet);
}

function updateWidgetState(group, position, value) {
  widgetState[`words${group}`][position - 1] = value.trim();
  console.log(
    `Updated widgetState.words${group}:`,
    widgetState[`words${group}`],
  );
  updateSets();
}

function updateDescriptionState(group, value) {
  savedWidgetState[`description${group}`] = value;
  console.log(
    `Updated widgetState.description${group}:`,
    savedWidgetState[`description${group}`],
  );
}

export function trunkcadeWords(widgetState, savedWidgetState) {
  const trunkcateArray = (words, x) => words.slice(0, x);
  for (let i = 1; i <= 6; i++) {
    savedWidgetState[`words${i}`] = trunkcateArray(
      widgetState[`words${i}`],
      parseInt(widgetState.dimensionX),
    );
  }
}

export function flashInvalidInputs() {
  // Flashing effect for any element with an invalid class
  const descriptionInputs = document.querySelectorAll('.invalid');
  descriptionInputs.forEach((input) => {
    input.classList.add('flash-red');
    setTimeout(() => {
      input.classList.remove('flash-red');
    }, 1000);
  });
}
