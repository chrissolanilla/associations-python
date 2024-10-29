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
		<p id="help1">In this widget creator, you can customize an Associations game by selecting a grid size,
			creating categories, and populating them with words or phrases related to each category.</p>
		<p id="help2">Here's a quick guide:</p>
		<ul id="help3">
			<li><strong>Grid Size (X by Y):</strong> Choose the number of groups (Y) and the number of words per group (X). This defines how many groups and words per group players will see in the game.</li>
			<li><strong>Categories:</strong> Create distinct topics for each group, ensuring that words in each group relate to the overall theme of your widget.</li>
			<li><strong>Words:</strong> Populate each category with words or phrases. You can modify the words and categories later if needed. Ensure there are no duplicate words.</li>
			<li><strong>Lives:</strong> Configure the number of incorrect attempts player can make before the game ends. When a player selects an incorret combination of words, they lose a life. A player's total score is determined by the percentage of correctly guessed categories. Losing lives will not affect the final score.</li>
			<li><strong>Reveal Answers:</strong> If disabled, the score screen will not display correct category selections upon completion.</li>
		</ul>
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

