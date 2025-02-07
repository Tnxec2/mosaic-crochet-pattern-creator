export enum ACTION_TYPES {
    NONE = 'empty',
    COLOR = 'color',
    X = 'x',
    L = 'l',
    R = 'r',
    LR = 'lr',
    XR = 'xr',
    LX = 'lx',
    LXR = 'lxr'
}


export function actionTitle(type: ACTION_TYPES): string {
    const key = actionTypesToKey(type)
    switch (type) {
        case ACTION_TYPES.NONE:
            return `Empty [${key}]` 
        case ACTION_TYPES.COLOR:
            return `Color [${key}]` 
        case ACTION_TYPES.X:
        case ACTION_TYPES.L:
        case ACTION_TYPES.R:
        case ACTION_TYPES.LR:
        case ACTION_TYPES.XR:
        case ACTION_TYPES.LX:
        case ACTION_TYPES.LXR:
            return `${type.toUpperCase()} [${key}]`
    }
    return ''
}

export function actionTypesToKey(type: ACTION_TYPES): string {
    switch (type) {
        case ACTION_TYPES.NONE:
            return "e"
        case ACTION_TYPES.COLOR:
            return "c"
        case ACTION_TYPES.X:
            return "x"
        case ACTION_TYPES.L:
            return "l"
        case ACTION_TYPES.R:
            return 'r'
        case ACTION_TYPES.LR:
            return 'b'
        case ACTION_TYPES.XR:
            return 'R'
        case ACTION_TYPES.LX:
            return 'L'
        case ACTION_TYPES.LXR:
            return 'X'
    }
    return ''
}
