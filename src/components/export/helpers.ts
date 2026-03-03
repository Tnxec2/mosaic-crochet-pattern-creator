import { BACKGROUND_COLOR_WRITTEN_PATTERN_SEQUENCE } from "../../model/constats";
import { GroupedStitch, SequencePart, stitchTypeToWritten } from "../../model/patterntype.enum";

const groupStitches = (row: any[]): GroupedStitch[] => {
    if (!row || row.length === 0) {
        return [];
    }
    const grouped: GroupedStitch[] = [];
    let lastType = row[0].t;
    let count = 1;
    for (let i = 1; i < row.length; i++) {
        if (row[i].t === lastType) {
            count++;
        } else {
            grouped.push({ type: lastType, count });
            lastType = row[i].t;
            count = 1;
        }
    }
    grouped.push({ type: lastType, count });
    return grouped;
};

const areSequencesEqual = (seq1: GroupedStitch[], seq2: GroupedStitch[]): boolean => {
    if (seq1.length !== seq2.length) {
        return false;
    }
    for (let i = 0; i < seq1.length; i++) {
        if (seq1[i].type !== seq2[i].type || seq1[i].count !== seq2[i].count) {
            return false;
        }
    }
    return true;
};

export const analyzeSequences = (groupedStitches: GroupedStitch[]): SequencePart[] => {
    const result: SequencePart[] = [];
    let remainingStitches = [...groupedStitches];

    while (remainingStitches.length > 0) {
        let bestMatch = {
            length: 0,
            repeats: 1,
            consumed: 0,
        };

        for (let l = Math.floor(remainingStitches.length / 2); l >= 1; l--) {
            const pattern = remainingStitches.slice(0, l);
            let repeats = 1;
            let i = l;
            while (i + l <= remainingStitches.length) {
                const nextSequence = remainingStitches.slice(i, i + l);
                if (areSequencesEqual(pattern, nextSequence)) {
                    repeats++;
                    i += l;
                } else {
                    break;
                }
            }

            if (repeats > 1) {
                const consumed = l * repeats;
                if (consumed > bestMatch.consumed) {
                    bestMatch = { length: l, repeats, consumed };
                }
            }
        }

        if (bestMatch.length > 0) {
            const sequence = remainingStitches.slice(0, bestMatch.length);
            result.push({ sequence, repeat: bestMatch.repeats });
            remainingStitches = remainingStitches.slice(bestMatch.consumed);
        } else {
            const firstStitch = remainingStitches.shift();
            if (firstStitch) {
                result.push({ sequence: [firstStitch], repeat: 1 });
            }
        }
    }

    if (result.length === 0) return [];

    const finalResult: SequencePart[] = [];
    let currentSingleSequence: GroupedStitch[] = [];
    for (const part of result) {
        if (part.repeat === 1) {
            currentSingleSequence.push(...part.sequence);
        } else {
            if (currentSingleSequence.length > 0) {
                finalResult.push({ sequence: currentSingleSequence, repeat: 1 });
                currentSingleSequence = [];
            }
            finalResult.push(part);
        }
    }
    if (currentSingleSequence.length > 0) {
        finalResult.push({ sequence: currentSingleSequence, repeat: 1 });
    }
    return finalResult;
};

export const rowToWrittenString = (row: any[], sequencedColor?: string ): string => {
    const groupedStitches = groupStitches(row);
    const sequenceParts = analyzeSequences(groupedStitches);

    const line = sequenceParts.map(part => {
        const sequenceString = part.sequence
            .map(stitch => `${stitch.count} ${stitchTypeToWritten(stitch.type)}`)
            .join(', ');

        if (part.repeat > 1) {
            return `(${[undefined, '#ffffff', '#ffffffff'].includes(sequencedColor) ? sequenceString : `<span style="background-color: ${sequencedColor || BACKGROUND_COLOR_WRITTEN_PATTERN_SEQUENCE};">${sequenceString}</span>`}) x ${part.repeat}`;
        }
        return sequenceString;
    }).join(', ');

    return line;
}