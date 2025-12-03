import { IPattern, IPattern_Old } from "../src/context";

import * as fs from 'fs';

import { IPatternCell, IPatternGrid } from "../src/model/patterncell.model";

/*

This script is used to copy a section of a pattern grid and optionally mirror it.
It reads a pattern from a JSON file, processes it, and writes the modified pattern to a new JSON file.

Change this script to fit your needs, such as the input and output file paths, and the specific sections of the pattern you want to copy or mirror.

Script Usage:
 `npx ts-node temp/manipulate.ts`

It requires the `ts-node` package to run TypeScript files directly.

Make sure to have the input file `temp/original.json` with a valid pattern structure.

Output will be saved in `temp/output_pattern.json`.


Script ist hilfreich um einen Teil eines Musters zu kopieren und / oder zu spiegeln.


*/

const origFile = 'temp/original.json';

const outFile = 'temp/output_pattern.json';

fs.readFile(origFile, 'utf8', (error: any, content: string) => {
    if (!error) {
        var data: IPattern;
        if (content.indexOf("version:") === -1) {
            var oldPattern = JSON.parse(content) as IPattern_Old;
            let newpat: IPatternGrid = []
            for (let row = 0; row < oldPattern.pattern.length; row++) {
                const r: IPatternCell[] = []
                for (let col = 0; col < oldPattern.pattern[0].length; col++) {
                    const oldcell = oldPattern.pattern[row][col] as any
                    r.push({
                        c: oldcell.colorindex,
                        t: oldcell.type
                    })
                }
                newpat.push(r)
            }
            data = {
                ...oldPattern,
                pattern: newpat,
                version: 2
            }
        } else {
            data = JSON.parse(content) as IPattern;
        }
        
        console.log(`pattern name: ${data.name}`);
        console.log(`pattern rows: ${data.pattern.length}, cols: ${data.pattern[0].length}`);

        var mirrored = copy(data.pattern, data.pattern, { row: 0, col: 124, width: 124, height: 368 }, { row: 0, col: 0 }, true);
        var v1 = copy(data.pattern, mirrored, { row: 4, col: 119, width: 11, height: 15 }, { row: 4, col: 119 }, false);
        var v2 = copy(data.pattern, v1, { row: 320, col: 85, width: 78, height: 33 }, { row: 320, col: 85 }, false);

        let outData: IPattern = {
            ...data,
            name: data.name + '_out',
            pattern: v2
        };

        fs.writeFile(outFile, JSON.stringify(outData, null, 2), 'utf8', (err: any) => {
            if (err) {
                console.error("Error writing file:", err);
            } else {
                console.log(`File written successfully to ${outFile}`);
            }
        })
    } else {
        console.error("Error reading file:", error);
    }
});

type Rect = {
    row: number;
    col: number;
    width: number;
    height: number;
}

type Offset = {
    row: number;
    col: number;
}

function copy(inp: IPatternGrid, out: IPatternGrid, input: Rect, output: Offset, mirror: boolean = false) {
    if (input.row < 0 || input.col < 0 || input.row + input.height > inp.length || input.col + input.width > inp[0].length) {
        throw new Error("Invalid input rectangle dimensions");
    }
    var result: IPatternGrid = [...out.map(row => [...row.map(cell => ({ ...cell }))])];

    for (let rowIndex = 0; rowIndex <  input.height; rowIndex++) {
        for (let colIndex = 0; colIndex < input.width; colIndex++) {
            if (!mirror) {
                result[output.row + rowIndex][output.col + colIndex] = {...inp[input.row + rowIndex][input.col + colIndex]};
            } else {
                result[output.row + rowIndex][output.col + colIndex] = {...inp[input.row + rowIndex][input.col + input.width - colIndex]};
            }
        }
    }
    return result;
}
