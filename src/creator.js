//needed for scss
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
  dimensionX: '0',
  dimensionY: '0',
  _title: '',
  _qset: {},
};
function updateGameName() {
  widgetState._title = document.getElementById('GameName').value;
}
function updatePreview() {
  const allWords = [];
  if (widgetState.dimensionY > widgetState.dimensionX) {
    for (let i = 1; i <= widgetState.dimensionY; i++) {
      console.log('iteration ', i);
      const words = document
        .getElementById(`Words${i}`)
        .value.split(',')
        .map((word) => word.trim());
      allWords.push(...words);
      console.log('SUCSS');
    }
  } else
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
//event listeners for the description and words input and the title too
document.querySelectorAll('.CreatorAnswers input').forEach((input) => {
  input.addEventListener('input', updatePreview);
});
document.querySelectorAll('.GameNameInput input').forEach((input) => {
  input.addEventListener('input', updateGameName);
});
//tring out the cool grid mouse selector
const DimensionContainer = document.getElementById('DimensionContainer');
const DimensionStatusElement = document.getElementById('DimensionStatus');
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
//get the row and column of the mouse over
DimensionContainer.addEventListener('mouseover', (event) => {
  if (event.target.classList.contains('cell')) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    highlightGrid(row, col);
    DimensionStatusElement.textContent = `${col} x ${row}`;
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
    DimensionContainer.classList.add('hidden');
    createDynamicInputs();
    // createPreviewGrid();
  }
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
  dynamicInputs.innerHTML = ''; //this makes it so that we can do the function on highlight
  let i = 1;
  for (let j = 0; j < widgetState.dimensionY; j++) {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('CreatorKVP', colors[j]);
    const creatorAnswersDiv = document.createElement('div');
    creatorAnswersDiv.classList.add('CreatorAnswers');
    const answerLabel = document.createElement('label');
    answerLabel.textContent = `Please enter ${widgetState.dimensionX} words (Comma-separated)`;
    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.name = `Words${i * widgetState.dimensionX + j + 1}`;
    answerInput.id = `Words${j + 1}`;
    console.log(answerInput.id);
    answerInput.oninput = updatePreview;

    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = `Please enter a Description that describes the words above`;
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.name = `Description${j + 1}`;
    descriptionInput.id = `Description${j + 1}`;
    // descriptionInput.oninput = updateDescription;
    creatorAnswersDiv.appendChild(answerLabel);
    creatorAnswersDiv.appendChild(answerInput);
    creatorAnswersDiv.appendChild(descriptionLabel);
    creatorAnswersDiv.appendChild(descriptionInput);
    inputContainer.appendChild(creatorAnswersDiv);
    dynamicInputs.appendChild(inputContainer);
  }
}
//make a preview grid but inside the dynamic input now with only 1 row and X columns Y times.
// function createPreviewGrid() {
//   const wordsPreview = document.getElementById('wordsPreview');
//   if (wordsPreview === null) {
//     console.log('no words preview');
//   }
//   wordsPreview.innerHTML = ''; // Clear previous preview items
//   let columnString = '';
//   for (let i = 0; i < widgetState.dimensionX; i++) {
//     columnString += '1fr ';
//   }
//   wordsPreview.style.gridTemplateColumns = columnString;

//   const totalCells = widgetState.dimensionX * widgetState.dimensionY;
//   console.log('total cells: ', totalCells);
//   for (let i = 0; i < totalCells; i++) {
//     const previewItem = document.createElement('div');
//     previewItem.classList.add('previewItem');
//     previewItem.id = `preview${i + 1}`;
//     wordsPreview.appendChild(previewItem);
//     let isClicked = false;
//     previewItem.addEventListener('click', () => {
//       if (isClicked) return;
//       const previewClickInput = document.createElement('input');
//       previewItem.appendChild(previewClickInput);
//       isClicked = true;
//     });
//   }
// }
//
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
      // if (previewItem.previewClickInput) {
      //   console.log('THERE EXISTS A PREVIEW CLICK INPUT');
      // }
      console.log('getting words' + i);
      const words = document
        .getElementById(`Words${i}`)
        .value.split(',')
        .map((word) => word.trim())
        .join(',');
      console.log(words);
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

    // Save widget data
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
    console.log(widgetState._title);
    Materia.CreatorCore.save(widgetState._title, qset.qset.data);
  },
});
