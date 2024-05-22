/* my player js */
import './player.scss';

//modal code
const openButton = document.querySelector("[data-open-modal]");
const closeButton = document.querySelector("[data-close-modal]");
const modal = document.querySelector("[data-modal]");
// openButton.addEventListener("click", () => {
//     modal.showModal();
// })
modal.showModal();
closeButton.addEventListener("click", () => {
    modal.close();
});
Materia.Engine.start({
    start: (instance, qset, qsetVersion) => {
        // process the qset and start your app
        console.log(qset);
    }
})
