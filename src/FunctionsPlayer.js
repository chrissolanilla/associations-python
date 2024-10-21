let selectedWords = [];
let currentQset;
let guessedGroups = new Set();
let dimensionX = 0;
let dimensionY = 0;
let buttonIDs = '';
let correctGuesses = 0;

export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function setCurrentQset(qset) {
	currentQset = qset;
}

export function getCurrentQset() {
	return currentQset;
}

export function setDimensions(x, y) {
	dimensionX = x;
	dimensionY = y;
}

export function setSelectedWords(words) {
	selectedWords = words;
}

export function getSelectedWords() {
	console.log(`in the functin library selectedWords are ${selectedWords}`);
	return selectedWords;
}

export function setGuessedGroups(groups) {
	guessedGroups = groups;
}

export function setCorrectGuesses(count) {
	correctGuesses += count;
}

export function getGuessedGroups() {
	return guessedGroups;
}

export function resetSelectedWords() {
	selectedWords = [];
}

export function resetGuessedGroups() {
	guessedGroups = new Set();
}

export function addCurrentButtons(buttonId) {
	buttonIDs = buttonId;
}

export function updateButtonStyles(buttonId, isEnabled) {
	const button = document.getElementById(buttonId);
	if (isEnabled) {
		console.log('button is ', buttonId, 'and we are enabled');
		button.classList.remove('greyOutButton');
		button.classList.add('styled-button');
		button.setAttribute('tabindex', '0');
	} else {
		// console.log('button is ', buttonId);
		button.classList.remove('styled-button');
		button.classList.add('greyOutButton');
		button.setAttribute('tabindex', '-1');
	}
}

export function updateSelectionStyles() {
	const wordsGrid = document.querySelector('.wordsPreview');

	wordsGrid.querySelectorAll('.previewItem').forEach((item) => {
		item.classList.remove(
			'selected-4',
			'selected-8',
			'selected-12',
			'selected-16',
			'selected-20',
			'selected-24',
		);
	});

	selectedWords.forEach((word, index) => {
		const checkbox = [
			...document.querySelectorAll('.previewItem input[type="checkbox"]'),
		].find((input) => input.nextElementSibling.textContent === word);
		const item = checkbox.parentNode;
		console.log('The index is ', index);
		if (correctGuesses < 1) item.classList.add('selected-4');
		// if (index < dimensionX) item.classList.add('singleSelectionBlue');
		else if (correctGuesses < 2) item.classList.add('selected-8');
		else if (correctGuesses < 3) item.classList.add('selected-12');
		else if (correctGuesses < 4) item.classList.add('selected-16');
		else if (correctGuesses < 5) item.classList.add('selected-20');
		else item.classList.add('selected-24');
	});

	const selectionCount = selectedWords.length;
	//call the function dimensinoX times for the button ids that are dynamically created.
	let styleBool = false;
	if (selectionCount == dimensionX) {
		styleBool = true;
	} //
	else {
		console.log(
			`why is styleBool ${styleBool} when dimensionX is ${dimensionX} and selectionCount is ${selectionCount}`,
		);
	}
	updateButtonStyles(buttonIDs, styleBool);
	toggleCheckbox();
}

/** @param {string} description @param {Array<string>} group @param {string} className @param {boolean} override */
export function createAnswerDiv(description, group, className, override) {
	console.log('CREATING ANSWER DIV', description, group, className);
	const answerDiv = document.createElement('div');
	if (override) {
		console.log('continueing');
	} //
	else {
		if (correctGuesses === 1) {
			className = 'selected-4';
		} //
		else if (correctGuesses === 2) {
			className = 'selected-8';
		} //
		else if (correctGuesses === 3) {
			className = 'selected-12';
		} //
		else if (correctGuesses === 4) {
			className = 'selected-16';
		} //
		else if (correctGuesses === 5) {
			className = 'selected-20';
		} //
		else {
			className = 'selected-24';
		}
	}
	answerDiv.classList.add('AnswerDivBackground', className, 'answerDiv-grow');

	const strongDiv = document.createElement('div');
	const strongElement = document.createElement('strong');
	strongElement.textContent = description;
	strongDiv.appendChild(strongElement);

	const answerDivWords = document.createElement('div');
	answerDivWords.textContent = group.join(', ');

	answerDiv.appendChild(strongDiv);
	answerDiv.appendChild(answerDivWords);

	return answerDiv;
}

/** @param {Array<string>} array */
export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

/** @param {string} word */
export function selectWord(word) {
	const wordIndex = selectedWords.indexOf(word);
	if (wordIndex > -1) {
		// deselect word
		selectedWords.splice(wordIndex, 1);
	}
	//don't let them select more than X amonut of words sadly(i had a cool system b4)
	else if (selectedWords.length < dimensionX) {
		selectedWords.push(word);
	}
	console.log('Selected Words in function selectWord:', selectedWords);
	updateSelectionStyles();
	toggleCheckbox();
}

function toggleCheckbox() {
	const checkboxes = document.querySelectorAll(
		'.previewItem input[type="checkbox"]',
	);
	checkboxes.forEach((checkbox) => {
		if (!checkbox.checked && selectedWords.length >= dimensionX) {
			checkbox.disabled = true;
		} else {
			checkbox.disabled = false;
		}
	});
}

/** @param {string} message @param {string} type */
export function showToast(message, type) {
	const toastContainer = document.getElementById('toastContainer');
	setTimeout(() => {}, 500);
	toastContainer.classList.add('show');
	const toast = document.querySelector('.toast');
	toast.textContent = message;
	toast.className = 'toast';
	if (type === 'success') {
		toast.style.backgroundColor = 'green';
	} //
	else if (type === 'error') {
		toast.style.backgroundColor = 'red';
	}
	toast.style.display = 'none';
	console.log(toast.offsetHeight); // This forces a reflow and allows error messages to be read
	toast.style.display = 'block';
	//after 5 seconds get rid of the toast
	setTimeout(() => {
		toastContainer.classList.remove('show');
		toast.classList.add('hide');
	}, 5000);
}

/** @param {boolean} isCorrect */
export function animateSelectionToTop(isCorrect) {
	console.log('------THE BOOLEAN IS : ', isCorrect);
	const selectedWords = getSelectedWords();
	const wordsGrid = document.querySelector('.wordsPreview');

	selectedWords.forEach((word, index) => {
		const checkbox = [
			...document.querySelectorAll('.previewItem input[type="checkbox"]'),
		].find(
			(input) =>
				input.nextElementSibling.textContent.trim() === word.trim(),
		);

		if (checkbox) {
			const wordElement = checkbox.parentNode;
			setTimeout(
				() => {
					if (isCorrect) {
						wordElement.classList.add('correct-move');
					}
					else {
						wordElement.classList.add('incorrect-move');
					}
				},
				index * 100,
			);
			setTimeout(() => {
				// so we can see the animation again on these words if wrong
				wordElement.classList.remove('incorrect-move');
			}, 3000);
		} else {
			console.error(`Checkbox for word "${word.trim()}" not found`);
		}
	});

	setTimeout(() => {
		selectedWords.forEach((word) => {
			const checkbox = [
				...document.querySelectorAll(
					'.previewItem input[type="checkbox"]',
				),
			].find(
				(input) =>
					input.nextElementSibling.textContent.trim() === word.trim(),
			);

			if (checkbox && isCorrect) {
				const wordElement = checkbox.parentNode;
				wordsGrid.removeChild(wordElement);
			} else {
				console.error(`Checkbox for word "${word.trim()}" not found`);
			}
		});
	}, 2000);
}

/** @param {HTMLElement} elmnt */
export function dragElement(elmnt) {
	var pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	if (document.getElementById(elmnt.id + 'header')) {
		/* if present, the header is where you move the DIV from:*/
		document.getElementById(elmnt.id + 'header').onmousedown =
			dragMouseDown;
	} else {
		/* otherwise, move the DIV from anywhere inside the DIV:*/
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
		elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
	}

	function closeDragElement() {
		/* stop moving when mouse button is released:*/
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
