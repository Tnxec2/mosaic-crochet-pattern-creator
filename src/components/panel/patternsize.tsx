import { FC, useCallback, useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Form, InputGroup } from 'react-bootstrap'
import { useStore } from '../../context'
import { IPatternCell } from '../../model/patterncell.model'
import { CELL_TYPE } from '../../model/patterntype.enum'

type Props = {}
export const PatternSizeComponent: FC<Props> = () => {

    const { patternState, savePattern } = useStore()

    const [showContent, setShowContent] = useState(false)

    const [ rowsString, setRowsString ] = useState(patternState.pattern.length.toString())
    const [ colsString, setColsString ] = useState(patternState.pattern[0].length.toString())

    useEffect(() => {        
        setRowsString(patternState.pattern.length.toString())
        setColsString(patternState.pattern.length > 0
                ? patternState.pattern[0].length.toString()
                : "1")
    }, [patternState.pattern])

    const changeCols = useCallback( (row: IPatternCell[], cols: number): IPatternCell[] => {
        if (cols > patternState.pattern[0].length) {
            let colsToAppend: IPatternCell[] = []
            while (
                colsToAppend.length <
                cols - patternState.pattern[0].length
            ) {
                colsToAppend.push({
                    c: row[row.length-1].c,
                    t: CELL_TYPE.EMPTY
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
    }, [patternState.pattern])

    const change = useCallback(() => {
        const rows = Number(rowsString) || patternState.pattern.length 
        const cols = Number(colsString)|| patternState.pattern[0].length
        if (rows === patternState.pattern.length && cols === patternState.pattern[0].length) return

        if (rows > patternState.pattern.length) {
            let rowsToAppend = []
            let lastRowColorIndex = patternState.pattern[patternState.pattern.length-1][0].c
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
                        c: rowColorIndex,
                        t: CELL_TYPE.EMPTY
                    })
                }
                rowsToAppend.push(row)
                rowColorIndex = rowColorIndex === 0 ? 1 : 0
            }
            savePattern({
                ...patternState,
                pattern: [...patternState.pattern.map((row) => changeCols(row, cols)), ...rowsToAppend]
            })
        } else if (
            rows > 0 &&
            rows < patternState.pattern.length
        ) {
            savePattern({
                ...patternState,
                pattern: [...patternState.pattern.slice(0, rows).map((row) => changeCols(row, cols))]
            })
        } else {
            savePattern({
                ...patternState,
                pattern: [...patternState.pattern.map((row) => changeCols(row, cols))]
            })
        }
    }, [changeCols, colsString, patternState, rowsString, savePattern])

    return (
        <Card>
            <Card.Header onClick={() => {setShowContent(!showContent)}}>
            <Form.Label>Size of pattern</Form.Label>
        </Card.Header>
        { showContent && 
        <Card.Body className='p-1'>
        <InputGroup size="sm">
            <InputGroup.Text>Rows</InputGroup.Text>
            <Form.Control
                type="number"
                style={{minWidth: 30}}
                size='sm'
                min={1}
                placeholder="rows"
                value={rowsString}
                onChange={(e) => setRowsString(e.target.value) }
            />
        </InputGroup>
        <ButtonGroup  className="mt-1 mb-1">
        <Button
                size="sm"
                variant="outline-danger"
                title="decrease font size"
                onClick={() => {
                    setRowsString(Math.max(1, Number(rowsString)-1).toString())
                }}
            >
                ➖
            </Button>
            <Button
                size="sm"
                variant="outline-secondary"
                title="reset font size to default"
                onClick={() => {
                    setRowsString(patternState.pattern.length.toString())
                }}
            >
                ✖ 
            </Button>
            <Button
                size="sm"
                variant="outline-success"
                title="increase font size"
                onClick={() => {
                  setRowsString((Number(rowsString)+1).toString())
                }}
            >
                ➕
            </Button>
        </ButtonGroup>
        <InputGroup size="sm">
                <InputGroup.Text>Cols</InputGroup.Text>
                <Form.Control
                    type="number"
                    style={{minWidth: 30}}
                    size='sm'
                    min={1}
                    placeholder="rows"
                    value={colsString}
                    onChange={(e) => setColsString((Number(e.target.value) || 1).toString())}
                />
        </InputGroup>
        <ButtonGroup className='mt-1 mb-1'>
        <Button
                size="sm"
                variant="outline-danger"
                title="decrease font size"
                onClick={() => {
                    setColsString(Math.max(1, Number(colsString)-1).toString())
                }}
            >
                ➖
            </Button>
            <Button
                size="sm"
                variant="outline-secondary"
                title="reset font size to default"
                onClick={() => {
                    setColsString(patternState.pattern[0].length.toString())
                }}
            >
                ✖ 
            </Button>
            <Button
                size="sm"
                variant="outline-success"
                title="increase font size"
                onClick={() => {
                  setColsString((Number(colsString)+1).toString())
                }}
            >
                ➕
            </Button>
        </ButtonGroup>
        <Form.Group>
            <Button onClick={change}>Change</Button>
        </Form.Group>
        </Card.Body>}
        </Card>
    )
}
