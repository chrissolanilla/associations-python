import './player.scss';

// Modal code
const closeButton = document.querySelector("[data-close-modal]");
const modal = document.querySelector("[data-modal]");
modal.showModal();
closeButton.addEventListener("click", () => {
	modal.close();
});
//we need to randomize the words
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function setupGame(qset) {
	console.log("Setting up game with qset:", qset); // it shows the qset?
	if (!qset || !qset.words1) {
		console.error('Invalid qset data', qset);
		return;
	}
	
	const wordsGrid = document.querySelector('.wordsPreview');
	const allWords = [
		...qset.words1,
		...qset.words2,
		...qset.words3,
		...qset.words4
	];
	const descriptions = [
		qset.description1,
		qset.description2,
		qset.description3,
		qset.description4
	];
	//cheeky shuffle call
	const shuffledWords = shuffleArray(allWords);
	//sometimes it bugs so this is just in case
	wordsGrid.innerHTML = '';
	//fill in the grid with words
	shuffledWords.forEach((word, index) => {
		const wordElement = document.createElement('div');
		wordElement.className = 'previewItem';
		wordElement.textContent = word;
		wordElement.addEventListener('click', () => selectWord(word, descriptions, qset));
		wordsGrid.appendChild(wordElement);
	});
}

let selectedWords = [];

function selectWord(word, descriptions, qset) {
	const wordIndex = selectedWords.indexOf(word);
	if (wordIndex > -1) {
		// Deselect word
		selectedWords.splice(wordIndex, 1);
	} else if (selectedWords.length < 4) {
		// Select word
		selectedWords.push(word);
	}
	console.log('Selected Words:', selectedWords);
	if (selectedWords.length === 4) {
		checkSelection(descriptions, qset);
	}
}
//makes the words connected to the descriptions
function checkSelection(descriptions, qset) {
	const groups = [
		selectedWords.filter(word => qset.words1.includes(word)),
		selectedWords.filter(word => qset.words2.includes(word)),
		selectedWords.filter(word => qset.words3.includes(word)),
		selectedWords.filter(word => qset.words4.includes(word))
	];
	let found = false;
	groups.forEach((group, index) => {
		if (group.length === 4) {
			//TODO
			//we do not want an alert in the future
			alert(`Correct! Description: ${descriptions[index]}`);
			found = true;
		}
	});
	if (!found) {
		alert('Incorrect. Try again.');
	}
	selectedWords = [];
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
//i am not sure if this even works for the creator
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
