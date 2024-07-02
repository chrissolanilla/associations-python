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
const closeIntroButton = document.getElementById('closeIntro');
const modal = document.querySelector('[data-modal]');
modal.classList.add('hidden');
closeIntroButton.addEventListener('click', () => {
  introModal.close();
  introModal.classList.add('hidden');
  modal.showModal();
  modal.classList.remove('hidden');
});
// modal.showModal();
//do it on page load first time;
createDynamicInputs();
function updateGameName() {
  widgetState._title = document.getElementById('GameName').value;
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

  document.querySelectorAll('.GameNameInput input').forEach((input) => {
    console.log('UPDATING GAME NAME');
    input.addEventListener('input', updateGameName);
  });

  // Attach event listener to GameName input
  document.getElementById('GameName').addEventListener('input', updateGameName);
  //make it so that the input in the intro modal refelcts it in the header too
  document.getElementById('GameName2').addEventListener('input', (event) => {
    document.getElementById('GameName').value = event.target.value;
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    modal.close();
    modal.classList.add('hidden');
  }
});

// Trying out the cool grid mouse selector
const DimensionContainer = document.getElementById('DimensionContainer');
const DimensionStatusElement = document.getElementById('DimensionStatus');
const DimensionStatusElement2 = document.getElementById('DimensionStatus2');

// Create the grid cells
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

// Get the row and column of the mouse over
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
      // DimensionContainer.classList.add('hidden');
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
    // descriptionInput.placeholder = 'Enter a description here';
    descriptionInput.placeholder = `Enter a description for a group of words, E.g. ,  ${placeholders[j][0]}`;
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
      // wordInput.placeholder = 'Enter a word here';
      wordInput.placeholder = placeholders[j][i];
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

// Save widget data
Materia.CreatorCore.start({
  initNewWidget: (widget, baseUrl, mediaUrl) => {
    // Setup for a new widget
  },
  initExistingWidget: (widget, title, qset, qsetVersion, baseUrl, mediaUrl) => {
    updatePreview();
  },
  onSaveClicked: (mode = 'save') => {
    const items = [];
    for (let i = 1; i <= widgetState.dimensionY; i++) {
      console.log('getting words' + i);
      const words = widgetState[`words${i}`].join(',');
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
        data: {
          items,
        },
      },
    };
    console.log(qset);
    console.log('THE TITLE OF THE WIDGET IS ', widgetState._title);
    Materia.CreatorCore.save(widgetState._title, qset.qset.data);
  },
});
