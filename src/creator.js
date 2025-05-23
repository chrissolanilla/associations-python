import { showToast } from './FunctionsPlayer';
import {createCreatorHelpModal} from './creatorTutorialModal.js'
import './creator.scss';
import {
	updateGameName,
	updatePreview,
	createDynamicInputs,
	trunkcadeWords,
	flashInvalidInputs,
	highlightGrid,
	addKeydownEventListener,
	// variables imported
	widgetState,
	savedWidgetState,
} from './creatorFunctions';

const formElement = document.getElementById('fromDisable');
formElement.addEventListener('submit', (event) => {
	event.preventDefault();
});
const chooseButton = document.getElementById('chooseButton');
const introModal = document.getElementById('introModal');
introModal.showModal();
const modal = document.querySelector('[data-modal]');
modal.classList.add('hidden');

//code to handle form submission for gamename so you can do it by pressing enter
const gameNameForm = document.getElementById('gameNameForm');
gameNameForm.addEventListener('submit', (event) => {
	event.preventDefault(); //stops from refreshing the page
	const gameName = document.getElementById('GameName2').value;
	widgetState._title = gameName;
	introModal.close();
	modal.showModal();
});

//lives input thing
const livesInput = document.getElementById('livesInput');
const decrementButton = document.getElementById('decrementButton');
const incrementButton = document.getElementById('incrementButton');

livesInput.addEventListener('input', () => {
	if (/^[1-9]\d*$/.test(livesInput.value)) {
		widgetState.lives = livesInput.value;
		livesInput.classList.remove('invalid');
		livesInput.classList.add('valid');
	} //
	else {
		livesInput.classList.add('invalid');
		livesInput.classList.remove('valid');
	}
});

decrementButton.addEventListener('click', () => {
	if (livesInput.value > 0) {
		livesInput.value--;
		widgetState.lives = livesInput.value;
		livesInput.classList.add('valid');
		livesInput.classList.remove('invalid');
	}
	if (livesInput.value <= 0) {
		livesInput.classList.remove('valid');
		livesInput.classList.add('invalid');
	}
});

incrementButton.addEventListener('click', () => {
	livesInput.value++;
	widgetState.lives = livesInput.value;
	livesInput.classList.remove('invalid');
	livesInput.classList.add('valid');
});

// Add event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	const { openModal, closeModal, modal: tutorialModal } = createCreatorHelpModal();
	document.querySelectorAll('.CreatorAnswers input').forEach((input) => {
		input.addEventListener('input', updatePreview);
	});

	const helpButton = document.getElementById('helpButton');
	helpButton.addEventListener('click', () => {
		tutorialModal.showModal();

	});

	const showAnswersDiv = document.getElementById('ShowAnswersDiv');
	const showAnswersLabel = document.getElementById('ShowAnswersLabel');
	const showAnswersCheckbox = document.getElementById('ShowAnswersCheckbox');

	showAnswersCheckbox.addEventListener('focus', (event) => {
		const parentDiv = event.target.closest('.ShowAnswersBoolean');
		if (parentDiv) {
			parentDiv.classList.add('focus-highlight');
		} else {
		}
	});

	showAnswersCheckbox.addEventListener('blur', (event) => {
		const parentDiv = event.target.closest('.ShowAnswersBoolean');
		if (parentDiv) {
			parentDiv.classList.remove('focus-highlight');
		}
	});
	showAnswersCheckbox.addEventListener('keypress', (event) => {
		const parentDiv = event.target.closest('.ShowAnswersBoolean');
		if (event.key === 'Enter') {
			event.preventDefault();
			showAnswersCheckbox.checked = !showAnswersCheckbox.checked;
			if (showAnswersCheckbox.checked) {
				widgetState.showAnswers = true;
				parentDiv.classList.remove('off');
				parentDiv.classList.add('on');
				showAnswersLabel.textContent =
					'Reveal Answers on Score Screen: On';
			} //
			else {
				widgetState.showAnswers = false;
				showAnswersDiv.classList.remove('on');
				showAnswersDiv.classList.add('off');
				showAnswersLabel.textContent =
					'Reveal Answers on Score Screen: Off';
			}
		}
	});

	showAnswersDiv.addEventListener('click', () => {
		showAnswersCheckbox.checked = !showAnswersCheckbox.checked;
		if (showAnswersCheckbox.checked) {
			widgetState.showAnswers = true;
			showAnswersDiv.classList.remove('off');
			showAnswersDiv.classList.add('on');
			showAnswersLabel.textContent = 'Reveal Answers on Score Screen: On';
		} //
		else {
			widgetState.showAnswers = false;
			showAnswersDiv.classList.remove('on');
			showAnswersDiv.classList.add('off');
			showAnswersLabel.textContent =
				'Reveal Answers on Score Screen: Off';
		}
	});
	document.querySelectorAll('.GameNameInput input').forEach((input) => {
		input.addEventListener('input', updateGameName);
	});
	const gameName2Input = document.getElementById('GameName2');
	gameName2Input.addEventListener('input', () => {
		if (gameName2Input.value.trim() === '') {
			gameName2Input.classList.add('invalid');
		} //
		else {
			gameName2Input.classList.remove('invalid');
			gameName2Input.classList.add('valid');
		}
	});
	const GameNameInput = document.getElementById('GameName');
	GameNameInput.addEventListener('input', () => {
		if (GameNameInput.value.trim() === '') {
			GameNameInput.classList.add('invalid');
		} //
		else {
			GameNameInput.classList.remove('invalid');
			GameNameInput.classList.add('valid');
		}
	});
	const closeIntroButton = document.getElementById('closeIntro');
	const arrowBoxLeft = document.getElementById('arrow_box_left');

	const checkInputValidity = () => {
		if (gameName2Input.value.trim() !== '') {
			closeIntroButton.disabled = false;
			arrowBoxLeft.style.display = 'none'; // hide the arrow
		} //
		else {
			closeIntroButton.disabled = true;
			arrowBoxLeft.style.display = 'block'; // show the arrow
		}
	};

	// initial check on page load
	checkInputValidity();

	gameName2Input.addEventListener('input', checkInputValidity);
	document
		.getElementById('GameName')
		.addEventListener('input', updateGameName);
	document.getElementById('GameName2').addEventListener('input', (event) => {
		const value = event.target.value;
		document.getElementById('GameName').value = value;
		updateGameName();
	});

	closeIntroButton.addEventListener('click', () => {
		introModal.close();
		introModal.classList.add('hidden');
		modal.showModal();
		modal.classList.remove('hidden')
	});
});

//event listener to escape when grid dialog is opened
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

//on hover for grid cells
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
		widgetState.dimensionX = event.target.dataset.col;
		widgetState.dimensionY = event.target.dataset.row;
	}
});

DimensionContainer.addEventListener('click', (event) => {
	if (event.target.classList.contains('cell')) {
		widgetState.dimensionX = event.target.dataset.col;
		widgetState.dimensionY = event.target.dataset.row;
		//if the grid is not valid tell them
		if (widgetState.dimensionX <= 1 || widgetState.dimensionY <= 1) {
			showToast('The grid must be at least 2x2', 'error');
		} //
		else {
			modal.close();
			modal.classList.add('hidden');
			//moving this to inside the function
			// document.getElementById('dynamicInputs').classList.add('show')
			createDynamicInputs();
		}
	}
});

// //code to select dimensions with arrow keys
let finalCol = 4;
let finalRow = 4;
addKeydownEventListener(
	modal,
	widgetState,
	finalCol,
	finalRow,
	highlightGrid,
	createDynamicInputs,
	showToast,
);

chooseButton.addEventListener('click', (event) => {
	modal.showModal();
	modal.classList.remove('hidden');
});

Materia.CreatorCore.start({
	initNewWidget: (widget, baseUrl, mediaUrl) => {
		// setup for a new widget
	},
	initExistingWidget: (
		title,
		widget,
		qset,
		qsetVersion,
		baseUrl,
		mediaUrl,
	) => {
		//if widget exists, close the intro modal and update our state and create the dynamic inputs
		if (widget) {
			introModal.close();
			introModal.classList.add('hidden');

			if (qset.data) qset = qset.data
			if (!qset.items) {
				introModal.showModal();
				introModal.classList.remove('hidden');

				return false
			}
			document.getElementById('dynamicInputs').classList.add('show')
			widgetState.dimensionX = qset.items[0].answers[0].text.length;
			widgetState.dimensionY = qset.items.length;

			const GameNameExisting = document.getElementById('GameName');
			GameNameExisting.value = title;
			if (GameNameExisting.value.trim() === '') {
				GameNameExisting.classList.add('invalid');
			}
			else {
				GameNameExisting.classList.add('valid');
			}
			widgetState._title = title;

			//sync the lives input and state
			widgetState.lives = qset.options.lives ?? 1;
			livesInput.value = widgetState.lives;
			if (livesInput.value > 0) {
				livesInput.classList.add('valid');
			} //
			else {
				livesInput.classList.remove('valid');
				livesInput.classList.add('invalid');
			}
			//sync the show answers checkbox and state
			widgetState.showAnswers = qset.options.showAnswers ?? false;

			const ShowAnswersCheckbox2 = document.getElementById(
				'ShowAnswersCheckbox',
			);
			const showAnswersDiv2 = document.getElementById('ShowAnswersDiv');
			const showAnswersLabel2 =
				document.getElementById('ShowAnswersLabel');

			ShowAnswersCheckbox2.checked = qset.options.showAnswers ?? false;
			if (ShowAnswersCheckbox2.checked) {
				showAnswersDiv2.classList.remove('off');
				showAnswersDiv2.classList.add('on');
				showAnswersLabel2.textContent =
					'Reveal Answers on Score Screen: On';
			}

			for (let i = 1; i <= widgetState.dimensionY; i++) {
				widgetState[`words${i}`] =
					qset.items[i - 1].answers[0].text;
				widgetState[`description${i}`] =
					qset.items[i - 1].questions[0].text;
				savedWidgetState[`words${i}`] = widgetState[`words${i}`];
				savedWidgetState[`description${i}`] =
					widgetState[`description${i}`];
			}

			DimensionStatusElement.textContent = `${widgetState.dimensionX} x ${widgetState.dimensionY}`

			createDynamicInputs();
		}
	},

	onSaveClicked: (mode = 'save') => {
		trunkcadeWords(widgetState, savedWidgetState);
		const items = [];
		//this will succesffully trunkcade groups but not extra words.
		for (let i = 1; i <= widgetState.dimensionY; i++) {
			const words = savedWidgetState[`words${i}`];
			const description = document
				.getElementById(`Description${i}`)
				.value.trim();
			//check if words and description are empty
			const GameName = document.getElementById('GameName');
			if (GameName.value.trim() === '') {
				GameName.classList.remove('valid')
				GameName.classList.add('invalid')
			} //
			else {
				GameName.classList.remove('invalid');
				GameName.classList.add('valid');
			}

			// pristine words may be invalid but don't yet have the selector; add it first
			let allWords = document.querySelectorAll('.grid-input')
			for (const word of allWords) {
				if (!word.value || word.value.length == 0) {
					const parentElement = word.closest('.previewItem')
					if (parentElement) parentElement.classList.add('invalid')
				}
			}

			// do the same for categories
			let allCategories = document.querySelectorAll('.dInput')
			for (const category of allCategories) {
				if (!category.value || category.value.length == 0) {
					category.classList.add('invalid')
				}
			}

			//checks for any invalid red inputs (widget title, category names, and words)
			const invalidElements = document.querySelectorAll('.invalid')
			if (invalidElements.length > 0) {
				//show a toast module that says to complete all fields
				showToast('Please complete all fields', 'error');
				//do the creator core cancel function
				Materia.CreatorCore.cancelSave(
					'It looks like some input fields are invalid. Please fix them before saving.',
				);
				flashInvalidInputs();
				return;
			}
			items.push({
				materiaType: 'question',
				type: 'connections',
				id: null,
				questions: [{ text: description }],
				answers: [{ text: words, value: 100 }],
			});
		}

		const qset = {
			items: items,
			options: {
				showAnswers: widgetState.showAnswers,
				lives: widgetState.lives
			}
		};
		showToast('Game saved successfully', 'success');
		Materia.CreatorCore.save(widgetState._title, qset);
	},
});
