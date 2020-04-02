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

const gremlinMeta = document.getElementsByTagName("gremlin-meta")[0];
gremlinMeta.innerHTML += "<br/><br/>";
const sneknetActive = createSneknetActive();
gremlinMeta.appendChild(sneknetActive);

const noteElements = Array.from(document.getElementsByTagName("gremlin-note"));

const modalContainer = createModalContainer();
document.body.appendChild(modalContainer);

fetch("https://api.snakeroom.org/y20/query", {
    method: "POST",
    body: JSON.stringify({
        options: noteElements.map(note => note.innerHTML.trim()),
    }),
})
    .then(res => res.json())
    .then(data => {
        data.answers.forEach(answer => {
            if (!answer.correct) {
                markAsHuman(answer.i);
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

function markAsHuman(idx: number) {
    const noteElement = noteElements[idx];
    noteElement.innerHTML +=
        "<i></i><span class='note-is-human'> &nbsp;&nbsp; <b>HUMAN</b></span>";
    noteElement.className += " incorrect-note";
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
