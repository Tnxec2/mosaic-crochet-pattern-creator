import { FC, useContext } from "react"
import { Button, ButtonGroup, InputGroup } from "react-bootstrap"
import { PatternContext } from "../../context"



export const ScaleFactor: FC = () => {
    const {
        patternState,
        savePattern,
    } = useContext(PatternContext)

    const changeScale = (increase: boolean) => {
        let factor = patternState.scaleFactor || 1

        if (!increase && factor > 0.1) {
            savePattern({ ...patternState, scaleFactor: factor - 0.1 })
            return
        }
        if (increase && factor < 10)
            savePattern({ ...patternState, scaleFactor: factor + 0.1 })
    }

    return (
        <>
        <InputGroup.Text>Scale</InputGroup.Text>
        <ButtonGroup className="float-end">
            <Button
                size="sm"
                variant="outline-danger"
                onClick={() => {
                    changeScale(false)
                }}
            >
                ➖
            </Button>
            <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => {
                    savePattern({ ...patternState, scaleFactor: 1 })
                }}
            >
                ✖ { patternState.scaleFactor.toFixed(2)}
            </Button>
            <Button
                size="sm"
                variant="outline-success"
                onClick={() => {
                    changeScale(true)
                }}
            >
                ➕
            </Button>
        </ButtonGroup>
        </>
    )

}
