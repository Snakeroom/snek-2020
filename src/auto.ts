import { allSources } from "./lib";

let isAuto = false;

const gremlinPrompt = document.getElementsByTagName("gremlin-prompt")[0];
gremlinPrompt.innerHTML += "<br/>";
const autoSnekArea = document.createElement("div");
autoSnekArea.className = "auto-snek-area";
const autoSnekButton = document.createElement("button");
autoSnekButton.className = "auto-snek-button";
autoSnekButton.innerText = "Auto Snek";
autoSnekButton.addEventListener("click", () => {
    isAuto = !isAuto;
    autoSnekButton.className = "auto-snek-button " + (isAuto && "on");
});
autoSnekArea.appendChild(autoSnekButton);
const autoSnekResult = document.createElement("div");
autoSnekResult.className = "auto-snek-result";
autoSnekArea.appendChild(autoSnekResult);
gremlinPrompt.appendChild(autoSnekArea);

// const reCsrf = /\<gremlin-app\n\s*csrf=\"(.*)\"/;
// const reNoteIds = /\<gremlin-note id=\"(.*)\"/;
// const reNotes = /\<gremlin-note id=\"(.*)\">\n\s*(.*)/g;
// const rePleaseWait = /\<gremlin-prompt>\n.*<h1>(.*)<\/h1>n.*<p>Please try again in a moment.<\/p>/;

interface Note {
    id: string;
    text: string;
}

setInterval(async () => {
    if (!isAuto) return;
    const room = await fetch("https://gremlins-api.reddit.com/room").then(res =>
        res.text()
    );
    const crsf_nullable = room.match(/\<gremlin-app\n\s*csrf=\"(.*)\"/);
    let crsf_token: string;
    if (crsf_nullable) {
        crsf_token = crsf_nullable[1];
    } else {
        return;
    }
    const reNotes = /\<gremlin-note id=\"(.*)\">\n\s*(.*)/g;
    const notes: Note[] = [];
    let match: any;
    while ((match = reNotes.exec(room))) {
        notes.push({
            id: match[1],
            text: match[2].trim(),
        });
    }
    const answers = await allSources(
        notes.map(n => n.text),
        notes
    );
    let unseen: number[] = Array(notes.length)
        .fill(0)
        .map((_, i) => i);
    answers.forEach(
        answer => (unseen = unseen.filter(v => v !== answer.index))
    );
    if (unseen.length <= 0) return;
    const guess = notes[unseen[0]];
    const formData = new FormData();
    formData.append("note_id", guess.id);
    formData.append("csrf_token", crsf_token);
    const result = await fetch("https://gremlins-api.reddit.com/submit_guess", {
        method: "POST",
        body: formData,
    }).then(res => res.json());
    autoSnekResult.innerText = guess.text;
    autoSnekResult.className =
        "auto-snek-result " + (result.result === "WIN" ? "win" : "loss");
}, 1000);
