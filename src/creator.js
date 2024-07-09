//needed for scss
import { showToast } from './FunctionsPlayer';
import './creator.scss';

let widgetState = {
  //right now hard code 4 groups of words and descriptions, maybe have it variable

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
  dimensionX: '4',
  dimensionY: '4',
  _title: '',
  _qset: {},
  showanswers: false,
};

let savedWidgetState = {
  words1: [],
  words2: [],
  words3: [],
  words4: [],
  words5: [],
  words6: [],
};

const placeholders = [
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
const formElement = document.getElementById('fromDisable');
formElement.addEventListener('submit', (event) => {
  event.preventDefault();
});
const chooseButton = document.getElementById('chooseButton');
const introModal = document.getElementById('introModal');
introModal.showModal();
// const closeIntroButton = document.getElementById('closeIntro');
const modal = document.querySelector('[data-modal]');
modal.classList.add('hidden');
//have a some inputs craeted already on page load
createDynamicInputs();
function updateGameName() {
  const gamename2 = document.getElementById('GameName2').value;
  const gamename1 = document.getElementById('GameName').value;
  if (gamename1 === '') {
    widgetState._title = gamename2;
  } else {
    widgetState._title = gamename1;
  }
  console.log('Game name updated:', widgetState._title);
}

function updatePreview() {
  const allWords = [];
  for (let i = 1; i <= widgetState.dimensionY; i++) {
    console.log('iteration ', i);
    const words = document
      .getElementById(`Words${i}`)
      .value.split(',')
      .map((word) => word.trim());
    allWords.push(...words);
    console.log('SUCSS');
  }

  const previewItems = document.querySelectorAll('.previewItem');
  previewItems.forEach((item, index) => {
    item.textContent = allWords[index] || '';
  });
}

// Add event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.CreatorAnswers input').forEach((input) => {
    input.addEventListener('input', updatePreview);
  });

  //set if the checkbox is checked or not
  const ShowAnswersCheckbox = document.getElementById('ShowAnswersCheckbox');
  ShowAnswersCheckbox.addEventListener('input', (event) => {
    if (ShowAnswersCheckbox.checked) {
      widgetState.showanswers = true;
    } else {
      widgetState.showanswers = false;
    }
  });
  document.querySelectorAll('.GameNameInput input').forEach((input) => {
    console.log('UPDATING GAME NAME');
    input.addEventListener('input', updateGameName);
  });
  const gameName2Input = document.getElementById('GameName2');
  const closeIntroButton = document.getElementById('closeIntro');
  const arrowBoxLeft = document.getElementById('arrow_box_left');

  // Function to check if the input is valid
  const checkInputValidity = () => {
    if (gameName2Input.value.trim() !== '') {
      closeIntroButton.disabled = false;
      arrowBoxLeft.style.display = 'none'; // hide the arrow
    } else {
      closeIntroButton.disabled = true;
      arrowBoxLeft.style.display = 'block'; // show the arrow
    }
  };

  // initial check on page load
  checkInputValidity();

  // Add input event listener to gameName2Input
  gameName2Input.addEventListener('input', checkInputValidity);
  // Attach event listener to GameName input
  document.getElementById('GameName').addEventListener('input', updateGameName);
  //this one does not show up in the console.log when i enter in the second character, but when i press the third character it shows the one i pressed before.
  document.getElementById('GameName2').addEventListener('input', (event) => {
    const value = event.target.value;
    document.getElementById('GameName').value = value;
    updateGameName();
  });

  closeIntroButton.addEventListener('click', () => {
    introModal.close();
    introModal.classList.add('hidden');
    modal.showModal();
    modal.classList.remove('hidden');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    modal.close();
    modal.classList.add('hidden');
    if (!introModal.classList.contains('hidden')) {
      event.preventDefault();
      return;
    }
  }
});

// trying out the cool grid mouse selector
const DimensionContainer = document.getElementById('DimensionContainer');
const DimensionStatusElement = document.getElementById('DimensionStatus');
const DimensionStatusElement2 = document.getElementById('DimensionStatus2');

// create the grid cells
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 6; j++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.classList.add('cellbg');
    cell.dataset.row = i + 1;
    cell.dataset.col = j + 1;
    DimensionContainer.appendChild(cell);
  }
}

// get the row and column of the mouse over
DimensionContainer.addEventListener('mouseover', (event) => {
  if (event.target.classList.contains('cell')) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    highlightGrid(row, col);
    DimensionStatusElement.textContent = `${col} x ${row}`;
    DimensionStatusElement2.textContent = `${col} x ${row}`;
    console.log('attempting to highlight create preview grid');
    widgetState.dimensionX = event.target.dataset.col;
    widgetState.dimensionY = event.target.dataset.row;
    // createPreviewGrid();
  }
});

DimensionContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('cell')) {
    widgetState.dimensionX = event.target.dataset.col;
    widgetState.dimensionY = event.target.dataset.row;
    //if the grid is not valid tell them
    if (widgetState.dimensionX <= 1 || widgetState.dimensionY <= 1) {
      showToast('The grid must be at least 2x2', 'error');
    } else {
      // dimensionContainer.classList.add('hidden');
      modal.close();
      modal.classList.add('hidden');
      createDynamicInputs();
      // createPreviewGrid();
    }
  }
});

chooseButton.addEventListener('click', (event) => {
  modal.showModal();
  // DimensionContainer.classList.remove('hidden');
  modal.classList.remove('hidden');
});
function highlightGrid(rows, cols) {
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
function createDynamicInputs() {
  const colors = ['Blue', 'Green', 'Yellow', 'Pink', 'Tan', 'Grey'];
  const dynamicInputs = document.getElementById('dynamicInputs');
  dynamicInputs.innerHTML = ''; // Clear previous inputs

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
    descriptionInput.placeholder = `Enter a description for a group of words, e.g., ${placeholders[j][0]}`;
    descriptionInput.value = widgetState[`description${j + 1}`] || '';
    console.log(
      'The widget state for description is:',
      widgetState[`description${j + 1}`],
    );
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
      wordInput.type = 'text';
      wordInput.classList.add('grid-input');
      wordInput.name = `Word${j + 1}-${i + 1}`;
      wordInput.id = `Word${j + 1}-${i + 1}`;
      wordInput.placeholder = placeholders[j][i];
      wordInput.value = widgetState[`words${j + 1}`][i] || '';
      wordInput.addEventListener('input', () => {
        updateWidgetState(j + 1, i + 1, wordInput.value);
      });
      wordCell.appendChild(wordInput);

      wordsGrid.appendChild(wordCell);
    }

    creatorAnswersDiv.appendChild(wordsGrid);
    inputContainer.appendChild(creatorAnswersDiv);
    dynamicInputs.appendChild(inputContainer);
  }
}

function updateWidgetState(group, position, value) {
  widgetState[`words${group}`][position - 1] = value;
  console.log(
    `Updated widgetState.words${group}:`,
    widgetState[`words${group}`],
  );
}

function trunkcadeWords(widgetState, savedWidgetState) {
  const trunkcateArray = (words, x) => words.slice(0, x);
  for (let i = 1; i <= 6; i++) {
    savedWidgetState[`words${i}`] = trunkcateArray(
      widgetState[`words${i}`],
      parseInt(widgetState.dimensionX),
    );
  }
}

Materia.CreatorCore.start({
  initNewWidget: (widget, baseUrl, mediaUrl) => {
    // setup for a new widget
  },
  initExistingWidget: (widget, title, qset, qsetVersion, baseUrl, mediaUrl) => {
    // updatePreview();
  },
  onSaveClicked: (mode = 'save') => {
    trunkcadeWords(widgetState, savedWidgetState);
    const items = [];
    //this will succesffully trunkcade groups but not extra words.
    for (let i = 1; i <= widgetState.dimensionY; i++) {
      console.log('getting words' + i);
      // const words = widgetState[`words${i}`].join(',');
      const words = savedWidgetState[`words${i}`].join(',');
      console.log('WORDS IS', words);
      console.log('getting description' + i);
      const description = document
        .getElementById(`Description${i}`)
        .value.trim();
      console.log(description);
      items.push({
        materiaType: 'question',
        type: 'connections',
        id: null,
        questions: [{ text: description }],
        answers: [{ text: words, value: 25 }],
      });
      console.log('items are', items);
    }

    const qset = {
      qset: {
        name: widgetState._title,
        version: 1,
        showAnswers: widgetState.showanswers,
        data: {
          items,
        },
      },
    };
    console.log(qset);
    console.log('THE TITLE OF THE WIDGET IS ', widgetState._title);
    Materia.CreatorCore.save(widgetState._title, qset.qset);
  },
});
