//needed for scss
import { createRef } from 'react';
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
  description1: '',
  description2: '',
  description3: '',
  description4: '',
  description5: '',
  description6: '',
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
  const colors = ['Pink', 'Blue', 'Green', 'Tan', 'Grey', 'Yellow'];
  const dynamicInputs = document.getElementById('dynamicInputs');
  dynamicInputs.innerHTML = ''; // Clear previous inputs
  console.log('HELLO HELP');

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
    console.log(`DescriptionInput.id is ${descriptionInput.id}`);
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
      if (descriptionInput.value.trim() !== '') {
        descriptionInput.classList.add('valid');
        descriptionInput.classList.remove('invalid');
      } //
      else {
        descriptionInput.classList.add('invalid');
      }
      updateDescriptionState(j + 1, descriptionInput.value);
      console.log(
        'The widget state for description is:',
        widgetState[`description${j + 1}`],
      );
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
      wordInput.type = 'text';
      wordInput.classList.add('grid-input');
      wordInput.name = `Word${j + 1}-${i + 1}`;
      wordInput.id = `Word${j + 1}-${i + 1}`;
      wordInput.required = true;
      wordInput.placeholder = placeholders[j][i];
      wordInput.value = widgetState[`words${j + 1}`][i] || '';
      wordCell.appendChild(wordInput);
      const wordParent = wordInput.parentNode;
      if (!wordInput.value) {
        wordParent.classList.add('invalid');
      } //
      else {
        wordParent.classList.add('valid');
      }
      wordInput.addEventListener('input', () => {
        if (wordParent) {
          //trim so that if its only spaces it is not valid
          if (wordInput.value.trim() !== '') {
            wordParent.classList.add('valid');
            wordParent.classList.remove('invalid');
          } //
          else {
            wordParent.classList.add('invalid');
          }
        }
        updateWidgetState(j + 1, i + 1, wordInput.value);
      });

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

function updateDescriptionState(group, value) {
  savedWidgetState[`description${group}`] = value;
  console.log(
    `Updated widgetState.description${group}:`,
    savedWidgetState[`description${group}`],
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

function flashInvalidInputs() {
  // Flashing effect for description inputs
  const descriptionInputs = document.querySelectorAll('.dInput');
  descriptionInputs.forEach((input) => {
    if (input.value.trim() === '') {
      input.classList.add('flash-red');
      setTimeout(() => {
        input.classList.remove('flash-red');
      }, 1000);
    }
  });
  //flashing effect for title input
  const titleInput = document.getElementById('GameName');
  if (titleInput.value.trim() === '') {
    titleInput.classList.add('flash-red');
    setTimeout(() => {
      titleInput.classList.remove('flash-red');
    }, 1000);
  }

  // Flashing effect for word inputs' parent divs
  const wordInputs = document.querySelectorAll('.grid-input');
  wordInputs.forEach((input) => {
    if (input.value.trim() === '') {
      const parentDiv = input.closest('.previewItem');
      if (parentDiv) {
        parentDiv.classList.add('flash-red');
        setTimeout(() => {
          parentDiv.classList.remove('flash-red');
        }, 1000);
      }
    }
  });
}

Materia.CreatorCore.start({
  initNewWidget: (widget, baseUrl, mediaUrl) => {
    // setup for a new widget
    console.log(
      ` The widget is ${widget} and th base url is ${baseUrl} and the media url is ${mediaUrl}`,
    );
  },
  initExistingWidget: (widget, title, qset, qsetVersion, baseUrl, mediaUrl) => {
    // updatePreview();
    console.log(
      `In INIT EXISTING WIDGET method, The widget is ${widget} and th base url is ${baseUrl} and the media url is ${mediaUrl}`,
    );
    console.log(
      `AFTER INIT EXISTING WIDGET method, The title is ${title} and the qset.items is ${qset.data.items} and the qset version is ${qsetVersion}`,
    );
    console.log(
      'dimensionX is : ',
      qset.data.items[0].answers[0].text.split(',').length,
    );
    console.log(
      'dimensionY is :',
      (widgetState.dimensionY = qset.data.items.length),
    );
    //if widget exists, close the intro modal and update our state and create the dynamic inputs
    if (widget) {
      introModal.close();
      introModal.classList.add('hidden');

      widgetState.dimensionX =
        qset.data.items[0].answers[0].text.split(',').length;
      widgetState.dimensionY = qset.data.items.length;
      //for some reason the title is widget
      widgetState._title = widget;
      for (let i = 1; i <= widgetState.dimensionY; i++) {
        widgetState[`words${i}`] =
          qset.data.items[i - 1].answers[0].text.split(',');
        widgetState[`description${i}`] =
          qset.data.items[i - 1].questions[0].text;
        savedWidgetState[`words${i}`] = widgetState[`words${i}`];
        savedWidgetState[`description${i}`] = widgetState[`description${i}`];
      }
      console.log(
        `After everything the saved widget state is ${savedWidgetState}`,
      );
      createDynamicInputs();
      if (document.getElementById('GameName').value === '') {
        console.log('adding the game name to the input');
        GameName.value = widget;
      }
    }
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
      //check if words and description are empty
      // if (words === '' || description === '') better way to check i think
      if (document.getElementById('GameName').value === '') {
        console.log('empty game name');
        document.getElementById('GameName').classList.add('invalid');
      } //
      else {
        document.getElementById('GameName').classList.remove('invalid');
      }
      //checks for any invalid red inputs
      const invalidElements = document.querySelectorAll('.invalid');
      if (invalidElements.length > 0) {
        console.log('empty words or description');
        //show a toast module that says to complete all fields
        showToast('Please complete all fields', 'error');
        //TODO? fill the input fields with red
        flashInvalidInputs();
        return;
      }
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
    showToast('Game saved successfully', 'success');
    Materia.CreatorCore.save(widgetState._title, qset.qset);
  },
});
