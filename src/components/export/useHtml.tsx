import { useCallback, useEffect, useState } from "react";
import { IPattern } from "../../context";
import { rowToWrittenString } from "./helpers";


export const useHtml = (patternState: IPattern, sequencedColor: string | undefined) => {


    const writePatternToHtml = useCallback(() => {

        const name = patternState.name.charAt(0).toUpperCase() + patternState.name.slice(1)

        var filename = `${patternState.name}_written.html`;

        let htmlText = ``;

        // process the pattern from down to up
        for (let rowIndex = patternState.pattern.length - 1; rowIndex >= 0; rowIndex--) {
            const row = [...patternState.pattern[rowIndex]].reverse();
            const line = rowToWrittenString(row, sequencedColor);
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

    }, [patternState.pattern, patternState.name, sequencedColor]);

    return { writePatternToHtml }
}