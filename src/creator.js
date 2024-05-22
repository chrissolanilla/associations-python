//needed for scss
import './creator.scss';

let widgetState = {
	//right now hard code 4 groups of words and descriptions, maybe have it variable
    words1: [],
    words2: [],
    words3: [],
    words4: [],
    description1: '',
    description2: '',
    description3: '',
    description4: ''
};
//event listeners for the description and words input
document.querySelectorAll('.CreatorAnswers input').forEach(input => {
	input.addEventListener('input', updatePreview);
});
document.querySelectorAll('.AnswerDescriptions input').forEach(input => {
	input.addEventListener('input', updateDescription);
});

function updatePreview() {
	//get the words from the input seperated by comma
    widgetState.words1 = document.getElementById('Words1').value.split(',').map(word => word.trim());
    widgetState.words2 = document.getElementById('Words2').value.split(',').map(word => word.trim());
    widgetState.words3 = document.getElementById('Words3').value.split(',').map(word => word.trim());
    widgetState.words4 = document.getElementById('Words4').value.split(',').map(word => word.trim());

    const allWords = [...widgetState.words1, ...widgetState.words2, ...widgetState.words3, ...widgetState.words4].filter(word => word);

    const previewItems = document.querySelectorAll('.previewItem');
	//update the item divs live
    previewItems.forEach((item, index) => {
        item.textContent = allWords[index] || '';
    });
}

function updateDescription() {
    widgetState.description1 = document.getElementById('Description1').value.trim();
    widgetState.description2 = document.getElementById('Description2').value.trim();
    widgetState.description3 = document.getElementById('Description3').value.trim();
    widgetState.description4 = document.getElementById('Description4').value.trim();
}

Materia.CreatorCore.start({
    initNewWidget: (widget, baseUrl, mediaUrl) => {
        // Setup for a new widget
    },
    initExistingWidget: (widget, title, qset, qsetVersion, baseUrl, mediaUrl) => {
        _title = title;
        _qset = qset;
        // Populate existing words and descriptions if editing
        document.getElementById('Words1').value = qset.data.words1.join(', ');
        document.getElementById('Words2').value = qset.data.words2.join(', ');
        document.getElementById('Words3').value = qset.data.words3.join(', ');
        document.getElementById('Words4').value = qset.data.words4.join(', ');

        document.getElementById('Description1').value = qset.data.description1;
        document.getElementById('Description2').value = qset.data.description2;
        document.getElementById('Description3').value = qset.data.description3;
        document.getElementById('Description4').value = qset.data.description4;

        // Update internal state
        widgetState.words1 = qset.data.words1;
        widgetState.words2 = qset.data.words2;
        widgetState.words3 = qset.data.words3;
        widgetState.words4 = qset.data.words4;
        widgetState.description1 = qset.data.description1;
        widgetState.description2 = qset.data.description2;
        widgetState.description3 = qset.data.description3;
        widgetState.description4 = qset.data.description4;

        updatePreview();
    },
    onSaveClicked: (mode = 'save') => {
        // Save widget data
        const qset = {
            version: 1,
            data: {
                words1: widgetState.words1,
                words2: widgetState.words2,
                words3: widgetState.words3,
                words4: widgetState.words4,
                description1: widgetState.description1,
                description2: widgetState.description2,
                description3: widgetState.description3,
                description4: widgetState.description4,
            }
        };
        console.log(qset);
        Materia.CreatorCore.save(_title, qset);
    },
});

