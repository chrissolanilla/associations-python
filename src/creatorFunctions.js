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

export function highlightGrid(rows, cols) {
  const cells = DimensionContainer.querySelectorAll('.cell');
  cells.forEach((cell) => {
    const cellRow = cell.dataset.row;
    const cellCol = cell.dataset.col;
    if (cellRow <= rows && cellCol <= cols) {
      cell.classList.remove('cellbg');
      cell.classList.add('hovered');
    } else {
      cell.classList.remove('hovered');
      cell.classList.add('cellbg');
    }
  });
}

// Export this function from your module
export function addKeydownEventListener(
  modal,
  widgetState,
  finalCol,
  finalRow,
  highlightGrid,
  createDynamicInputs,
  showToast,
) {
  const status1 = document.getElementById('DimensionStatus');
  const status2 = document.getElementById('DimensionStatus2');

  document.addEventListener('keydown', (event) => {
    if (modal.hasAttribute('open')) {
      // Ensure widgetState values are numbers
      widgetState.dimensionX = +widgetState.dimensionX;
      widgetState.dimensionY = +widgetState.dimensionY;

      if (event.key === 'ArrowLeft') {
        console.log('left');
        if (widgetState.dimensionY > 1) {
          const row = widgetState.dimensionY - 1;
          finalCol = row;
          widgetState.dimensionY = Math.max(1, row);
          console.log(
            `The row is ${row} and the widget state is ${widgetState.dimensionY}`,
          );

          // Highlight the grid
          highlightGrid(widgetState.dimensionX, row);
        }
      } else if (event.key === 'ArrowRight') {
        console.log('right');
        console.log(
          `widgetState x and y is ${widgetState.dimensionX} ${widgetState.dimensionY}`,
        );
        if (widgetState.dimensionY < 6) {
          const row = widgetState.dimensionY + 1;
          finalCol = row;
          widgetState.dimensionY = Math.min(6, row);
          console.log(
            `The row is ${row} and the widget state is ${widgetState.dimensionY}`,
          );

          // Highlight the grid
          highlightGrid(widgetState.dimensionX, row);
        }
      } else if (event.key == 'ArrowUp') {
        if (widgetState.dimensionX > 1) {
          const col = widgetState.dimensionX - 1;
          finalRow = col;
          widgetState.dimensionX = Math.max(1, col);

          // Highlight the grid
          highlightGrid(col, widgetState.dimensionY);
        }
      } else if (event.key === 'ArrowDown') {
        if (widgetState.dimensionX < 6) {
          const col = widgetState.dimensionX + 1;
          finalRow = col;
          widgetState.dimensionX = Math.min(6, col);
          console.log(`The finalRow is ${finalRow}`);

          // Highlight the grid
          highlightGrid(col, widgetState.dimensionY);
        }
      } else if (event.key === 'Enter') {
        if (widgetState.dimensionX <= 1 || widgetState.dimensionY <= 1) {
          showToast('The grid must be at least 2x2', 'error');
        } else {
          event.preventDefault();
          console.log('enter pressed');
          modal.close();
          modal.classList.add('hidden');
          // Perform the swap for dimensionX and dimensionY
          widgetState.dimensionX =
            widgetState.dimensionX + widgetState.dimensionY;
          widgetState.dimensionY =
            widgetState.dimensionX - widgetState.dimensionY;
          widgetState.dimensionX =
            widgetState.dimensionX - widgetState.dimensionY;

          if (widgetState.dimensionX <= 6 && widgetState.dimensionY <= 6) {
            createDynamicInputs();
          }
        }
      }
    }

    // Update status elements
    status1.textContent = `${finalCol} x ${finalRow}`;
    status2.textContent = `${finalCol} x ${finalRow}`;
  });
}
