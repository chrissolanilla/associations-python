import "./player.scss";
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
} from "./FunctionsPlayer";

// Modal code
const closeButton = document.querySelector("[data-close-modal]");
const modal = document.querySelector("[data-modal]");
modal.showModal();
closeButton.addEventListener("click", () => {
  modal.close();
});

// Variables to keep track of the score
let percentScore = 0,
  attempts = 0,
  scoreCount = 0;

const AttemptsElement = document.getElementById("Attempts");
AttemptsElement.innerHTML = attempts;
let maxAttempts = 4;

function setupGame(qset) {
  console.log("Setting up game with qset:", qset);
  if (!qset || !qset.items) {
    console.error("Invalid qset data", qset);
    return;
  }

  setCurrentQset(qset); // Set the currentQset
  resetGuessedGroups(); // Reset guessedGroups
  resetSelectedWords(); // Reset selectedWords
  // Get currentQset for logging
  console.log("currentQset is: ", getCurrentQset());

  const descriptions = qset.items.map((item) => item.questions[0].text); // Extract descriptions
  console.log("Descriptions:", descriptions);
  const questionIds = qset.items.map((item) => item.id); // Extract the ID so we can match them in the PHP
  const wordsGrid = document.querySelector(".wordsPreview");
  const allWords = qset.items.flatMap((item) =>
    item.answers[0].text.split(","),
  ); // Extract individual words from the concatenated answer strings
  console.log("All words:", allWords);
  const shuffledWords = shuffleArray(allWords);
  wordsGrid.innerHTML = "";
  //create the checkboxes
  shuffledWords.forEach((word, index) => {
    const wordElement = document.createElement("div");
    wordElement.className = "previewItem";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `word${index}`;
    const label = document.createElement("label");
    label.htmlFor = `word${index}`;
    label.textContent = word;
    wordElement.appendChild(checkbox);
    wordElement.appendChild(label);
    wordsGrid.appendChild(wordElement);

    checkbox.addEventListener("change", () => {
      selectWord(word, wordElement, checkbox);
    });
  });
  // Adjust maxAttempts based on the number of items
  maxAttempts = qset.items.length;
  AttemptsElement.innerHTML = attempts;
}

function checkSelection(count) {
  const wordsGrid = document.querySelector(".wordsPreview");
  const correctAnswersDiv = document.getElementById("correctAnswers");
  let validGroupsCount = 0;
  let validWordsCount = 0;
  console.log("starting to check selection");

  // Track groups that should be removed
  let groupsToRemove = [];

  // Process selected words in groups of four
  const selectedWords = getSelectedWords().map((word) => word.trim());
  const currentQset = getCurrentQset();
  console.log("current qset in checkSelection is: ", currentQset);

  for (let i = 0; i < selectedWords.length; i += 4) {
    console.log("inside the for loop");
    const currentGroup = selectedWords.slice(i, i + 4).sort();
    console.log(" current group is: ", currentGroup);
    let groupFound = false;

    currentQset.items.forEach((item, index) => {
      if (getGuessedGroups().has(item.questions[0].text)) {
        return; // Skip already guessed groups
      }

      console.log("checking inside a for each loop of currentQsetItems");

      const answerWords = item.answers[0].text
        .split(",")
        .map((word) => word.trim());
      console.log("answer words: ", answerWords);

      const group = currentGroup.filter((word) => answerWords.includes(word));
      console.log("group const after doing currentGroup filter is: ", group);

      if (group.length === 4) {
        const guessedGroups = getGuessedGroups();
        guessedGroups.add(item.questions[0].text); // Add description to guessed set
        setGuessedGroups(guessedGroups);

        console.log(item.questions[0].text);
        validGroupsCount++;
        validWordsCount += 4;
        console.log("valid groups count is ", validGroupsCount);

        const pointsPerCorrectGroup = 100 / currentQset.items.length; // Dynamic points allocation
        percentScore += pointsPerCorrectGroup;
        scoreCount++;
        console.log("Checking Groups again:" + group);

        // Submit the group as a single answer with the question ID and group of words
        Materia.Score.submitQuestionForScoring(
          item.id,
          group.join(","),
          pointsPerCorrectGroup,
        );

        const className = `selected-${(index + 1) * 4}`;
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

    if (!groupFound && currentGroup.length === 4) {
      const unguessedDescription = currentQset.items.find((item) => {
        return !getGuessedGroups().has(item.questions[0].text);
      });
      // if (unguessedDescription) {
      //   Materia.Score.submitQuestionForScoring(
      //     unguessedDescription.id,
      //     currentGroup.join(","),
      //     0,
      //   );
      // }
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
    console.log("you got the answer wrong somehow.");
    attempts++;
    AttemptsElement.innerHTML = attempts;
    document.getElementById("check4").classList.remove("styled-button");
    document.getElementById("check8").classList.remove("styled-button");
    document.getElementById("check12").classList.remove("styled-button");
    document.getElementById("check16").classList.remove("styled-button");

    if (attempts >= maxAttempts) {
      showRemainingCorrectAnswers();
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

  if (scoreCount >= maxAttempts) disableGame();
}

function showRemainingCorrectAnswers() {
  const wordsGrid = document.querySelector(".wordsPreview");
  const correctAnswersDiv = document.getElementById("correctAnswers");

  const alreadyGuessedWords = Array.from(
    correctAnswersDiv.querySelectorAll(".AnswerDivBackground div div"),
  )
    .map((div) => div.textContent.split(", "))
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
      // Check if the element with the class already exists
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

  wordsGrid.innerHTML = "";
}

function disableGame() {
  const wordsGrid = document.querySelector(".wordsPreview");
  const currentQset = getCurrentQset();

  const unguessedDescriptions = currentQset.items.filter((item) => {
    return !getGuessedGroups().has(item.questions[0].text);
  });

  unguessedDescriptions.forEach((item) => {
    console.log("sending this question for scoring:\n ", item.id);
    Materia.Score.submitQuestionForScoring(
      item.id,
      "Out of lives, Try again next time, best of luck, gg",
      0,
    );
  });

  wordsGrid
    .querySelectorAll('.previewItem input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.disabled = true;
    });
  //get the modal and show the results
  const resultsModal = document.getElementById("resultsModal");
  const finalResults = document.getElementById("finalResults");
  finalResults.innerHTML = `
        <p>Correct Selections: ${scoreCount}</p>
        <p>Wrong Attempts: ${attempts}</p>
        <p>Grade : ${percentScore} </p>
    `;
  showRemainingCorrectAnswers();
  // Show the modal for the final score
  resultsModal.showModal();
  console.log(percentScore);
  document.getElementById("goToScoreScreen").addEventListener("click", () => {
    // End the game and go to the score screen
    setTimeout(() => {
      Materia.Engine.end();
    });
  });
}

function fetchDemoData() {
  fetch("demo.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched demo data:", data);
      setupGame(data.qset.data);
    })
    .catch((error) => {
      console.error("Error loading demo data:", error);
    });
}

Materia.Engine.start({
  start: (instance, qset, qsetVersion) => {
    console.log("Starting game with qset:", qset);
    if (qset) {
      setupGame(qset);
    } else {
      fetchDemoData();
    }
  },
});

// Add event listeners for check buttons
document
  .getElementById("check4")
  .addEventListener("click", () => checkSelection(4));
document
  .getElementById("check8")
  .addEventListener("click", () => checkSelection(8));
document
  .getElementById("check12")
  .addEventListener("click", () => checkSelection(12));
document
  .getElementById("check16")
  .addEventListener("click", () => checkSelection(16));
