
import { ColorsComponent } from "./colors";
import { PatternSizeComponent } from "./patternsize";
import { ActionsComponent } from "./actions";


export const PanelComponent = () => {

  return (
    <>
      <PatternSizeComponent />
      <ColorsComponent />
      <ActionsComponent />
    </>
  );
};
