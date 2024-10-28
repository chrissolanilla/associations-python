import { populateTable, generateTable2 } from './scoreTableComponents.js';

Materia.ScoreCore.hideResultsTable();

const tbodyElement = document.getElementById('tbody');
const screenReaderTbodyElement = document.getElementById('screenReaderTbody');
const message = document.getElementById('message');

const start = (instance, qset, scoreTable, isPreview, qsetVersion) => {
	update(qset, scoreTable)
}

const getRenderedHeight = () => {
	return Math.ceil(parseFloat(window.getComputedStyle(document.querySelector('html')).height)) + 10
}

const update = (qset,scoreTable) => {

	let breakPoint = { value: false }
	let missedCategories = []
	let showAnswersBoolean = qset.options.showAnswers

	populateTable(
		scoreTable,
		showAnswersBoolean,
		breakPoint,
		missedCategories,
		tbodyElement,
		screenReaderTbodyElement,
	)

	if (breakPoint.value) generateTable2(showAnswersBoolean, missedCategories)

	let h = getRenderedHeight()
	Materia.ScoreCore.setHeight(h)
}

Materia.ScoreCore.start({
	start: start,
	update: update,
	handleScoreDistribution: (distribution) => {},
});
