import jsPDF from "jspdf";
import { useCallback } from "react";
import { IPattern } from "../../context";
import { GroupedStitch, stitchTypeToWritten } from "../../model/patterntype.enum";


export const usePdf = (canvas: HTMLCanvasElement | undefined, patternState: IPattern) => {
    const savePdf = useCallback(() => {
        if (canvas) {
            let width = canvas.width;
            let height = canvas.height;

            let pdf: jsPDF;

            //set the orientation
            if (width > height) {
                pdf = new jsPDF('l', 'px', [width, height]);
            }
            else {
                pdf = new jsPDF('p', 'px', [height, width]);
            }
            //then we get the dimensions from the 'pdf' file itself
            width = pdf.internal.pageSize.getWidth();
            height = pdf.internal.pageSize.getHeight();
            pdf.addImage(canvas, 'PNG', 0, 0, width, height);
            var filename = `${patternState.name}.pdf`;
            pdf.save(filename);
        }
    }, [canvas, patternState.name])

    const writePatternToPdf = useCallback(() => {
        const pdf = new jsPDF('p', 'pt', 'a4');

        var filename = `${patternState.name}_written.pdf`;

        var head = `<h1>${patternState.name.charAt(0).toUpperCase() + patternState.name.slice(1)}</h1>\n`;

        let htmlText = ``;

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

        // process the pattern from down to up
        for (let rowIndex = patternState.pattern.length - 1; rowIndex >= 0; rowIndex--) {
            const row = [...patternState.pattern[rowIndex]].reverse();
            const groupedStitches = groupStitches(row);
            // const line = groupedStitches.map(stitch => `${stitch.count > 1 ? stitch.count + ' ' : ''}${stitchTypeToWritten(stitch.type)}`).join(', ');
            const line = groupedStitches.map(stitch => `${stitch.count} ${stitchTypeToWritten(stitch.type)}`).join(', ');
            htmlText += `<p>Row ${patternState.pattern.length - rowIndex}: ${line}</p>\n`;
        }

        pdf.html(`<div style="width:500px;">${head}<div style="font-size: 10pt;">${htmlText}</div></div>`, {
            margin: 30,
            width: 500,
            autoPaging: 'text',
            callback: function (doc) {
                doc.save(filename);
            }
        });
    }, [patternState.pattern, patternState.name]);

    return { savePdf, writePatternToPdf }
}