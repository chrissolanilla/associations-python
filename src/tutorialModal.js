export function createTutorialModal(dimensionX, dimensionY, maxAttempts) {
  const modal = document.createElement('dialog');
  modal.className = 'modal';
  modal.id = 'tutorialModal';

  modal.innerHTML = `
    <div class="modalClass3">
      <h1 id="HowToPlay">How to Play</h1>
      <p style="text-align:center;" id="tutorial1">There are ${dimensionX * dimensionY} words on the grid, with
        ${dimensionY} groups, each group containing ${dimensionX} words.</p>
      <p id="tutorial2">Your goal is select words from the grid to see if your selection of words
         all have a <strong>connection</strong> or a relationship between each other.
      </p>
      <p id="tutorial3">If you are able to correct match a selection of words that belong to
     the same group, you will be able to see what describes their connection. However, if you make
    an incorrect selection, you will lose a life.</p>
      <p id="tutorial4">You start the game with ${maxAttempts} lives and if
     you lose them all the game will end. If this happens your score will be your correct selections
     divided by the total number of groups. Losing life will not deduct your final score, so if you
     are able to guess all the groups but lose some life along the way, you will still get a 100%.</p>
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

  // Modal open and close functions
  const openModal = () => modal.showModal();
  const closeModal = () => modal.close();

  // Add close functionality to the button
  const continueButton = modal.querySelector('#continueButton');
  continueButton.addEventListener('click', closeModal);

  return {
    openModal,
    closeModal,
  };
}
