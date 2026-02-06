import { FC, useState } from "react"
import { useStore } from "../../context"
import { Button, Card } from "react-bootstrap"
import { BufferRowComponent } from "../pattern/buffer.row"

type Props = {}

export const CopyBufferComponent: FC<Props> = () => {
    const { bufferdata, clearBuffer } = useStore((state) => state)

    const [showContent, setShowContent] = useState(false)

    return (
        <Card className='mt-2'>
            <Card.Header onClick={() => { setShowContent(!showContent) }}>
                Copy Buffer
            </Card.Header>
            {showContent &&
                <Card.Body className='p-1'>
                    <div
                        className="noselect"
                        id="copyBuffer"
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {bufferdata.length === 0 ?
                            <div>No data in buffer</div>
                            :
                            <Button 
                                variant="outline-danger" 
                                size="sm" 
                                onClick={() => {
                                clearBuffer()
                            }}>Clear Buffer</Button>
                        }
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflow: 'auto',
                            marginTop: '1em'
                        }}>

                            <div>
                                {bufferdata
                                    .map((row, rowIndex) => (
                                        <BufferRowComponent
                                            key={`bufferRow-${rowIndex}`}
                                            row={row}
                                            rowIndex={rowIndex}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </Card.Body>

            }
        </Card>
    )
}