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
    document.body.innerHTML = ``;
    document.body.style.marginTop = '-100%'; //probably doesnt work, the parent iframe has a fixed height
    console.log('showing default results table');
    return;
  }
  //
  else {
    // hide the default results table
    Materia.ScoreCore.hideResultsTable();
  }
}
// start & register a callback
Materia.ScoreCore.start({
  start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
    if (qset.showAnswers) {
      ShowScore(true);
    } //
    else if (qset.showAnswers === false) {
      ShowScore(false);
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
