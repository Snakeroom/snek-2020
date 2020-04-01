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

const wmyh = document.getElementsByTagName("gremlin-meta")[0];
wmyh.innerHTML +=
    "<br/><br/><a class='snek-active' href='https://sneknet.com' target='_blank'>Sneknet active.</a>";

const noteElements = Array.from(document.getElementsByTagName("gremlin-note"));
const options = noteElements.map(note => note.innerHTML.trim());

fetch("https://api.snakeroom.org/y20/query", {
    method: "POST",
    body: JSON.stringify({ options }),
})
    .then(res => res.json())
    .then(data => {
        data.answers.forEach(answer => {
            noteElements[answer.i].innerHTML += answer.correct
                ? "<span class='note-is-imposter'> &nbsp;&nbsp; <b>IMPOSTER</b></span>"
                : "<span class='note-is-human'> &nbsp;&nbsp; <b>HUMAN</b></span>";
        });
    })
    .catch(console.error);

noteElements.forEach((noteElement, i) => {
    const message = noteElement.innerHTML.trim();
    const observer = new MutationObserver(mutations => {
        const state =
            mutations
                .flatMap((mutation: any) =>
                    Array.from((mutation.target as Element).attributes)
                )
                .find(attr => attr.name === "state")?.value || "";

        let body: any = null;
        switch (state) {
            case "incorrect":
                body = [
                    {
                        message,
                        correct: false,
                    },
                ];
                break;
            case "correct":
                body = options.map((option, j) => ({
                    message: option,
                    correct: i === j,
                }));
                break;
            default:
                return;
        }
        fetch("https://api.snakeroom.org/y20/submit", {
            method: "POST",
            body: JSON.stringify({
                options: body,
            }),
        }).catch(console.error);
    });
    observer.observe(noteElement, {
        attributes: true,
        attributeFilter: ["state"],
    });
});
