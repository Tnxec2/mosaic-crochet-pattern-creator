import { TVIEWBOX_SIZE } from '../components/pattern/windowed/pattern'
import { IPattern } from '../context'
import { DEFAULT_COLOR, DEFAULT_VIEWBOX, KEY_STORAGE, KEY_STORAGE_VIEWBOX, UNKNOWN_NAME } from '../model/constats'
import { mug } from '../sampledata/mug'
import { debounce } from './debounce'

export const onSave = (patternState: IPattern) => {
    const fileName = patternState.name || UNKNOWN_NAME
    const json = JSON.stringify(patternState, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const href = URL.createObjectURL(blob)

    // create "a" HTLM element with href to file
    const link = document.createElement('a')
    link.href = href
    link.download = fileName + '.json'

    document.body.appendChild(link)

    link.click()

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
}

export const loadJsonFile = (
    file: File | undefined,
    onLoad: (pattern: IPattern) => void
) => {
    if (file) {
        let fr = new FileReader()
        fr.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
                let json = e.target.result
                let pat: IPattern = JSON.parse(json.toString())
                if (!pat.name) pat.name = UNKNOWN_NAME
                onLoad(pat)
            }
        }
        fr.readAsText(file)
    }
}

export const saveLocalDebounced = debounce(
    (pattern: IPattern) => {
        localStorage.setItem(KEY_STORAGE, JSON.stringify(pattern)) },
    1000
)

export const baseName = (str: string) => {
   var base = str.substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") !== -1)       
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}


export const loadPattern = () => {
    let saved = localStorage.getItem(KEY_STORAGE)
    if (saved) {
        let pattern = JSON.parse(saved) as IPattern
        if (!pattern.name) pattern.name = UNKNOWN_NAME
        return pattern
    }
    return mug
}

const fillTransparentPixelsWithWhite = (imageData: ImageData) => {
    // Get image data
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]; // Alpha channel
      if (alpha === 0) {
        // Check if pixel is fully transparent
        data[i] = 255; // Red
        data[i + 1] = 255; // Green
        data[i + 2] = 255; // Blue
        data[i + 3] = 255; // Set alpha to fully opaque
      }
    }
  
    // Put image data back
    return imageData;
  }


export const saveViewBoxDebounced = debounce(
    (viewBox: TVIEWBOX_SIZE) => {
        localStorage.setItem(KEY_STORAGE_VIEWBOX, JSON.stringify(viewBox)) },
    1000
)

export const loadViewBox = () => {
    const saved = localStorage.getItem(KEY_STORAGE_VIEWBOX)
    if (saved) {
        let viewBox = JSON.parse(saved) as TVIEWBOX_SIZE

        if (!viewBox.row || viewBox.row < 0) viewBox.row = DEFAULT_VIEWBOX.row
        if (!viewBox.col || viewBox.col < 0) viewBox.col = DEFAULT_VIEWBOX.col
        if (!viewBox.wx || viewBox.wx < 1) viewBox.wx = DEFAULT_VIEWBOX.wx
        if (!viewBox.wy || viewBox.wy < 1) viewBox.wy = DEFAULT_VIEWBOX.wy
        return viewBox
    } 
    return DEFAULT_VIEWBOX
}