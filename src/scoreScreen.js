document.addEventListener('DOMContentLoaded', () => {
	// Hide the default results table and scores overview
	Materia.ScoreCore.hideResultsTable();
	Materia.ScoreCore.hideScoresOverview();

	Materia.ScoreCore.start({
		start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
			// Display the score data
			const score = scoreTable.scores[0].score;
			const scoreContainer = document.createElement('div');
			scoreContainer.innerHTML = `
				<h1>Game Over</h1>
				<p>Score: ${score}%</p>
			`;
			document.body.appendChild(scoreContainer);
		}
	});
});
