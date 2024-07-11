import checkmark from './assets/checkmark.js';
import xmark from './assets/xmark.js';
Materia.ScoreCore.hideResultsTable();

const tbodyElement = document.getElementById('tbody');

function populateTable(scoreTable, showAnswers) {
  tbodyElement.innerHTML = '';

  scoreTable.forEach((entry) => {
    const row = document.createElement('tr');

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
    row.appendChild(scoreCell);

    entry.data.forEach((data, index) => {
      console.log('index is ', index);
      console.log('data is ', data);
      const cell = document.createElement('td');
      if (index == 2 && entry.score !== 100 && showAnswers === false) {
        cell.innerHTML = `Your instructor has disabled viewing <br /> of answers for wrong questions.`;
      } //
      else {
        cell.textContent = data;
      }
      row.appendChild(cell);
    });

    tbodyElement.appendChild(row);
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
