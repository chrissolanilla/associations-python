/**
 * creates a creator help modal dialog with the given instructions.
 * @returns {{ openModal: function, closeModal: function, modal: Element }}
 */
export function createCreatorHelpModal() {
	const modal = document.createElement('dialog');
	modal.className = 'modal';
	modal.id = 'tutorialModal';

	modal.innerHTML = `
	<div class="modalClass3">
		<h1 id="HowToCreate">How to Create Your Associations Game</h1>
		<p id="help1">In this widget creator, you can customize a Associations game by selecting a grid size,
			creating categories, and populating them with words or phrases related to each category.</p>
		<p id="help2">Here's a quick guide:</p>
		<ul id="help3">
			<li><strong>Grid Size(X by Y):</strong> Choose the number of groups(Y) and the number of words per group(X). This defines how many groups and words per group players will see in the game.</li>
			<li><strong>Categories:</strong> Create distinct topics for each group, ensuring that words in each group relate to the same theme.</li>
			<li><strong>Words:</strong> Fill each category with words or phrases. You can modify the words and categories later if needed. Make sure there are no duplicate words per widget.</li>
			<li><strong>Lives:</strong> Set the number of attempts players will have before the game ends. When a player checks a selection of words and it is wrong, they lose a life. Their total score is based on how many associations they got by the end of the game. Losing life will not deduct to total score.</li>
			<li><strong>Revealing Answers:</strong> Decide if you want to reveal correct answers at the end of the game.</li>
		</ul>
		<p style="text-align:center;" id="help4">For more detailed instructions, check out the full creator guide or reach out for help. Good luck creating your Associations game!</p>
		<button
			id="closeButton"
			class="ChooseButton"
		>
			Close Help
		</button>
	</div>
	`;

	document.body.appendChild(modal);
	const openModal = () => modal.showModal();
	const closeModal = () => modal.close();
	const closeButton = modal.querySelector('#closeButton');
	closeButton.addEventListener('click', closeModal);

	return {
		openModal,
		closeModal,
		modal,
	};
}

