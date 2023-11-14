import { ChangeEvent, FC, useContext, useMemo } from 'react'
import { Form } from 'react-bootstrap'
import { PatternContext } from '../context'
import { IPatternCell } from '../model/patterncell.model'
import { CELL_TYPE } from '../model/patterntype.enum'

type Props = {}
export const PatternSizeComponent: FC<Props> = () => {
    const { patternState, savePattern } = useContext(PatternContext)

    const rows = useMemo(() => patternState.pattern.length, [patternState])
    const cols = useMemo(
        () =>
            patternState.pattern.length > 0
                ? patternState.pattern[0].length
                : 0,
        [patternState]
    )

    const changeRows = (e: ChangeEvent<HTMLInputElement>) => {
        let newRowCount = Number(e.target.value) || 1

        if (newRowCount > patternState.pattern.length) {
            let rowsToAppend = []
            while (
                newRowCount >
                patternState.pattern.length + rowsToAppend.length
            ) {
                let row: IPatternCell[] = []
                for (
                    let index = 0;
                    index < patternState.pattern[0].length;
                    index++
                ) {
                    row.push({
                        colorindex: patternState.selectedColorIndex,
                        type: CELL_TYPE.EMPTY
                    })
                }
                rowsToAppend.push(row)
            }
            savePattern({
                ...patternState,
                pattern: [...patternState.pattern, ...rowsToAppend]
            })
        } else if (
            newRowCount > 0 &&
            newRowCount < patternState.pattern.length
        ) {
            savePattern({
                ...patternState,
                pattern: [...patternState.pattern.slice(0, newRowCount)]
            })
        }
    }

    const changeCols = (e: ChangeEvent<HTMLInputElement>) => {
        let newColsCount = Number(e.target.value) || 1

        if (newColsCount > patternState.pattern[0].length) {
            let colsToAppend: IPatternCell[] = []
            while (
                colsToAppend.length <
                newColsCount - patternState.pattern[0].length
            ) {
                colsToAppend.push({
                    colorindex: patternState.selectedColorIndex,
                    type: CELL_TYPE.EMPTY
                })
            }
            savePattern({
                ...patternState,
                pattern: patternState.pattern.map((row) => [
                    ...row,
                    ...colsToAppend
                ])
            })
        } else if (
            newColsCount > 0 &&
            newColsCount < patternState.pattern[0].length
        ) {
            savePattern({
                ...patternState,
                pattern: patternState.pattern.map((row) =>
                    row.slice(0, newColsCount)
                )
            })
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
                    onChange={changeRows}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Cols</Form.Label>
                <Form.Control
                    type="number"
                    min={0}
                    placeholder="rows"
                    value={cols}
                    onChange={changeCols}
                />
            </Form.Group>
        </>
    )
}
