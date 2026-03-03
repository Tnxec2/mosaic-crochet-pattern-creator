import { FC, useEffect } from "react";
import { useStateDebounced } from "../../services/debounce";

type Props = {
    colorIndex: number
    color: string
    changeColor: (color: string, colorIndex: number) => void
    setSelectedColor: (index: number) => void
    deleteColor: (index: number) => void
    selected: boolean
    canByDeleted: boolean
}

export const ColorItemComponent: FC<Props> = ({colorIndex, color, changeColor, setSelectedColor, deleteColor, selected, canByDeleted}) => {

  const [value, debouncedValue, setValue] = useStateDebounced(color, 1000);

  useEffect(() => {
    setValue(color);
  }, [color]);

  useEffect(() => changeColor(debouncedValue, colorIndex), [changeColor, colorIndex, debouncedValue])

  return <div key={`color-${colorIndex}`} className="input-group input-group-sm d-flex">
    <span className="input-group-text">{colorIndex+1}&nbsp;&nbsp;</span>
  <input
      type="color"
      className="form-control form-control-sm form-control-color"
      title="color"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
  />
  <button
      type="button"
      className="btn btn-outline-success btn-sm"
      onClick={(e) => setSelectedColor(colorIndex)}
      disabled={selected}
      title={`set as selected color [${colorIndex+1}]`}
  >
      {selected
          ? '✔'
          : 'set'}
  </button>
  <button
      type="button"
      className="btn btn-outline-danger btn-sm"
      onClick={(e) => deleteColor(colorIndex)}
      disabled={!canByDeleted}
  >
      ❌
  </button>
</div>
}