import { ColorsComponent } from './colors'
import { PatternSizeComponent } from './patternsize'
import { ActionsComponent } from './actions'
import { PropertiesComponent } from './properties'

export const PanelComponent = () => {
    return (
        <>
            <PatternSizeComponent />
            <ColorsComponent />
            <ActionsComponent />
            <PropertiesComponent />
        </>
    )
}
