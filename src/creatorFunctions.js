/** @type {Object} */
export let widgetState = {
	words1: [],
	words2: [],
	words3: [],
	words4: [],
	words5: [],
	words6: [],
	description1: '',
	description2: '',
	description3: '',
	description4: '',
	description5: '',
	description6: '',
	dimensionX: 4,
	dimensionY: 4,
	_title: '',
	_qset: {},
	showAnswers: false,
	lives: 1,
};

/** @type {Object} */
export let savedWidgetState = {
	words1: [],
	words2: [],
	words3: [],
	words4: [],
	words5: [],
	words6: [],
	description1: '',
	description2: '',
	description3: '',
	description4: '',
	description5: '',
	description6: '',
};

/** @type {Set} wordSet
 * @type {Set} descriptionSet */
export let wordSet = new Set();
export let descriptionSet = new Set();

/** @type {Array<Array<string>>} */
export const placeholders = [
	[
		'Cell Organelles',
		'Nucleus',
		'Mitochondria',
		'Ribosome',
		'Lysosome',
		'Cell Wall',
	],

	[
		'Natural Earth',
		'Sahara Desert',
		'Amazon Rainforest',
		'Himalayas',
		'Great Barrier Reef',
		'Mount Everest',
	],

	[
		'Cyber Security',
		'Firewall',
		'Pentesting',
		'Zero Day',
		'VPN',
		'Wireshark',
	],

	[
		'Historical Events',
		'Civil Rights Movement',
		'Berlin Wall',
		'Signing of the Magna Carta',
		'Declaration of Independence',
		'World War II',
	],

	[
		'Famous Scientists',
		'Einstein',
		'Galileo',
		'Tesla',
		'Oppenheimer',
		'Maxwell',
	],

	['Units of Measurement', 'Newton', 'Joule', 'Watt', 'Pascal', 'Meter'],
];

export function updateGameName() {
	const gamename1 = document.getElementById('GameName').value;
	const gamename2 = document.getElementById('GameName2').value;
	if (gamename1 === '') {
		widgetState._title = gamename2;
	} else {
		widgetState._title = gamename1;
	}
}

export function updatePreview() {
	const allWords = [];
	for (let i = 1; i <= widgetState.dimensionY; i++) {
		const words = widgetState[`words${i}`];
		allWords.push(...words);
	}

	const previewItems = document.querySelectorAll('.previewItem');
	previewItems.forEach((item, index) => {
		item.textContent = allWords[index] || '';
	});
}

export function createDynamicInputs() {
	const colors = ['Pink', 'Blue', 'Green', 'Tan', 'Grey', 'Yellow'];

	const dynamicInputs = document.getElementById('dynamicInputs');
	if (!dynamicInputs) return;
	dynamicInputs.classList.add('show');
	dynamicInputs.innerHTML = ''; // Clear previous inputs
	updateSets();

	for (let j = 0; j < widgetState.dimensionY; j++) {
		const inputContainer = document.createElement('div');
		inputContainer.classList.add('CreatorKVP', colors[j]);

		const creatorAnswersDiv = document.createElement('div');
		console.log(`created creatorAnswersDiv with id ${creatorAnswersDiv.id}`);
		creatorAnswersDiv.classList.add('CreatorAnswers');

		const descriptionInput = document.createElement('input');
		descriptionInput.type = 'text';
		descriptionInput.name = `Description${j + 1}`;
		descriptionInput.id = `Description${j + 1}`;
		descriptionInput.required = true;
		descriptionInput.placeholder = `Category description, e.g., ${placeholders[j][0]}`;
		descriptionInput.value = savedWidgetState[`description${j + 1}`] || '';

		descriptionInput.classList.add('dInput');
		descriptionInput.classList.add('hvr-bounce-to-right');
		descriptionInput.addEventListener('input', () => {
			updateDescriptionState(j + 1, descriptionInput.value);

			if (
				descriptionInput.value.trim() !== '' &&
				!descriptionSet.has(descriptionInput.value.trim())
			) {
				descriptionInput.classList.add('valid');
				descriptionInput.classList.remove('invalid');
			} //
			else {
				descriptionInput.classList.remove('valid');
				descriptionInput.classList.add('invalid');
			}
			//update the hash map
			updateSets();
		});
		creatorAnswersDiv.appendChild(descriptionInput);

		const wordsGrid = document.createElement('div');
		wordsGrid.classList.add('wordsGrid');
		wordsGrid.style.gridTemplateColumns = `repeat(${widgetState.dimensionX}, 1fr)`;

		for (let i = 0; i < widgetState.dimensionX; i++) {
			const wordCell = document.createElement('div');
			wordCell.classList.add('previewItem');
			wordCell.id = `Word${j + 1}-${i + 1}`;

			const wordInput = document.createElement('input');
			const duplicateWarning = document.createElement('p');
			duplicateWarning.textContent = 'Please do not use duplicate words';
			duplicateWarning.classList.add('hidden');
			duplicateWarning.classList.add('commaWarning');
			wordInput.type = 'text';
			wordInput.classList.add('grid-input');
			wordInput.name = `Word${j + 1}-${i + 1}`;
			wordInput.id = `Word${j + 1}-${i + 1}`;
			wordInput.required = true;
			wordInput.placeholder = placeholders[j][i];
			wordInput.value = widgetState[`words${j + 1}`][i] || '';
			wordCell.appendChild(wordInput);
			wordCell.appendChild(duplicateWarning);
			const wordParent = wordInput.parentNode;

			wordInput.addEventListener('input', () => {
				if (wordParent) {
					const trimmedValue = wordInput.value.trim();

					//check if our word is a duplicate but not on ourselve
					const isDuplicate = [...wordSet].some(
						(word) =>
							word === trimmedValue &&
							word !== widgetState[`words${j + 1}`][i],
					);

					if (trimmedValue !== '' && !isDuplicate) {
						wordParent.classList.add('valid');
						wordParent.classList.remove('invalid');
						duplicateWarning.classList.add('hidden');
					} else {
						wordParent.classList.remove('valid');
						wordParent.classList.add('invalid');
						duplicateWarning.classList.remove('hidden');
					}
					if (!isDuplicate) {
						duplicateWarning.classList.add('hidden');
					}
				}

				const finalValue = wordInput.value.trim();

				if (!wordSet.has(finalValue)) {
					wordSet.add(finalValue);
					wordInput.value = finalValue;
					updateWidgetState(j + 1, i + 1, wordInput.value.trim());
				}
				updateSets();
			});

			wordsGrid.appendChild(wordCell);
		}

		creatorAnswersDiv.appendChild(wordsGrid);
		console.log(`appenindg creatorAnswersDiv to wordsGrid`);
		inputContainer.appendChild(creatorAnswersDiv);
		console.log(`appeing creatorAnswersDiv to inputContainer`);
		dynamicInputs.appendChild(inputContainer);
		console.log(`appening inputs to dynamicInputs`);
	}
}

function updateSets() {
	wordSet.clear();
	descriptionSet.clear();

	for (let i = 1; i <= 6; i++) {
		widgetState[`words${i}`].forEach((word) => wordSet.add(word.trim()));
		descriptionSet.add(savedWidgetState[`description${i}`].trim());
	}
	console.log('WORDSET', wordSet);
	console.log('DESCRIPTIONSET', descriptionSet);
}

function updateWidgetState(group, position, value) {
	widgetState[`words${group}`][position - 1] = value.trim();
	console.log(
		`Updated widgetState.words${group}:`,
		widgetState[`words${group}`],
	);
	updateSets();
}

function updateDescriptionState(group, value) {
	savedWidgetState[`description${group}`] = value;
	console.log(
		`Updated widgetState.description${group}:`,
		savedWidgetState[`description${group}`],
	);
}

export function trunkcadeWords(widgetState, savedWidgetState) {
	const trunkcateArray = (words, x) => words.slice(0, x);
	for (let i = 1; i <= 6; i++) {
		savedWidgetState[`words${i}`] = trunkcateArray(
			widgetState[`words${i}`],
			parseInt(widgetState.dimensionX),
		);
	}
}

export function flashInvalidInputs() {
	// Flashing effect for any element with an invalid class
	const descriptionInputs = document.querySelectorAll('.invalid');
	descriptionInputs.forEach((input) => {
		input.classList.add('flash-red');
		setTimeout(() => {
			input.classList.remove('flash-red');
		}, 1000);
	});
}

export function highlightGrid(rows, cols) {
	const cells = DimensionContainer.querySelectorAll('.cell');
	cells.forEach((cell) => {
		const cellRow = cell.dataset.row;
		const cellCol = cell.dataset.col;
		if (cellRow <= rows && cellCol <= cols) {
			cell.classList.remove('cellbg');
			cell.classList.add('hovered');
		} else {
			cell.classList.remove('hovered');
			cell.classList.add('cellbg');
		}
	});
}

/**
 * @param {Element} modal
 * @param {Object} widgetState
 * @param {number} finalCol
 * @param {number} finalRow
 * @param {Function} highlightGrid
 * @param {Function} createDynamicInputs
 * @param {Function} showToast
 */
export function addKeydownEventListener(
	modal,
	widgetState,
	finalCol,
	finalRow,
	highlightGrid,
	createDynamicInputs,
	showToast,
) {
	const status1 = document.getElementById('DimensionStatus');
	const status2 = document.getElementById('DimensionStatus2');

	document.addEventListener('keydown', (event) => {
		if (modal.hasAttribute('open')) {
			// ensure widgetState values are numbers cause im traumatized of javascript addition
			widgetState.dimensionX = +widgetState.dimensionX;
			widgetState.dimensionY = +widgetState.dimensionY;

			if (event.key === 'ArrowLeft') {
				if (widgetState.dimensionX > 1) {
					const row = widgetState.dimensionX - 1;
					finalCol = row;
					widgetState.dimensionX = Math.max(1, row);
					highlightGrid(widgetState.dimensionY, row);
				}
			} //
			else if (event.key === 'ArrowRight') {
				if (widgetState.dimensionX < 6) {
					const row = widgetState.dimensionX + 1;
					finalCol = row;
					widgetState.dimensionX = Math.min(6, row);
					highlightGrid(widgetState.dimensionY, row);
				}
			} //
			else if (event.key == 'ArrowUp') {
				if (widgetState.dimensionY > 1) {
					const col = widgetState.dimensionY - 1;
					finalRow = col;
					widgetState.dimensionY = Math.max(1, col);
					highlightGrid(col, widgetState.dimensionX);
				}
			} //
			else if (event.key === 'ArrowDown') {
				if (widgetState.dimensionY < 6) {
					const col = widgetState.dimensionY + 1;
					finalRow = col;
					widgetState.dimensionY = Math.min(6, col);
					highlightGrid(col, widgetState.dimensionX);
				}
			} //
			else if (event.key === 'Enter') {
				if (
					widgetState.dimensionX <= 1 ||
					widgetState.dimensionY <= 1
				) {
					showToast('The grid must be at least 2x2', 'error');
				} else {
					console.log('WE ARE IN THE ELSSE FROZEN');
					event.preventDefault();
					modal.close();
					modal.classList.add('hidden');
					if (
						widgetState.dimensionX <= 6 &&
						widgetState.dimensionY <= 6
					) {
						console.log("WE ARE CALLING TEH FUNCTION");
						createDynamicInputs();
					}
				}
			}
		}
		status1.textContent = `${finalCol} x ${finalRow}`;
		status2.textContent = `${finalCol} x ${finalRow}`;
	});
}
