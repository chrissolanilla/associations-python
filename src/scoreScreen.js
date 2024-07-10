import checkmark from './assets/checkmark.js';
import xmark from './assets/xmark.js';
console.log('CHECK MARK SVG IS', checkmark);

// const getHeight = () => {
//   return Math.ceil(
//     parseFloat(window.getComputedStyle(document.querySelector('html')).height),
//   );
// };
// Materia.ScoreCore.setHeight(1);
const tbodyElement = document.getElementById('tbody');
const tableElement = document.getElementById('table');
/** param {boolean} showAnswers */
function ShowScore(showAnswers) {
  if (showAnswers) {
    //do not hide the default results table, also hide the html
    //setting the height to 350?
    Materia.ScoreCore.setHeight(350);
    document.body.innerHTML = ``;
    console.log(document.body);
    document.body.style.marginTop = '-100%'; //probably doesnt work, the parent iframe has a fixed height
    console.log('showing default results table');
    // Step 1: Get the <html> tag of the page
    const htmlTag = document.documentElement;

    // Step 2: Find the parent <iframe> element
    const parentIframe = htmlTag.closest('iframe');

    // Step 3: Check if the parent iframe exists and set the margin-top style
    if (parentIframe) {
      parentIframe.style.marginTop = '-100%';
    } else {
      console.log('No parent iframe found.');
    }
    return;
  }
  //
  else {
    // hide the default results table
    Materia.ScoreCore.hideResultsTable();
  }
}

function populateTable(scoreTable) {
  console.log('starting the svg madness');
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
      cell.textContent = data;
      row.appendChild(cell);
    });

    tbodyElement.appendChild(row);
  });
}

// start & register a callback
Materia.ScoreCore.start({
  start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
    if (qset.showAnswers) {
      ShowScore(true);
    } //
    else if (qset.showAnswers === false) {
      ShowScore(false);
      populateTable(scoreTable);
    } //
    else {
      console.log('there is no qset.showAnswers? waht is going on here?');
    }
    console.log('the instance is', instance);
    console.log('the qset is', qset);
    console.log('the scoreTable is', scoreTable);
  },
  update: (qset, scoreTable) => {},
  handleScoreDistribution: (distribution) => {},
});
