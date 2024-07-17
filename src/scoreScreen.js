import checkmark from './assets/checkmark.js';
import xmark from './assets/xmark.js';
Materia.ScoreCore.hideResultsTable();

const tbodyElement = document.getElementById('tbody');
const screenReaderTbodyElement = document.getElementById('screenReaderTbody');
function createFancyAnswer(words, containerId) {
  const FancyContainer = document.querySelector(
    `[data-container-id='${containerId}']`,
  );
  console.log('function words is ', words);
  const wordsArray = words.split(',');
  wordsArray.forEach((word, index) => {
    console.log('WORD IN THE FUNCTION FOR EACH IS ', word);
    console.log('index in the function is ', index);
    const previewItem = document.createElement('div');
    previewItem.innerHTML = `<label> ${word}</label>`;
    previewItem.classList.add('preview-item');
    FancyContainer.appendChild(previewItem);
  });
}
function populateTable(scoreTable, showAnswers) {
  tbodyElement.innerHTML = '';
  screenReaderTbodyElement.innerHTML = '';

  scoreTable.forEach((entry, entryIndex) => {
    const row1 = document.createElement('tr');

    const scoreCell = document.createElement('td');
    if (entry.score === 100) {
      console.log('adding in our svg');
      scoreCell.innerHTML = checkmark;
      scoreCell.classList.add('correct');
    } //
    else {
      console.log('wrong, adding in our svg');
      scoreCell.innerHTML = xmark;
      scoreCell.classList.add('wrong');
    }
    console.log('Making the row span 2');
    scoreCell.rowSpan = 2;
    row1.appendChild(scoreCell);
    //make the row for the top part of the row span
    const containerId = `fancyContainer-${entryIndex}`;
    const FancyCell = document.createElement('td');
    FancyCell.colSpan = 4;
    FancyCell.innerHTML = `
       <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h1>${entry.data[0]}</h1>
          <div data-container-id="${containerId}" style="display:flex;"></div>
        </div>
      `;
    row1.appendChild(FancyCell);
    tbodyElement.appendChild(row1);
    createFancyAnswer(entry.data[2], containerId);
    const row2 = document.createElement('tr');
    tbodyElement.appendChild(row2);
    // Populate screen reader table
    const srRow = document.createElement('tr');
    const srScoreCell = document.createElement('td');
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

// start & register a callback
Materia.ScoreCore.start({
  start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
    const showAnswersBoolean = qset.showAnswers;
    populateTable(scoreTable, showAnswersBoolean);
    console.log('the instance is', instance);
    console.log('the qset is', qset);
    console.log('the scoreTable is', scoreTable);
    console.log('qset.showAnswers is ', qset.showAnswers);
  },
  update: (qset, scoreTable) => {},
  handleScoreDistribution: (distribution) => {},
});
