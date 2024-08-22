import { FC, useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { PatternContext } from '../../context'
import { IPatternCell } from '../../model/patterncell.model'
import { CELL_TYPE } from '../../model/patterntype.enum'

type Props = {}
export const PatternSizeComponent: FC<Props> = () => {
    const [ rows, setRows ] = useState(10)
    const [ cols, setCols ] = useState(10)
    const { patternState, savePattern } = useContext(PatternContext)

    useEffect(() => {
        setRows(patternState.pattern.length)
        setCols(patternState.pattern.length > 0
                ? patternState.pattern[0].length
                : 0)
    }, [patternState])

    const change = () => {
        if (rows === patternState.pattern.length && cols === patternState.pattern[0].length) return

        if (rows > patternState.pattern.length) {
            let rowsToAppend = []
            let lastRowColorIndex = patternState.pattern[patternState.pattern.length-1][0].colorindex
            let rowColorIndex = lastRowColorIndex === 0 ? 1 : 0

            while (
                rows >
                patternState.pattern.length + rowsToAppend.length
            ) {
                let row: IPatternCell[] = []
                for (
                    let index = 0;
                    index < cols;
                    index++
                ) {
                    row.push({
                        colorindex: rowColorIndex,
                        type: CELL_TYPE.EMPTY
                    })
                }
                rowsToAppend.push(row)
                rowColorIndex = rowColorIndex === 0 ? 1 : 0
            }
            savePattern({
                ...patternState,
                pattern: [...patternState.pattern.map((row) => changeCols(row)), ...rowsToAppend]
            })
        } else if (
            rows > 0 &&
            rows < patternState.pattern.length
        ) {
            savePattern({
                ...patternState,
                pattern: [...patternState.pattern.slice(0, rows).map((row) => changeCols(row))]
            })
        } else {
            savePattern({
                ...patternState,
                pattern: [...patternState.pattern.map((row) => changeCols(row))]
            })
        }
    }

    function changeCols (row: IPatternCell[]): IPatternCell[] {

        if (cols > patternState.pattern[0].length) {
            let colsToAppend: IPatternCell[] = []
            while (
                colsToAppend.length <
                cols - patternState.pattern[0].length
            ) {
                colsToAppend.push({
                    colorindex: row[row.length-1].colorindex,
                    type: CELL_TYPE.EMPTY
                })
            }
            return [
                    ...row,
                    ...colsToAppend
                ]
        } else if (
            cols > 0 &&
            cols < patternState.pattern[0].length
        ) {
            return row.slice(0, cols)
        } else {
            return [...row]
        }
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Rows</Form.Label>
                <Form.Control
                    type="number"
                    min={0}
                    placeholder="rows"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value) || 1)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Cols</Form.Label>
                <Form.Control
                    type="number"
                    min={0}
                    placeholder="rows"
                    value={cols}
                    onChange={(e) => setCols(Number(e.target.value) || 1)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Button onClick={change}>Change</Button>
            </Form.Group>
        </>
    )
}
