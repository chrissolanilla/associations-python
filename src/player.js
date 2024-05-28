import './player.scss';

// Modal code
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
// Variables to keep track of the score
let percentScore=0, attempts=0, scoreCount =0;
const AttemptsElement = document.getElementById("Attempts");
AttemptsElement.innerHTML = attempts;
const maxAttempts = 4; // Probably make this changable for the creator at some point later

function setupGame(qset) {
	console.log("Setting up game with qset:", qset);
	if (!qset || !qset.words1) {
		console.error('Invalid qset data', qset);
		return;
	}

	currentQset = qset; // Update the current qset
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
		// Deselect word
		selectedWords.splice(wordIndex, 1);
	} else if (selectedWords.length < 16) {
		// Select word
		selectedWords.push(word);
	}
	console.log('Selected Words:', selectedWords);
	updateSelectionStyles();
}

// This reduces a lot of redundant code in update selection styles
function updateButtonStyles(buttonId, isEnabled) {
	const button = document.getElementById(buttonId);
	if (isEnabled) {
		button.classList.remove('greyOutButton');
		button.classList.add('styled-button');
	} else {
		button.classList.remove('styled-button');
		button.classList.add('greyOutButton');
	}
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

	const selectionCount = selectedWords.length;
	updateButtonStyles('check4', selectionCount === 4);
	updateButtonStyles('check8', selectionCount === 8);
	updateButtonStyles('check12', selectionCount === 12);
	updateButtonStyles('check16', selectionCount === 16);
}
//need this to keep track of guessed words correctly
const guessedWordsSet = new Set();

//this function refactors and reduces code for check selection and show remaining
function createAnswerDiv(description, group, className) {
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('AnswerDivBackground', className);

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

function checkSelection(count) {
    const wordsGrid = document.querySelector('.wordsPreview');
    const correctAnswersDiv = document.getElementById('correctAnswers'); 
    const groups = [
        selectedWords.filter(word => currentQset.words1.includes(word)),
        selectedWords.filter(word => currentQset.words2.includes(word)),
        selectedWords.filter(word => currentQset.words3.includes(word)),
        selectedWords.filter(word => currentQset.words4.includes(word))
    ];
    let foundCount = 0;
    groups.forEach((group, index) => {
        if (group.length === 4) {
            foundCount += 4;
            percentScore += 100 / 4; // Make each correct guess worth 25 points
			scoreCount++;
			//guessedWordsSet.add(word);
            const className = `selected-${(index + 1) * 4}`;
            const answerDiv = createAnswerDiv(currentDescriptions[index], group, className);
            correctAnswersDiv.appendChild(answerDiv);

            group.forEach(word => {
                const checkbox = [...document.querySelectorAll('.previewItem input[type="checkbox"]')]
                    .find(input => input.nextElementSibling.textContent === word);
                const item = checkbox.parentNode;
                wordsGrid.removeChild(item);
            });
        }
		if(scoreCount >=4){
			disableGame();
		}
    });
    if (foundCount === count) {
        // Do nothing if all selected groups are correct
    } else {
        attempts++;
        AttemptsElement.innerHTML = attempts;
        document.getElementById('check4').classList.remove('styled-button');
        document.getElementById('check8').classList.remove('styled-button');
        document.getElementById('check12').classList.remove('styled-button');
        document.getElementById('check16').classList.remove('styled-button');
        
        if (attempts >= maxAttempts) {
            alert("Game over, max attempts reached\nYou had "+scoreCount+ "right");
            showRemainingCorrectAnswers();
            disableGame();
        }
    }
    selectedWords = [];
    document.querySelectorAll('.previewItem input[type="checkbox"]:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectionStyles();
}

function showRemainingCorrectAnswers() {
    const wordsGrid = document.querySelector('.wordsPreview');
    const correctAnswersDiv = document.getElementById('correctAnswers');
    
    const alreadyGuessedWords = Array.from(correctAnswersDiv.querySelectorAll('.AnswerDivBackground div div'))
        .map(div => div.textContent.split(', ')).flat();

    const groupWords = [
        currentQset.words1.filter(word => !alreadyGuessedWords.includes(word)),
        currentQset.words2.filter(word => !alreadyGuessedWords.includes(word)),
        currentQset.words3.filter(word => !alreadyGuessedWords.includes(word)),
        currentQset.words4.filter(word => !alreadyGuessedWords.includes(word))
    ];

    const groupNames = ["selected-4", "selected-8", "selected-12", "selected-16"];

    groupWords.forEach((group, index) => {
        if (group.length > 0) {
            const className = groupNames[index];
            // Check if the element with the class already exists
            if (!correctAnswersDiv.querySelector(`.${className}`)) {
                const answerDiv = createAnswerDiv(currentDescriptions[index], group, className);
                correctAnswersDiv.appendChild(answerDiv);
            }
        }
    });

    wordsGrid.innerHTML = '';
}


function disableGame() {
	const wordsGrid = document.querySelector('.wordsPreview');
	wordsGrid.querySelectorAll('.previewItem input[type="checkbox"]').forEach(checkbox => {
		checkbox.disabled = true;
	});
	//get the modal and show the results
    const resultsModal = document.getElementById('resultsModal');
    const finalResults = document.getElementById('finalResults');
    finalResults.innerHTML = `
        <p>Correct Selections: ${scoreCount}</p>
        <p>Wrong Attempts: ${attempts}</p>
		<p>Grade : ${percentScore} </p>
    `;
    showRemainingCorrectAnswers();
    // Show the modal for the final score
    resultsModal.showModal();
	console.log(percentScore);
	document.getElementById("goToScoreScreen").addEventListener("click",() => {
		//submit the final score and tell materia to end the game
		//TODO do not use submitFinalScore function, use the submit question for scoring and have the backend score 
		//each question individually but still have the frontend fake it
		Materia.Score.submitFinalScoreFromClient(0, '', percentScore);
		Materia.Engine.end();

	});
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
