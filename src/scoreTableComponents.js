import checkmark from './assets/checkmark.js';
import xmark from './assets/xmark.js';

/** @param {Object} scoreTable
 * @param {boolean} showAnswers
 * @param {Object} breakPointBool
 * @param {Array} missedCategoriesArray*/
export function populateTable(
	scoreTable,
	showAnswers,
	breakPointBool,
	missedCategoriesArray,
	tbodyElement,
	screenReaderTbodyElement,
) {
	tbodyElement.innerHTML = '';
	screenReaderTbodyElement.innerHTML = '';
	// clears dom elements associated with incorrect answers prior to populating a new table
	document.querySelectorAll('.missed-table-container').forEach(element => {
		element.remove()
	})
	// scoreTable.forEach((entry, entryIndex) => {
	for (let entryIndex = 0; entryIndex < scoreTable.length; entryIndex++) {
		const entry = scoreTable[entryIndex];
		let isAllRight = false;
		const row1 = document.createElement('tr');
		row1.setAttribute('role', 'row');

		let isEmpty = false;
		//really funny json encoding made it a literal string
		if (entry.data[1] === `[""]`) {
			isEmpty = true;
			missedCategoriesArray.push({
				name: entry.data[0],
				correctAnswers: entry.data[2],
			});
		}
		const scoreCell = document.createElement('td');
		scoreCell.setAttribute('role', 'cell');
		//make it a flexbox with direction column and justify content center
		if (entry.score === 100) {
			scoreCell.innerHTML = checkmark;
			scoreCell.classList.add('correct');
			isAllRight = true;
		} //
		else {
			scoreCell.innerHTML = xmark;
			scoreCell.classList.add('wrong');
		}
		//maybe add the number for each scoreCell
		const questionNumber = document.createElement('label');
		questionNumber.textContent = `#${entryIndex + 1}`;
		const ptag = document.createElement('p');
		ptag.style.margin = '0rem';
		ptag;
		scoreCell.append(ptag);
		scoreCell.append(questionNumber);

		scoreCell.rowSpan = 2;
		row1.appendChild(scoreCell);
		//make the row for the top part of the row span
		const containerId = `fancyContainer-${entryIndex}`;
		const labelId = `label-${entryIndex}`;
		const FancyCell = document.createElement('td');
		// console.log('Creating the fancy cell show answer is ', entry.data[2]);
		FancyCell.colSpan = 4;
		FancyCell.setAttribute('role', 'cell');
		FancyCell.classList.add('FancyCell');


		//beter than nested ternary for html
		let heading;
		//when breakpoint is true, we make a new table if showAnswers is true,
		//if not then we just say once that the creator has disabled viewing of answers
		if (isAllRight) {
			heading = `<h1 style="margin-bottom: 0;">${entry.data[0]}</h1>`;
		} //
		else if (isEmpty) {
			heading = `<h1 style="margin-bottom: 0;"> Ran out of lives! </h1>`;
			breakPointBool.value = true;
			//how do we exit out of the for Each loop early? we do not want to generate more table rows.
		} //
		else {
			heading = `<h1 style="margin-bottom: 0;"> Wrong attempt </h1>`;
		}

		//so if there
		if (!breakPointBool.value) {
			//if isEmpty and showAnswers: then we show the remaining categories they got wrong
			//if isEmpty and !showAnswers: then we say they ran out of lives and the instructor disabled viewing of answers and remaining categories
			let subHeading = '';
			if (isEmpty) {
				if (showAnswers) {
					// Show remaining categories they got wrong
					subHeading = `
						<p style="margin-top: 0; color: #ffb9f9; font-weight: bold;">
						Unsolved Category: <span style="color: #6fecff; font-weight: normal";> ${entry.data[0]}</span>
						</p>
						`;
				} else {
					// They ran out of lives and viewing of answers is disabled
					subHeading = `<p style="margin-top: 0; color: #FFC4B6; font-weight: bold;">Answers are hidden for unguessed associations</p>`;
				}
			}

			FancyCell.innerHTML = `
				<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
				${heading}
			${subHeading}
				<label data-label-id="${labelId}">You selected:</label>
				<div data-container-id="${containerId}" style="display:flex;"></div>
				</div>
				`;
			row1.appendChild(FancyCell);
			tbodyElement.appendChild(row1);
			const FancyContainer = createFancyAnswer(
				entry.data[1],
				entry.data[2],
				containerId,
				showAnswers,
				labelId,
				isAllRight,
			);
			FancyCell.querySelector('div').appendChild(FancyContainer);
			const row2 = document.createElement('tr');
			tbodyElement.appendChild(row2);
			// Populate screen reader table
			const srRow = document.createElement('tr');
			srRow.setAttribute('role', 'row');
			const srScoreCell = document.createElement('td');
			srScoreCell.setAttribute('role', 'cell');
			srScoreCell.textContent =
				entry.score === 100 ? 'Correct' : 'Incorrect';
			srRow.appendChild(srScoreCell);

			entry.data.forEach((data, index) => {
				const cell = document.createElement('td');
				if (
					index == 2 &&
					entry.score !== 100 &&
					showAnswers === false
				) {
					cell.innerHTML = `Your instructor has disabled viewing <br /> of answers for wrong questions.`;
				} else {
					cell.textContent = data;
				}
				srRow.appendChild(cell);
			});
			screenReaderTbodyElement.appendChild(srRow);
		} //
		else {
			console.log('breakpoint is true');
			//do nothing here
		}
	}
}

/** @param {Array} userAnswer
 * @param {Array} words
 * @param {String} containerId
 * @param {boolean} showAnswers
 * @param {String} labelId
 * @param {boolean} isAllRight */
export function createFancyAnswer(
	userAnswer,
	words,
	containerId,
	showAnswers,
	labelId,
	isAllRight,
) {
	// Create the container dynamically instead of querying for it
	const FancyContainer = document.createElement('div');
	FancyContainer.setAttribute('data-container-id', containerId);
	FancyContainer.style.display = 'flex';
	FancyContainer.style.flexWrap = 'wrap';
	FancyContainer.style.justifyContent = 'center';

	const label = document.querySelector(`[data-label-id='${labelId}']`);
	let userWordsArray = Array.isArray(userAnswer)
		? userAnswer
		: JSON.parse(userAnswer);
	const correctWordsArray = words;

	if (
		userWordsArray.length === 0 ||
		userWordsArray.every((word) => word === '')
	) {
		label.textContent = 'Correct Answer:';
		if (showAnswers === true) {
			// Create fancy items for the correct answers
			correctWordsArray.forEach((word) => {
				const previewItem = document.createElement('div');
				previewItem.innerHTML = `<label> ${word}</label>`;
				previewItem.classList.add('preview-item');
				FancyContainer.appendChild(previewItem);
			});
		} else {
			const previewItem = document.createElement('div');
			previewItem.innerHTML = `<h1 style="margin-bottom: 1.63rem;">Answers are hidden</h1>`;
			FancyContainer.appendChild(previewItem);
		}
		return FancyContainer;
	}

	userWordsArray.forEach((word) => {
		console.log(`inside the function the boolean is ${isAllRight}`);
		const previewItem = document.createElement('div');
		if (word === '') {
			previewItem.innerHTML = `<label> (No answer given)</label>`;
			previewItem.classList.add('no-answer');
		} else {
			previewItem.innerHTML = `<label> ${word}</label>`;
			previewItem.classList.add('preview-item');
			if (correctWordsArray.includes(word) && isAllRight) {
				previewItem.classList.add('correct-word');
			} //
				//only show yellow(partially correct) if showAnswers is true
			else if (showAnswers && correctWordsArray.includes(word) && !isAllRight) {
				previewItem.classList.add('yellowWord');
			} //

			else {
				previewItem.classList.add('incorrect-word');
			}
		}
		FancyContainer.appendChild(previewItem);
	});

	return FancyContainer;
}

/** @param {boolean} showAnswersBool @param {Object} missedCategories */
export function generateTable2(showAnswersBool, missedCategories) {
	if(missedCategories.length === 0) {
		return;
	}
	const container = document.createElement('div');
	container.classList.add('missed-table-container');

	const heading = document.createElement('h1');
	heading.classList.add('headings');
	if (showAnswersBool) {
		heading.textContent = 'Missed Guesses:';
	} else {
		heading.textContent = 'Answers for missed categories are hidden';
		heading.style.color = '#FFC4B6';
	}
	container.append(heading);

	if (showAnswersBool && missedCategories.length > 0) {
		//imagine using react
		const table = document.createElement('table');
		table.classList.add('missed-answers-table');
		//the other table dosen't have a header
		const tbody = document.createElement('tbody');
		missedCategories.forEach((category, index) => {
			const row = document.createElement('tr');
			row.setAttribute('role', 'row');

			const FancyCell = document.createElement('td');
			FancyCell.setAttribute('role', 'cell');

			const containerId = `missedFancyContainer-${index}`;
			let headingContent = `<h1 style="margin-bottom: 0;">${category.name}</h1>`;
			let subHeading = '';

			if (showAnswersBool) {
				subHeading = `
					<label style="margin-top: 0; color: #ffb9f9; font-weight: bold;">
						Correct Answers:
					</label>
				`;
			} //
			else {
				subHeading = `<label style="margin-top: 0; color: #FFC4B6; font-weight: bold;">Answers are hidden for unguessed associations</label>`;
			}

			FancyCell.innerHTML = `
				<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
					${headingContent}
					${subHeading}
				</div>
			`;

			const FancyContainer = document.createElement('div');
			FancyContainer.setAttribute('data-container-id', containerId);
			FancyContainer.style.display = 'flex';
			FancyContainer.style.flexWrap = 'wrap';
			FancyContainer.style.justifyContent = 'center';
			category.correctAnswers.forEach((answer) => {
				const previewItem = document.createElement('div');
				previewItem.innerHTML = `<label> ${answer}</label>`;
				previewItem.classList.add('preview-item');
				FancyContainer.appendChild(previewItem);
			});

			FancyCell.querySelector('div').appendChild(FancyContainer);

			row.appendChild(FancyCell);
			tbody.appendChild(row);
		});

		table.appendChild(tbody);
		container.appendChild(table);
	}

	document.getElementById('mainContainer').appendChild(container);
}
