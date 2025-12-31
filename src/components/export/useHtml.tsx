import jsPDF from "jspdf";
import { useCallback } from "react";
import { IPattern } from "../../context";
import { GroupedStitch, stitchTypeToWritten } from "../../model/patterntype.enum";


export const useHtml = (canvas: HTMLCanvasElement | undefined, patternState: IPattern) => {
    const writePatternToHtml = useCallback(() => {

        const name = patternState.name.charAt(0).toUpperCase() + patternState.name.slice(1)

        var filename = `${patternState.name}_written.html`;

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

        const htmlContent = `<html>
<head>
<title>${name}</title>
</head>
<body>
<h1>${name}</h1>
<div>
${htmlText}
</div>
</body>
</html>`;

        // Create a blob of the data
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Create a link element
        const aDownloadLink = document.createElement('a');
        aDownloadLink.href = url;
        aDownloadLink.download = filename;

        // Programmatically click the link to trigger the download
        aDownloadLink.click();

        // Clean up the URL object
        URL.revokeObjectURL(url);

    }, [patternState.pattern, patternState.name]);

    return { writePatternToHtml }
}