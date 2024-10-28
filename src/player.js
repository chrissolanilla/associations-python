import './player.scss';
import {
	shuffleArray,
	createAnswerDiv,
	updateSelectionStyles,
	selectWord,
	setCurrentQset,
	getCurrentQset,
	setGuessedGroups,
	getGuessedGroups,
	setSelectedWords,
	getSelectedWords,
	resetSelectedWords,
	resetGuessedGroups,
	setDimensions,
	addCurrentButtons,
	showToast,
	animateSelectionToTop,
	sleep,
	setCorrectGuesses,
	dragElement,
	updateButtonStyles,
} from './FunctionsPlayer';

import { createTutorialModal } from './tutorialModal';

/**
 * @typedef {Object} GuessedGroupsState
 * @property {string[]} group1 - Group 1 guessed words.
 * @property {string[]} group2 - Group 2 guessed words.
 * @property {string[]} group3 - Group 3 guessed words.
 * @property {string[]} group4 - Group 4 guessed words.
 * @property {string[]} group5 - Group 5 guessed words.
 * @property {string[]} group6 - Group 6 guessed words.
 */
/** @type GuessedGroupsState */
const guessedGroupsState = {
	group1: [],
	group2: [],
	group3: [],
	group4: [],
	group5: [],
	group6: [],
};

let livesConstant = 0;

// Modal code
const closeButton = document.querySelector('[data-close-modal]');
const modal = document.querySelector('[data-modal]');
modal.showModal();
closeButton.addEventListener('pointerdown', () => {
	modal.close();
});

//this will decide if our function will display the answers or not which will be updated by the instance
let showAnswersBoolean = false;
const instructionDescription = document.getElementById('instructionsModal');
// Variables to keep track of the score
let percentScore = 0,
	attempts = 0,
	scoreCount = 0;

const AttemptsElement = document.getElementById('Attempts');
AttemptsElement.innerHTML = 'Wrong Attempts: ' + attempts;
//screenreader element
const ScreenReaderElement = document.getElementById('screenReader');
let maxAttempts = 0; //change it to dimensionX later
let maxWrongAttemptsElement = document.getElementById('maxWrongAttempts');
let dimensionXGlobal = 0;
let dimensionYGlobal = 0;

function setupGame(qset) {
	if (!qset || !qset.items) {
		console.error('Invalid qset data', qset);
		return;
	}
	setCurrentQset(qset); // Set the currentQset
	resetGuessedGroups(); // Reset guessedGroups
	resetSelectedWords(); // Reset selectedWords
	// Get currentQset for logging
	//get the dimmensions of the qset
	const dimensionX = qset.items[0].answers[0].text.length;
	const dimensionY = qset.items.length;
	setDimensions(dimensionX, dimensionY);
	dimensionXGlobal = dimensionX;
	dimensionYGlobal = dimensionY;
	maxAttempts = livesConstant;
	maxWrongAttemptsElement.textContent = `(${maxAttempts - attempts} left)`;
	instructionDescription.textContent = `Select words in groups of  ${dimensionXGlobal} that belong to a common category.`;
	const instructoinDescriptions2 =
		document.getElementById('instructionsModal2');
	instructoinDescriptions2.textContent = `Do this ${dimensionYGlobal} times to win!`;

	const { openModal, closeModal } = createTutorialModal(
		dimensionX,
		dimensionY,
		maxAttempts,
	);

	const helpButton = document.getElementById('helpButton');
	helpButton.addEventListener('pointerdown', openModal);

	const descriptions = qset.items.map((item) => item.questions[0].text); // Extract descriptions
	const wordsGrid = document.querySelector('.wordsPreview');
	//this styles it based on the x dimensions
	let columnString = '';
	for (let i = 0; i < dimensionX; i++) {
		columnString += '1fr ';
	}
	wordsGrid.style.gridTemplateColumns = columnString;
	const allWords = qset.items.flatMap((item) => item.answers[0].text); // Extract individual words from the array
	const shuffledWords = shuffleArray(allWords);

	const controlsElement = document.getElementById('controls');
	const attemptsSpan = document.getElementById('span');
	const button = document.createElement('button');
	button.textContent = `Check ${dimensionX}`;
	button.id = `check${dimensionX}`;
	button.classList.add('greyOutButton');
	button.setAttribute(
		'aria-label',
		`Check your selection of ${dimensionX} words.`,
	);
	button.addEventListener('pointerdown', (event) => {
		if (!event.target.classList.contains('styled-button')) {
			event.preventDefault();
			return;
		}
		//update the style before we do any long computation so they don't submit more than once
		updateButtonStyles(button.id, false);
		checkSelection(dimensionX);
	});
	controlsElement.insertBefore(button, attemptsSpan);
	addCurrentButtons(button.id);
	wordsGrid.innerHTML = '';
	//create the checkboxes
	shuffledWords.forEach((word, index) => {
		const wordElement = document.createElement('div');
		wordElement.className = 'previewItem';
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = `word${index}`;
		const label = document.createElement('label');
		label.htmlFor = `word${index}`;
		label.textContent = word.trim();
		wordElement.appendChild(checkbox);
		wordElement.appendChild(label);
		wordsGrid.appendChild(wordElement);

		checkbox.addEventListener('change', () => {
			selectWord(word.trim());
		});
		//gets the parent element and makes the div look it it's being focused
		checkbox.addEventListener('focus', (event) => {
			const parentDiv = event.target.closest('.previewItem');
			if (parentDiv) {
				parentDiv.classList.add('focus-highlight');
			}
		});

		checkbox.addEventListener('blur', (event) => {
			const parentDiv = event.target.closest('.previewItem');
			if (parentDiv) {
				parentDiv.classList.remove('focus-highlight');
			}
		});
		//prevent dfeault behavior of pressing enter so it can change the style of the word
		checkbox.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				checkbox.click();
			}
		});
	});

	AttemptsElement.innerHTML = 'Wrong Attempts: ' + attempts;
}

async function checkSelection(count) {
	let highestGroupLength = 0;
	let isCorrect = false;
	const wordsGrid = document.querySelector('.wordsPreview');
	const correctAnswersDiv = document.getElementById('correctAnswers');
	let validGroupsCount = 0;
	let validWordsCount = 0;
	let closestMatch = null;
	// Track groups that should be removed
	let groupsToRemove = [];
	const selectedWords = getSelectedWords();
	const currentQset = getCurrentQset();
	//refacotr things to be by dimensionX instead of 4
	for (let i = 0; i < selectedWords.length; i += dimensionXGlobal) {
		const currentGroup = selectedWords
			.slice(i, i + dimensionXGlobal)
			.sort();
		let groupFound = false;

		currentQset.items.forEach((item, index) => {
			if (getGuessedGroups().has(item.questions[0].text)) {
				return; // Skip already guessed groups
			}
			const answerWords = item.answers[0].text.map((word) => word.trim());
			const group = currentGroup.filter((word) =>
				answerWords.includes(word),
			);
			if (group.length > highestGroupLength) {
				highestGroupLength = group.length;
				closestMatch = item;
			}
			//the item has all our data of what the question is and the answer.
			if (group.length === dimensionXGlobal) {
				const guessedGroups = getGuessedGroups();
				guessedGroups.add(item.questions[0].text); // Add description to guessed set
				setGuessedGroups(guessedGroups);
				validGroupsCount++;
				validWordsCount += dimensionXGlobal;
				const pointsPerCorrectGroup = 100 / currentQset.items.length; // Dynamic points allocation
				percentScore += pointsPerCorrectGroup;
				scoreCount++;
				setTimeout(() => {
					showToast('Correct! Nice job!', 'success');
				}, 1000);
				//update the hidden screen reader element to tell them the answer audibly
				// Force DOM reflow by temporarily removing and re-adding the element

				setTimeout(() => {
					ScreenReaderElement.textContent =
						'Correct!' +
						item.questions[0].text +
						' was the description for the group of words: ' +
						answerWords;
				}, 2000);
				// submit the group as an array instead of comma separated string
				Materia.Score.submitQuestionForScoring(
					item.id,
					JSON.stringify(group),
					pointsPerCorrectGroup,
				);
				//this dosent actually matter anymore to be honest but its nice to remember how to do this weird string thing.
				const className = `selected-${(index + 1) * 4}`;
				setTimeout(() => {
					const answerDiv = createAnswerDiv(
						item.questions[0].text,
						group,
						className,
						false,
					);
					correctAnswersDiv.appendChild(answerDiv);
					groupsToRemove.push(group);
					groupFound = true;
				}, 1000);
				setCorrectGuesses(1); // for the styling selection update
				isCorrect = true;
			}
		});

		if (!groupFound && currentGroup.length === dimensionXGlobal) {
			// Find the correct index for the group
			currentQset.items.forEach((item, index) => {
				const answerWords = item.answers[0].text.map((word) =>
					word.trim(),
				);
				const group = currentGroup.filter((word) =>
					answerWords.includes(word),
				);
				if (group.length > 0) {
					guessedGroupsState[`group${index + 1}`] = currentGroup;
				}
			});
			animateSelectionToTop(isCorrect);
		}
	}
	// Only remove words from valid groups
	await sleep(1000);
	groupsToRemove.forEach((group) => {
		group.forEach((word) => {
			const checkbox = [
				...document.querySelectorAll(
					'.previewItem input[type="checkbox"]',
				),
			].find(
				(input) =>
					input.nextElementSibling.textContent.trim() === word.trim(),
			);
			if (checkbox) {
				const item = checkbox.parentNode;
				wordsGrid.removeChild(item);
			}
		});
	});

	//case where our selecton is wrong, we should submit the question for scoring to log their answer
	//or maybe we don't submit the question for scoring, we just do it once?
	if (validWordsCount !== count) {
		//item is not defined since its out of scope form the parameter
		// const pointsPerCorrectGroup = 100 / currentQset.items.length; // Dynamic points allocation
		Materia.Score.submitQuestionForScoring(
			closestMatch.id,
			JSON.stringify(selectedWords),
			0,
		);

		if (highestGroupLength + 1 === dimensionXGlobal) {
			showToast('Sorry, that was not correct. You were one away...', 'error');
			ScreenReaderElement.textContent = 'Incorrect, one away...';
		} //
		else {
			showToast('Sorry, that was not correct', 'error');
			ScreenReaderElement.textContent = 'Incorrect, try again';
		}
		attempts++;
		AttemptsElement.innerHTML = 'Wrong Attempts: ' + attempts;
		maxWrongAttemptsElement.innerHTML = `(${maxAttempts - attempts} left)`;
		const btn = document.getElementById(`check${dimensionXGlobal}`);
		btn.classList.remove('styled-button');
		//we only have one button now...
		// for (let i = 1; i <= dimensionYGlobal; i++) {
		// 	const btn = document.getElementById(`check${dimensionXGlobal * i}`);
		// 	btn.classList.remove('styled-button');
		// }
		if (attempts >= maxAttempts) {
			disableGame();
		}
	}
	// Clear selectedWords after evaluation
	setSelectedWords([]);
	document
		.querySelectorAll('.previewItem input[type="checkbox"]:checked')
		.forEach((checkbox) => {
			checkbox.checked = false;
		});
	updateSelectionStyles();
	if (scoreCount >= dimensionYGlobal) disableGame();
}

function showRemainingCorrectAnswers() {
	const wordsGrid = document.querySelector('.wordsPreview');
	const correctAnswersDiv = document.getElementById('correctAnswers');

	const alreadyGuessedWords = Array.from(
		correctAnswersDiv.querySelectorAll('.AnswerDivBackground div div'),
	)
		.map((div) => div.textContent.split(', '))
		.flat();

	const currentQset = getCurrentQset();
	const groupWords = currentQset.items.map((item) =>
		item.answers
			.map((answer) => answer.text)
			.filter((word) => !alreadyGuessedWords.includes(word)),
	);

	groupWords.forEach((group, index) => {
		if (group.length > 0) {
			const className = `selected-${(index + 1) * 4}`;
			if (!correctAnswersDiv.querySelector(`.${className}`)) {
				const answerDiv = createAnswerDiv(
					currentQset.items[index].questions[0].text,
					group,
					className,
					true,
				);
				correctAnswersDiv.appendChild(answerDiv);
			}
		}
	});

	wordsGrid.innerHTML = '';
}

//we don't need to get their best guess anymore
function disableGame() {
	const wordsGrid = document.querySelector('.wordsPreview');
	const currentQset = getCurrentQset();

	const unguessedDescriptions = currentQset.items.filter((item) => {
		return !getGuessedGroups().has(item.questions[0].text);
	});

	unguessedDescriptions.forEach((item) => {
		const incorrectGroup = [''];
		Materia.Score.submitQuestionForScoring(
			item.id,
			JSON.stringify(incorrectGroup),
			0,
		);
	});

	wordsGrid
		.querySelectorAll('.previewItem input[type="checkbox"]')
		.forEach((checkbox) => {
			checkbox.disabled = true;
		});
	//get the modal and show the results
	const resultsModal = document.getElementById('resultsModal');
	const finalResults = document.getElementById('finalResults');
	percentScore = percentScore.toFixed(2);
	finalResults.innerHTML = `
		<p>Correct Selections: ${scoreCount}</p>
		<p>Wrong Attempts: ${attempts}</p>
		<p>Grade : ${percentScore} </p>
	`;
	if (showAnswersBoolean) {
		showRemainingCorrectAnswers();
	}
	// Show the modal for the final score
	resultsModal.classList.remove('hidden');
	//stupid way of centering it but I'm convinced I have to cause iFrame
	const rect = resultsModal.getBoundingClientRect();
	resultsModal.style.top = `calc(50% - ${rect.height / 2}px)`;
	resultsModal.style.left = `calc(51% - ${rect.height / 2}px)`;
	const darkenBody = document.createElement('div');
	darkenBody.classList.add('darkenBody');
	document.body.appendChild(darkenBody);
	document.getElementById('goToScoreScreen').addEventListener('pointerdown', () => {
		// End the game and go to the score screen
		setTimeout(() => {
			Materia.Engine.end();
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const resultsModal = document.getElementById('resultsModal');
	dragElement(resultsModal);
});

Materia.Engine.start({
	start: (instance, qset, qsetVersion) => {
		showAnswersBoolean = instance.qset.data.showAnswers;

		const title = instance.name
		const TitleElement = document.getElementById('Title')
		TitleElement.innerHTML = title

		const modalH1 = document.getElementById('welcomeModalTitle')
		modalH1.textContent = title

		livesConstant = qset.options.lives ?? 1
		setupGame(qset)
	},
});
