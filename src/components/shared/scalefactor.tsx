import { FC, useContext } from "react"
import { Button, ButtonGroup, InputGroup } from "react-bootstrap"
import { PatternContext } from "../../context"



export const ScaleFactor: FC = () => {
    const {
        patternState,
        changeScale,
        resetScale
    } = useContext(PatternContext)

    return (
        <>
        <InputGroup.Text>Scale</InputGroup.Text>
        <ButtonGroup className="float-end">
            <Button
                size="sm"
                variant="outline-danger"
                title="decrease scale factor"
                onClick={() => {
                    changeScale(false)
                }}
            >
                ➖
            </Button>
            <Button
                size="sm"
                variant="outline-secondary"
                title="reset scale factor to default"
                onClick={() => {
                    resetScale()
                }}
            >
                ✖ { patternState.scaleFactor.toFixed(2)}
            </Button>
            <Button
                size="sm"
                variant="outline-success"
                title="increase scale factor"
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
