/**
 * creates a tutorial modal dialog with the given dimensions and maximum attempts.
 * @param {number} dimensionX - The number of words in each group.
 * @param {number} dimensionY - The number of groups.
 * @param {number} maxAttempts - The maximum number of attempts/lives.
 * @returns {{ openModal: function, closeModal: function, modal: Element }}
 */
export function createTutorialModal(dimensionX, dimensionY, maxAttempts) {
	const modal = document.createElement('dialog');
	modal.className = 'modal';
	modal.id = 'tutorialModal';

	modal.innerHTML = `
	<div class="modalClass3">
	  <h1 id="HowToPlay">How to Play</h1>
	  <p style="text-align:center;" id="tutorial1">There are ${dimensionX * dimensionY} words on the grid divided into
		${dimensionY} groups: each group contains ${dimensionX} words.</p>
	  <p id="tutorial2">
	  	Your goal is to identify each group of words through their thematic or topical <strong>associations</strong> with one another.
	  </p>
	  <p id="tutorial3">
	  	Once you select a <strong>group of ${dimensionX} words</strong>, select the <strong>Check Answer</strong> button to reveal whether
		your choices were correct.
	  </p> 

	  <p id="tutorial4">You start with a bank of <strong>${maxAttempts} attempts</strong>. Losing them all ends the game.
	   Your score is determined by the percentage of groups guessed correctly at the end of the game. Incorrect attempts will not deduct from
	   your final score while you still have attempts remaining.
	  </p>
	  <p style="text-align:center;" id="tutorial5"> For a more detailed explanation, check out the player guide. Good luck!</p>
	  <button
		id="continueButton"
		class="styled-button"
		aria-labelledby="HowToPlay tutorial1 tutorial2"
	  >
		Continue Game
	  </button>
	</div>
  `;

	document.body.appendChild(modal);
	const openModal = () => modal.showModal();
	const closeModal = () => modal.close();
	const continueButton = modal.querySelector('#continueButton');
	continueButton.addEventListener('click', closeModal);

	return {
		openModal,
		closeModal,
	};
}
