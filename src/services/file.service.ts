import { IPattern } from '../context'
import { KEY_STORAGE, UNKNOWN_NAME } from '../model/constats'
import { mug } from '../sampledata/mug'

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

export const loadFile = (
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

export const loadPattern = () => {
    let saved = localStorage.getItem(KEY_STORAGE)
    if (saved) {
        let pattern = JSON.parse(saved) as IPattern
        if (!pattern.name) pattern.name = UNKNOWN_NAME
        return pattern
    }
    return mug
}
