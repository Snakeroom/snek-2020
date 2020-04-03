export async function sourceSneknet(options: string[]): Promise<number[]> {
    const data = await fetch("https://api.snakeroom.org/y20/query", {
        method: "POST",
        body: JSON.stringify({
            options,
        }),
    }).then(res => res.json());
    return data.answers.filter(a => !a.correct).map(a => a.i);
}

export async function sourceSpacescience(
    noteElements: { id: string }[]
): Promise<number[]> {
    const promises = noteElements.map(async (element, i) => {
        const data = await fetch(
            `https://spacescience.tech/check.php?id=${element.id}`,
            {
                method: "GET",
                redirect: "follow",
            }
        ).then(res => res.json());
        for (let key in data) {
            if (data[key]?.flag === "1" && data[key]?.result === "LOSE") {
                return i;
            }
        }
        return null;
    });
    return Promise.all(promises).then(a =>
        a.filter((v): v is number => v !== null)
    );
}

export async function sourceOcean(): Promise<number[]> {
    return [];
}

export interface MappedSourceIndex {
    index: number;
    sourceName: string;
}

export async function allSources(options, noteElements: { id: string }[]) {
    return Promise.all([
        mapSource(sources.sneknet(options), "SNEKNET"),
        mapSource(sources.spacescience(noteElements), "SPACESCIENCE"),
        mapSource(sources.ocean(), "OCEAN"),
    ]).then(a => a.flat());
}

export async function mapSource(
    promise: Promise<number[]>,
    sourceName: string
): Promise<MappedSourceIndex[]> {
    return promise.then(a => a.map(v => ({ index: v, sourceName })));
}

export const sources = {
    sneknet: sourceSneknet,
    spacescience: sourceSpacescience,
    ocean: sourceOcean,
};
