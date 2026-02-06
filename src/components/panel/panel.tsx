import { ColorsComponent } from './colors'
import { PatternSizeComponent } from './patternsize'
import { ActionsComponent } from './actions'
import { PropertiesComponent } from './properties'
import { PatternMinimapComponent } from '../pattern/windowed/pattern.minimap'
import { CopyBufferComponent } from './bufferData'

export const PanelComponent = () => {
    return (
        <>
            <PatternMinimapComponent />
            <PatternSizeComponent />
            <ColorsComponent />
            <ActionsComponent />
            <PropertiesComponent />
            <CopyBufferComponent />
        </>
    )
}
