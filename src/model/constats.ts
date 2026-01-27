import { TVIEWBOX_SIZE } from "./patterntype.enum"

export const VERSION = '1.5.4'

export const BACKGROUND_COLOR = '#ffffff'
export const DEFAULT_COLOR = '#ffffff'
export const DEFAULT_COLOR_2 = '#FF0000'
export const MINMAP_FRAME = '#000'
export const MINMAP_FRAME2 = '#00FF00'
export const KEY_STORAGE_OLD = 'com.kontranik.mosaiccrochetpattern.state'
export const KEY_STORAGE_ZUSTAND = 'com.kontranik.mosaiccrochetpattern.storage'

export const UNKNOWN_NAME = 'unnamed pattern'
export const DEFAULT_FONT_SIZE = 10
export const VIEWBOX_MIN_SIZE = 10
export const UNDO_LIMIT = 20
export const DEFAULT_VIEWBOX: TVIEWBOX_SIZE = {
        row: 0,
        col: 0,
        wx: 30,
        wy: 20,
    }