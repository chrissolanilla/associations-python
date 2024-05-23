import './player.scss';

// modal code
const closeButton = document.querySelector("[data-close-modal]");
const modal = document.querySelector("[data-modal]");
modal.showModal();
closeButton.addEventListener("click", () => {
	modal.close();
});

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

let currentDescriptions = [];
let currentQset = {};

function setupGame(qset) {
	console.log("Setting up game with qset:", qset);
	if (!qset || !qset.words1) {
		console.error('Invalid qset data', qset);
		return;
	}

	currentQset = qset; // update the current qset
	currentDescriptions = [
		qset.description1,
		qset.description2,
		qset.description3,
		qset.description4
	];

	const wordsGrid = document.querySelector('.wordsPreview');
	const allWords = [
		...qset.words1,
		...qset.words2,
		...qset.words3,
		...qset.words4
	];
	const shuffledWords = shuffleArray(allWords);
	wordsGrid.innerHTML = '';
	shuffledWords.forEach((word, index) => {
		const wordElement = document.createElement('div');
		wordElement.className = 'previewItem';
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = `word${index}`;
		const label = document.createElement('label');
		label.htmlFor = `word${index}`;
		label.textContent = word;
		wordElement.appendChild(checkbox);
		wordElement.appendChild(label);
		wordsGrid.appendChild(wordElement);

		checkbox.addEventListener('change', () => {
			selectWord(word, wordElement, checkbox);
		});
	});
}

let selectedWords = [];

function selectWord(word, wordElement, checkbox) {
	const wordIndex = selectedWords.indexOf(word);
	if (wordIndex > -1) {
		// deselect word
		selectedWords.splice(wordIndex, 1);
	} else if (selectedWords.length < 16) {
		// select word
		selectedWords.push(word);
	}
	console.log('Selected Words:', selectedWords);
	updateSelectionStyles();
}

function updateSelectionStyles() {
	const wordsGrid = document.querySelector('.wordsPreview');
	wordsGrid.querySelectorAll('.previewItem').forEach(item => {
		item.classList.remove('selected-4', 'selected-8', 'selected-12', 'selected-16');
	});
	selectedWords.forEach((word, index) => {
		const checkbox = [...document.querySelectorAll('.previewItem input[type="checkbox"]')]
			.find(input => input.nextElementSibling.textContent === word);
		const item = checkbox.parentNode;
		if (index < 4) item.classList.add('selected-4');
		else if (index < 8) item.classList.add('selected-8');
		else if (index < 12) item.classList.add('selected-12');
		else item.classList.add('selected-16');
	});
}

function checkSelection(count) {
    const groups = [
        selectedWords.filter(word => currentQset.words1.includes(word)),
        selectedWords.filter(word => currentQset.words2.includes(word)),
        selectedWords.filter(word => currentQset.words3.includes(word)),
        selectedWords.filter(word => currentQset.words4.includes(word))
    ];
    let foundCount = 0;
    groups.forEach((group, index) => {
        if (group.length === 4) {
            alert(`Correct! Description: ${currentDescriptions[index]}`);
            foundCount += 4;
        }
    });
    if (foundCount === count) {
        alert('All selected groups are correct!');
    } else {
        alert('Incorrect. Try again.');
    }
    selectedWords = [];
    document.querySelectorAll('.previewItem input[type="checkbox"]:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectionStyles();
}


function fetchDemoData() {
	fetch('demo.json') 
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			console.log('Fetched demo data:', data);
			setupGame(data.qset);
		})
		.catch(error => {
			console.error('Error loading demo data:', error);
		});
}

Materia.Engine.start({
	start: (instance, qset, qsetVersion) => {
		console.log('Starting game with qset:', qset);
		if (qset) {
			setupGame(qset);
		} else {
			fetchDemoData();
		}
	}
});

// Add event listeners for check buttons
document.getElementById('check4').addEventListener('click', () => checkSelection(4));
document.getElementById('check8').addEventListener('click', () => checkSelection(8));
document.getElementById('check12').addEventListener('click', () => checkSelection(12));
document.getElementById('check16').addEventListener('click', () => checkSelection(16));
