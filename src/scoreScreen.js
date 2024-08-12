import checkmark from './assets/checkmark.js';
import xmark from './assets/xmark.js';
Materia.ScoreCore.hideResultsTable();

const tbodyElement = document.getElementById('tbody');
const screenReaderTbodyElement = document.getElementById('screenReaderTbody');
const message = document.getElementById('message');

function createFancyAnswer(userAnswer, words, containerId) {
  const FancyContainer = document.querySelector(
    `[data-container-id='${containerId}']`,
  );
  console.log('function words is ', words);
  console.log('userAnswer is ', userAnswer);
  // we have to do this because for some reason json encoding makes it not an array somewhere along its travels
  let userWordsArray = Array.isArray(userAnswer)
    ? userAnswer
    : JSON.parse(userAnswer);

  console.log('userWordsArray is ', userAnswer);
  const correctWordsArray = words;
  console.log('correctWordsArray is ', correctWordsArray);
  userWordsArray.forEach((word, index) => {
    // console.log('WORD IN THE FUNCTION FOR EACH IS ', word);
    // console.log('index in the function is ', index);
    const previewItem = document.createElement('div');
    console.log('THE WORD IS: ', word);
    if (word === 'Ran out of Lives') {
      previewItem.innerHTML = `<h1> You ran out of lives</h1>`;
    } //
    else {
      previewItem.innerHTML = `<label> ${word}</label>`;
      previewItem.classList.add('preview-item');
      if (correctWordsArray.includes(word)) {
        previewItem.classList.add('correct-word'); // Add class for correct word
      } //
      else {
        previewItem.classList.add('incorrect-word'); // Add class for incorrect word
      }
    }
    FancyContainer.appendChild(previewItem);
  });
}

function populateTable(scoreTable, showAnswers) {
  tbodyElement.innerHTML = '';
  screenReaderTbodyElement.innerHTML = '';

  scoreTable.forEach((entry, entryIndex) => {
    let isAllRight = false;
    const row1 = document.createElement('tr');
    row1.setAttribute('role', 'row');

    const scoreCell = document.createElement('td');
    scoreCell.setAttribute('role', 'cell');
    if (entry.score === 100) {
      scoreCell.innerHTML = checkmark;
      scoreCell.classList.add('correct');
      isAllRight = true;
    } //
    else {
      scoreCell.innerHTML = xmark;
      scoreCell.classList.add('wrong');
    }
    scoreCell.rowSpan = 2;
    row1.appendChild(scoreCell);
    //make the row for the top part of the row span
    const containerId = `fancyContainer-${entryIndex}`;
    const FancyCell = document.createElement('td');
    console.log('Creating the fancy cell show answer is ', entry.data[2]);
    FancyCell.colSpan = 4;
    FancyCell.setAttribute('role', 'cell');
    FancyCell.innerHTML = `
       <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h1 style="margin-bottom: 0;">${entry.data[0]}</h1>
          ${showAnswers && !isAllRight ? `<p style="margin-top: 0; color: #ff84f2; font-weight: bold;">Correct answers: <span style="color: #0df; font-weight: normal";> ${entry.data[2]}</span></p>` : ''}
            <label>Your choice:</label>
          <div data-container-id="${containerId}" style="display:flex;"></div>
        </div>
      `;
    row1.appendChild(FancyCell);
    tbodyElement.appendChild(row1);
    createFancyAnswer(entry.data[1], entry.data[2], containerId);
    const row2 = document.createElement('tr');
    tbodyElement.appendChild(row2);
    // Populate screen reader table
    const srRow = document.createElement('tr');
    srRow.setAttribute('role', 'row');
    const srScoreCell = document.createElement('td');
    srScoreCell.setAttribute('role', 'cell');
    srScoreCell.textContent = entry.score === 100 ? 'Correct' : 'Incorrect';
    srRow.appendChild(srScoreCell);

    entry.data.forEach((data, index) => {
      const cell = document.createElement('td');
      if (index == 2 && entry.score !== 100 && showAnswers === false) {
        cell.innerHTML = `Your instructor has disabled viewing <br /> of answers for wrong questions.`;
      } else {
        cell.textContent = data;
      }
      srRow.appendChild(cell);
    });
    screenReaderTbodyElement.appendChild(srRow);
  });
}

Materia.ScoreCore.start({
  start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
    const showAnswersBoolean = qset.showAnswers;
    if (!showAnswersBoolean) {
      message.textContent =
        'The widget creator has disabled viewing of answers for wrong questions.';
    }
    populateTable(scoreTable, showAnswersBoolean);
    console.log('the instance is', instance);
    console.log('the qset is', qset);
    console.log('the scoreTable is', scoreTable);
    console.log('qset.showAnswers is ', qset.showAnswers);
  },
  update: (qset, scoreTable) => {},
  handleScoreDistribution: (distribution) => {},
});
