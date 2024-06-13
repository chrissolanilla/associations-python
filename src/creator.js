//needed for scss
import "./creator.scss";

let widgetState = {
  //right now hard code 4 groups of words and descriptions, maybe have it variable

  words1: [],
  words2: [],
  words3: [],
  words4: [],
  description1: "",
  description2: "",
  description3: "",
  description4: "",
  dimensionX: "0",
  dimensionY: "0",
  _title: "",
  _qset: {},
};
function updateGameName() {
  widgetState._title = document.getElementById("GameName").value;
}
function updatePreview() {
  const allWords = [];
  for (let i = 1; i <= widgetState.dimensionY; i++) {
    const words = document
      .getElementById(`Words${i}`)
      .value.split(",")
      .map((word) => word.trim());
    allWords.push(...words);
  }

  const previewItems = document.querySelectorAll(".previewItem");
  previewItems.forEach((item, index) => {
    item.textContent = allWords[index] || "";
  });
}
function updateDescription() {
  widgetState.description1 = document
    .getElementById("Description1")
    .value.trim();
  widgetState.description2 = document
    .getElementById("Description2")
    .value.trim();
  widgetState.description3 = document
    .getElementById("Description3")
    .value.trim();
  widgetState.description4 = document
    .getElementById("Description4")
    .value.trim();
}
//event listeners for the description and words input and the title too
document.querySelectorAll(".CreatorAnswers input").forEach((input) => {
  input.addEventListener("input", updatePreview);
});
document.querySelectorAll(".AnswerDescriptions input").forEach((input) => {
  input.addEventListener("input", updateDescription);
});
document.querySelectorAll(".GameNameInput input").forEach((input) => {
  input.addEventListener("input", updateGameName);
});
//tring out the cool grid mouse selector
const DimensionContainer = document.getElementById("DimensionContainer");
const DimensionStatusElement = document.getElementById("DimensionStatus");
// create the grid cells
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 6; j++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add("cellbg");
    cell.dataset.row = i + 1;
    cell.dataset.col = j + 1;
    DimensionContainer.appendChild(cell);
  }
}
//get the row and column of the mouse over
DimensionContainer.addEventListener("mouseover", (event) => {
  if (event.target.classList.contains("cell")) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    highlightGrid(row, col);
    DimensionStatusElement.textContent = `${col} x ${row}`;
  }
});
DimensionContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("cell")) {
    widgetState.dimensionX = event.target.dataset.col;
    widgetState.dimensionY = event.target.dataset.row;
    DimensionContainer.classList.add("hidden");
  }
});
DimensionContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("cell")) {
    widgetState.dimensionX = event.target.dataset.col;
    widgetState.dimensionY = event.target.dataset.row;
    DimensionContainer.classList.add("hidden");
    createDynamicInputs();
    createPreviewGrid();
  }
});
function highlightGrid(rows, cols) {
  const cells = DimensionContainer.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const cellRow = cell.dataset.row;
    const cellCol = cell.dataset.col;
    if (cellRow <= rows && cellCol <= cols) {
      cell.classList.remove("cellbg");
      cell.classList.add("hovered");
    } else {
      cell.classList.remove("hovered");
      cell.classList.add("cellbg");
    }
  });
}

function createDynamicInputs() {
  const colors = ["Blue", "Green", "Yellow", "Pink", "Tan", "Grey"];
  const dynamicInputs = document.getElementById("dynamicInputs");
  dynamicInputs.innerHTML = "";
  let i = 1;
  for (let j = 0; j < widgetState.dimensionX; j++) {
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("CreatorKVP", colors[j]);

    const creatorAnswersDiv = document.createElement("div");
    creatorAnswersDiv.classList.add("CreatorAnswers");
    const answerLabel = document.createElement("label");
    answerLabel.textContent = `Please enter ${widgetState.dimensionX} words (Comma-separated)`;
    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.name = `Words${i * widgetState.dimensionX + j + 1}`;
    answerInput.id = `Words${j + 1}`;
    console.log(answerInput.id);
    answerInput.oninput = updatePreview;

    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = `Please enter a Description that describes the words above`;
    const descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.name = `Description${i * widgetState.dimensionX + j + 1}`;
    descriptionInput.id = `Description${i * widgetState.dimensionX + j + 1}`;
    descriptionInput.oninput = updateDescription;
    creatorAnswersDiv.appendChild(answerLabel);
    creatorAnswersDiv.appendChild(answerInput);
    creatorAnswersDiv.appendChild(descriptionLabel);
    creatorAnswersDiv.appendChild(descriptionInput);
    inputContainer.appendChild(creatorAnswersDiv);
    dynamicInputs.appendChild(inputContainer);
  }
}
function createPreviewGrid() {
  const wordsPreview = document.getElementById("wordsPreview");
  if (wordsPreview === null) {
    console.log("no words preview");
  }
  // wordsPreview.innerHTML = ""; // Clear previous preview items

  const totalCells = widgetState.dimensionX * widgetState.dimensionY;
  console.log("total cells: ", totalCells);
  for (let i = 0; i < totalCells; i++) {
    const previewItem = document.createElement("div");
    previewItem.classList.add("previewItem");
    previewItem.id = `preview${i + 1}`;
    wordsPreview.appendChild(previewItem);
  }
}
//
// Materia.CreatorCore.start({
//   initNewWidget: (widget, baseUrl, mediaUrl) => {
//     // Setup for a new widget
//   },
//   initExistingWidget: (widget, title, qset, qsetVersion, baseUrl, mediaUrl) => {
//     widgetState._qset = qset;
//     console.log("title beofre is", title);
//     title = widgetState._title;
//     console.log("title after is", title);
//     // Populate existing words and descriptions if editing
//     document.getElementById("Words1").value =
//       qset.data.items[0].answers[0].text;
//     document.getElementById("Words2").value =
//       qset.data.items[1].answers[0].text;
//     document.getElementById("Words3").value =
//       qset.data.items[2].answers[0].text;
//     document.getElementById("Words4").value =
//       qset.data.items[3].answers[0].text;
//
//     document.getElementById("Description1").value =
//       qset.data.items[0].questions[0].text;
//     document.getElementById("Description2").value =
//       qset.data.items[1].questions[0].text;
//     document.getElementById("Description3").value =
//       qset.data.items[2].questions[0].text;
//     document.getElementById("Description4").value =
//       qset.data.items[3].questions[0].text;
//
//     // Update internal state
//     widgetState.words1 = qset.data.items[0].answers[0].text
//       .split(",")
//       .map((word) => word.trim());
//     widgetState.words2 = qset.data.items[1].answers[0].text
//       .split(",")
//       .map((word) => word.trim());
//     widgetState.words3 = qset.data.items[2].answers[0].text
//       .split(",")
//       .map((word) => word.trim());
//     widgetState.words4 = qset.data.items[3].answers[0].text
//       .split(",")
//       .map((word) => word.trim());
//
//     widgetState.description1 = qset.data.items[0].questions[0].text;
//     widgetState.description2 = qset.data.items[1].questions[0].text;
//     widgetState.description3 = qset.data.items[2].questions[0].text;
//     widgetState.description4 = qset.data.items[3].questions[0].text;
//     updatePreview();
//   },
//   onSaveClicked: (mode = "save") => {
//     // Save widget data
//     const qset = {
//       qset: {
//         name: widgetState._title,
//         version: 1,
//         data: {
//           items: [
//             {
//               materiaType: "question",
//               type: "connections",
//               id: null,
//               questions: [{ text: widgetState.description1 }],
//               answers: [{ text: widgetState.words1.join(","), value: 25 }],
//             },
//             {
//               materiaType: "question",
//               type: "connections",
//               id: null,
//               questions: [{ text: widgetState.description2 }],
//               answers: [{ text: widgetState.words2.join(","), value: 25 }],
//             },
//             {
//               materiaType: "question",
//               type: "connections",
//               id: null,
//               questions: [{ text: widgetState.description3 }],
//               answers: [{ text: widgetState.words3.join(","), value: 25 }],
//             },
//             {
//               materiaType: "question",
//               type: "connections",
//               id: null,
//               questions: [{ text: widgetState.description4 }],
//               answers: [{ text: widgetState.words4.join(","), value: 25 }],
//             },
//           ],
//         },
//       },
//     };
//     console.log(qset);
//     console.log(widgetState._title);
//     Materia.CreatorCore.save(widgetState._title, qset.qset.data);
//   },
// });
