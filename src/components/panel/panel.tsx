import { ColorsComponent } from './colors'
import { PatternSizeComponent } from './patternsize'
import { ActionsComponent } from './actions'
import { PropertiesComponent } from './properties'
import { MinimapPanelComponent } from './minimap'

export const PanelComponent = () => {
    return (
        <>
            <MinimapPanelComponent />
            <PatternSizeComponent />
            <ColorsComponent />
            <ActionsComponent />
            <PropertiesComponent />
        </>
    )
}
