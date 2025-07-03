import { FC } from 'react'
import { PatternMinimapComponent } from '../pattern/windowed/pattern.minimap'


type Props = {}

export const MinimapPanelComponent: FC<Props> = () => {
  
    return (
        <div className='mb-3'>
            <PatternMinimapComponent />
        </div>
    )
}
