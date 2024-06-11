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
  _title: "",
  _qset: {},
};
console.log(widgetState._title);
function updateGameName() {
  widgetState._title = document.getElementById("GameName").value;
}
function updatePreview() {
  //get the words from the input seperated by comma
  widgetState.words1 = document
    .getElementById("Words1")
    .value.split(",")
    .map((word) => word.trim());
  widgetState.words2 = document
    .getElementById("Words2")
    .value.split(",")
    .map((word) => word.trim());
  widgetState.words3 = document
    .getElementById("Words3")
    .value.split(",")
    .map((word) => word.trim());
  widgetState.words4 = document
    .getElementById("Words4")
    .value.split(",")
    .map((word) => word.trim());

  const allWords = [
    ...widgetState.words1,
    ...widgetState.words2,
    ...widgetState.words3,
    ...widgetState.words4,
  ].filter((word) => word);

  const previewItems = document.querySelectorAll(".previewItem");
  //update the item divs live
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

Materia.CreatorCore.start({
  initNewWidget: (widget, baseUrl, mediaUrl) => {
    // Setup for a new widget
  },
  initExistingWidget: (widget, title, qset, qsetVersion, baseUrl, mediaUrl) => {
    widgetState._qset = qset;
    console.log("title beofre is", title);
    title = widgetState._title;
    console.log("title after is", title);
    // Populate existing words and descriptions if editing
    document.getElementById("Words1").value =
      qset.data.items[0].answers[0].text;
    document.getElementById("Words2").value =
      qset.data.items[1].answers[0].text;
    document.getElementById("Words3").value =
      qset.data.items[2].answers[0].text;
    document.getElementById("Words4").value =
      qset.data.items[3].answers[0].text;

    document.getElementById("Description1").value =
      qset.data.items[0].questions[0].text;
    document.getElementById("Description2").value =
      qset.data.items[1].questions[0].text;
    document.getElementById("Description3").value =
      qset.data.items[2].questions[0].text;
    document.getElementById("Description4").value =
      qset.data.items[3].questions[0].text;

    // Update internal state
    widgetState.words1 = qset.data.items[0].answers[0].text
      .split(",")
      .map((word) => word.trim());
    widgetState.words2 = qset.data.items[1].answers[0].text
      .split(",")
      .map((word) => word.trim());
    widgetState.words3 = qset.data.items[2].answers[0].text
      .split(",")
      .map((word) => word.trim());
    widgetState.words4 = qset.data.items[3].answers[0].text
      .split(",")
      .map((word) => word.trim());

    widgetState.description1 = qset.data.items[0].questions[0].text;
    widgetState.description2 = qset.data.items[1].questions[0].text;
    widgetState.description3 = qset.data.items[2].questions[0].text;
    widgetState.description4 = qset.data.items[3].questions[0].text;
    updatePreview();
  },
  onSaveClicked: (mode = "save") => {
    // Save widget data
    const qset = {
      qset: {
        name: widgetState._title,
        version: 1,
        data: {
          items: [
            {
              materiaType: "question",
              type: "connections",
              id: null,
              questions: [{ text: widgetState.description1 }],
              answers: [{ text: widgetState.words1.join(","), value: 25 }],
            },
            {
              materiaType: "question",
              type: "connections",
              id: null,
              questions: [{ text: widgetState.description2 }],
              answers: [{ text: widgetState.words2.join(","), value: 25 }],
            },
            {
              materiaType: "question",
              type: "connections",
              id: null,
              questions: [{ text: widgetState.description3 }],
              answers: [{ text: widgetState.words3.join(","), value: 25 }],
            },
            {
              materiaType: "question",
              type: "connections",
              id: null,
              questions: [{ text: widgetState.description4 }],
              answers: [{ text: widgetState.words4.join(","), value: 25 }],
            },
          ],
        },
      },
    };
    console.log(qset);
    console.log(widgetState._title);
    Materia.CreatorCore.save(widgetState._title, qset.qset.data);
  },
});
