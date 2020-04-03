/**
Copyright (C) Snakeroom Contributors 2019
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { allSources } from "./lib";

const noteElements = Array.from(document.getElementsByTagName("gremlin-note"));
const options = noteElements.map(note => note.innerHTML.trim());

const gremlinMeta = document.getElementsByTagName("gremlin-meta")[0];
gremlinMeta.innerHTML += "<br/><br/>";
const sneknetActive = createSneknetActive();
gremlinMeta.appendChild(sneknetActive);

const modalContainer = createModalContainer();
document.body.appendChild(modalContainer);

allSources(options, noteElements)
    .then(answers => {
        const seen: number[] = [];
        answers.forEach(answer => {
            if (!seen.includes(answer.index)) {
                const noteElement = noteElements[answer.index];
                noteElement.innerHTML += `<i></i><span class='note-is-human'> &nbsp;&nbsp; <small><b>${answer.sourceName}</b></small></span>`;
                noteElement.className += " incorrect-note";
                seen.push(answer.index);
            }
        });
        closeModal(modalContainer);
    })
    .catch(console.error);

function createModalContainer(): HTMLDivElement {
    const modal = document.createElement("div");
    modal.className = "snek-modal";
    modal.innerHTML = "Loading";

    const modalContainer = document.createElement("div");
    modalContainer.className = "snek-modal-container";
    modalContainer.appendChild(modal);

    return modalContainer;
}

function closeModal(modalContainer: HTMLDivElement) {
    modalContainer.style.display = "none";
}

function createSneknetActive() {
    const sneknetActive = document.createElement("a");
    sneknetActive.className = "snek-active";
    sneknetActive.href = "JavaScript:void(0);";
    sneknetActive.innerText = "Sneknet active";
    sneknetActive.addEventListener("click", () => {
        chrome.runtime.sendMessage("open-snakeroom");
    });
    return sneknetActive;
}
