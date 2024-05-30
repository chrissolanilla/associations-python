// hide the default results table
Materia.ScoreCore.hideResultsTable()
// start & register a callback
Materia.ScoreCore.start({
    start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
        // build a custom score display here
        const totalScore = instance.finalScore;
        
        // Display the custom score
        const scoreDisplay = document.createElement('div');
        scoreDisplay.style.textAlign = 'center';
        scoreDisplay.innerHTML = `
            <h1>Congratulations!</h1>
            <p>Your total score is: ${totalScore}</p>
        `;
        
        // Append the score display to the body
        document.body.appendChild(scoreDisplay); 
    }, 
    update: (qset, scoreTable) => {},
    handleScoreDistribution: (distribution) => {}
})