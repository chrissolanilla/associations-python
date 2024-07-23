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
} from './FunctionsPlayer';
/** type object array comma separated list of words */
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

// Modal code
const closeButton = document.querySelector('[data-close-modal]');
const modal = document.querySelector('[data-modal]');
modal.showModal();
closeButton.addEventListener('click', () => {
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
  console.log('Setting up game with qset:', qset);
  if (!qset || !qset.items) {
    console.error('Invalid qset data', qset);
    return;
  }
  setCurrentQset(qset); // Set the currentQset
  resetGuessedGroups(); // Reset guessedGroups
  resetSelectedWords(); // Reset selectedWords
  // Get currentQset for logging
  console.log('currentQset is: ', getCurrentQset());
  //get the dimmensions of the qset
  const dimensionX = qset.items[0].answers[0].text.split(',').length;
  const dimensionY = qset.items.length;
  setDimensions(dimensionX, dimensionY);
  dimensionXGlobal = dimensionX;
  dimensionYGlobal = dimensionY;
  if (dimensionXGlobal >= dimensionYGlobal) {
    maxAttempts = dimensionX;
  } else {
    maxAttempts = dimensionYGlobal;
  }
  maxWrongAttemptsElement.textContent = `(${maxAttempts - attempts} left)`;
  instructionDescription.textContent = `Select words in groups of  ${dimensionXGlobal} that belong to a common category.`;
  const instructoinDescriptions2 =
    document.getElementById('instructionsModal2');
  instructoinDescriptions2.textContent = `Do this ${dimensionYGlobal} times to win!`;
  console.log('Dimensions are: ', dimensionX, dimensionY);

  const descriptions = qset.items.map((item) => item.questions[0].text); // Extract descriptions
  console.log('Descriptions:', descriptions);
  const wordsGrid = document.querySelector('.wordsPreview');
  //this styles it based on the x dimensions
  let columnString = '';
  for (let i = 0; i < dimensionX; i++) {
    columnString += '1fr ';
  }
  wordsGrid.style.gridTemplateColumns = columnString;
  const allWords = qset.items.flatMap((item) =>
    item.answers[0].text.split(','),
  ); // Extract individual words from the concatenated answer strings
  console.log('All words:', allWords);
  const shuffledWords = shuffleArray(allWords);

  const controlsElement = document.getElementById('controls');
  const attemptsSpan = document.getElementById('span');
  for (let i = 0; i < dimensionY; i++) {
    const button = document.createElement('button');
    const count = dimensionX * (i + 1);
    button.textContent = `Check ${count}`;
    button.id = `check${count}`;
    button.classList.add('greyOutButton');
    button.setAttribute(
      'aria-label',
      `Check your selection of ${count} words.`,
    );
    button.addEventListener('click', (event) => {
      if (!event.target.classList.contains('styled-button')) {
        event.preventDefault();
        return;
      }
      checkSelection(count);
    });
    //disable or hide the extra buttons
    if (i !== 0) {
      button.style.display = 'none';
    }
    // controlsElement.appendChild(button);
    controlsElement.insertBefore(button, attemptsSpan);
    //send this button to a list of buttons in the functions page.
    addCurrentButtons(button.id);
  }
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
    label.textContent = word;
    wordElement.appendChild(checkbox);
    wordElement.appendChild(label);
    wordsGrid.appendChild(wordElement);
    //dynamically create dimensionY number of buttons with text check {dimensionX}

    checkbox.addEventListener('change', () => {
      selectWord(word, wordElement, checkbox);
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
        console.log('KEY PRESS ENTER DETECTED');
        event.preventDefault();
        checkbox.click();
      }
    });
  });

  AttemptsElement.innerHTML = 'Wrong Attempts: ' + attempts;
  console.log('CHANGING THE REACTIVE CODE');
}

function checkSelection(count) {
  let highestGroupLength = 0;
  const wordsGrid = document.querySelector('.wordsPreview');
  const correctAnswersDiv = document.getElementById('correctAnswers');
  let validGroupsCount = 0;
  let validWordsCount = 0;
  // console.log("starting to check selection");
  // Track groups that should be removed
  let groupsToRemove = [];
  // Process selected words in groups of four
  const selectedWords = getSelectedWords().map((word) => word.trim());
  const currentQset = getCurrentQset();
  //refacotr things to be by dimensionX instead of 4
  for (let i = 0; i < selectedWords.length; i += dimensionXGlobal) {
    // console.log("inside the for loop");
    const currentGroup = selectedWords.slice(i, i + dimensionXGlobal).sort();
    // console.log(" current group is: ", currentGroup);
    let groupFound = false;

    currentQset.items.forEach((item, index) => {
      if (getGuessedGroups().has(item.questions[0].text)) {
        console.log('Skipping this group because it was already guessed');
        return; // Skip already guessed groups
      }
      const answerWords = item.answers[0].text
        .split(',')
        .map((word) => word.trim());
      // console.log("answer words: ", answerWords);
      const group = currentGroup.filter((word) => answerWords.includes(word));
      // console.log("group const after doing currentGroup filter is: ", group);
      if (group.length > highestGroupLength) {
        highestGroupLength = group.length;
        console.log('the item for this group is ', item);
      }
      //the item has all our data of what the question is and the answer.
      console.log('the index is ', index);
      console.log('Group length is ', highestGroupLength);
      if (group.length === dimensionXGlobal) {
        const guessedGroups = getGuessedGroups();
        guessedGroups.add(item.questions[0].text); // Add description to guessed set
        setGuessedGroups(guessedGroups);
        // console.log(item.questions[0].text);
        validGroupsCount++;
        validWordsCount += dimensionXGlobal;
        // console.log("valid groups count is ", validGroupsCount);
        const pointsPerCorrectGroup = 100 / currentQset.items.length; // Dynamic points allocation
        percentScore += pointsPerCorrectGroup;
        scoreCount++;
        showToast('Correct! Nice job!', 'success');
        //update the hidden screen reader element to tell them the answer audibly
        // Force DOM reflow by temporarily removing and re-adding the element

        setTimeout(() => {
          ScreenReaderElement.textContent =
            'Correct!' +
            item.questions[0].text +
            ' was the description for the group of words: ' +
            answerWords;
        }, 1000);
        console.log('Checking Groups again:' + group);
        // Submit the group as a single answer with the question ID and group of words
        Materia.Score.submitQuestionForScoring(
          item.id,
          group.join(','),
          pointsPerCorrectGroup,
        );
        //this may be weird to refactor
        //i made tan and grey 20 and 24, may be best not to touch this
        const className = `selected-${(index + 1) * 4}`;
        console.log('Giving the class name: ', className);
        const answerDiv = createAnswerDiv(
          item.questions[0].text,
          group,
          className,
        );
        correctAnswersDiv.appendChild(answerDiv);
        groupsToRemove.push(group);
        groupFound = true;
      }
    });

    if (!groupFound && currentGroup.length === dimensionXGlobal) {
      // const unguessedDescription = currentQset.items.find((item) => {
      //   return !getGuessedGroups().has(item.questions[0].text);
      // });
      // Find the correct index for the group
      currentQset.items.forEach((item, index) => {
        const answerWords = item.answers[0].text
          .split(',')
          .map((word) => word.trim());
        const group = currentGroup.filter((word) => answerWords.includes(word));
        if (group.length > 0) {
          guessedGroupsState[`group${index + 1}`] = currentGroup;
        }
      });
      console.log('DOES THIS RUN HAHAHAH');
    }
  }
  // Only remove words from valid groups
  groupsToRemove.forEach((group) => {
    group.forEach((word) => {
      const checkbox = [
        ...document.querySelectorAll('.previewItem input[type="checkbox"]'),
      ].find(
        (input) => input.nextElementSibling.textContent.trim() === word.trim(),
      );
      if (checkbox) {
        const item = checkbox.parentNode;
        wordsGrid.removeChild(item);
      }
    });
  });

  if (validWordsCount !== count) {
    console.log('you got the answer wrong somehow.');
    console.log('the valid words count was ', validWordsCount);
    if (highestGroupLength + 1 === dimensionXGlobal) {
      console.log('showing the toast');
      console.log('the highest group length was: ', highestGroupLength);
      showToast('one away...', 'error');
      //have it so that we say that we put this mark for this question
    } //
    else {
      showToast('Sorry, that was not correct', 'error');
    }
    attempts++;
    AttemptsElement.innerHTML = 'Wrong Attempts: ' + attempts;
    maxWrongAttemptsElement.innerHTML = `(${maxAttempts - attempts} left)`;
    for (let i = 1; i <= dimensionYGlobal; i++) {
      const btn = document.getElementById(`check${dimensionXGlobal * i}`);
      btn.classList.remove('styled-button');
    }
    if (attempts >= maxAttempts) {
      // showRemainingCorrectAnswers();
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
  console.log(
    'score count is: ',
    scoreCount,
    'dimensionYGlobal is: ',
    dimensionYGlobal,
  );
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
        );
        correctAnswersDiv.appendChild(answerDiv);
      }
    }
  });

  wordsGrid.innerHTML = '';
}

function disableGame() {
  const wordsGrid = document.querySelector('.wordsPreview');
  const currentQset = getCurrentQset();

  const unguessedDescriptions = currentQset.items.filter((item) => {
    return !getGuessedGroups().has(item.questions[0].text);
  });

  unguessedDescriptions.forEach((item, index) => {
    const incorrectGroup = guessedGroupsState[`group${index + 1}`].join(',');
    Materia.Score.submitQuestionForScoring(
      item.id,
      incorrectGroup || 'Ran out of Lives',
      0,
    );
    console.log(
      'Submitted question for scoring:',
      item.id,
      incorrectGroup || 'Ran out of Lives',
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
  } //
  else {
    // showRemainingCorrectAnswers();
    alert(
      `Your instructor has turned off the option to see correct answers for wrong
        questions you answered`,
    );
  }
  // Show the modal for the final score
  resultsModal.showModal();
  console.log(percentScore);
  document.getElementById('goToScoreScreen').addEventListener('click', () => {
    // End the game and go to the score screen
    setTimeout(() => {
      Materia.Engine.end();
    });
  });
}

Materia.Engine.start({
  start: (instance, qset, qsetVersion) => {
    console.log('Starting game with qset:', qset);
    console.log('The instance is:', instance.qset);
    showAnswersBoolean = instance.qset.data.showAnswers;
    console.log('the boolean of show answers boolean is ', showAnswersBoolean);

    if (qset.data) {
      //instace is the entire demo.json object, qset is only the items array
      const title = instance.name;
      const TitleElement = document.getElementById('Title');
      TitleElement.innerHTML = title;
      const modalH1 = document.getElementById('welcomeModalTitle');
      modalH1.textContent = 'Welcome to the ' + title + ' Game!';
      setupGame(qset.data);
    }
    //
    else {
      const title = instance.name;
      const TitleElement = document.getElementById('Title');
      TitleElement.innerHTML = title;
      const modalH1 = document.getElementById('welcomeModalTitle');
      modalH1.textContent = 'Welcome to the ' + title + ' Game!';
      setupGame(qset);
      console.error('No qset found.');
    }
  },
});

// Add event listeners for check buttons
