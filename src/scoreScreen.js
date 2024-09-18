import { populateTable, generateTable2 } from './scoreTableComponents.js';

Materia.ScoreCore.hideResultsTable();

const tbodyElement = document.getElementById('tbody');
const screenReaderTbodyElement = document.getElementById('screenReaderTbody');
const message = document.getElementById('message');

//variables to keep track in the case we do not get everything right. I could make it a parameter 🤔
let breakPoint = { value: false };
const missedCategories = [];

Materia.ScoreCore.start({
	start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
		const showAnswersBoolean = qset.showAnswers;
		if (!showAnswersBoolean) {
			message.textContent =
				'The widget creator has disabled viewing of answers for wrong questions.';
		}
		populateTable(
			scoreTable,
			showAnswersBoolean,
			breakPoint,
			missedCategories,
			tbodyElement,
			screenReaderTbodyElement,
		);
		console.log(`after that function now we know that ${breakPoint}`);
		if (breakPoint) {
			generateTable2(showAnswersBoolean, missedCategories);
		}
	},
	update: (qset, scoreTable) => {},
	handleScoreDistribution: (distribution) => {},
});
