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

const actionTypeToKeyMap: Record<ACTION_TYPES, string> = {
    [ACTION_TYPES.NONE]: "e",
    [ACTION_TYPES.COLOR]: "c",
    [ACTION_TYPES.X]: "x",
    [ACTION_TYPES.L]: "l",
    [ACTION_TYPES.R]: 'r',
    [ACTION_TYPES.LR]: 'b',
    [ACTION_TYPES.XR]: 'R',
    [ACTION_TYPES.LX]: 'L',
    [ACTION_TYPES.LXR]: 'X'
};

export function mirrorActionType(type: ACTION_TYPES): ACTION_TYPES {
    switch (type) {
        case ACTION_TYPES.L:
            return ACTION_TYPES.R;
        case ACTION_TYPES.R:
            return ACTION_TYPES.L;
        case ACTION_TYPES.LR:
            return ACTION_TYPES.LR;
        case ACTION_TYPES.LX:
            return ACTION_TYPES.XR;
        case ACTION_TYPES.XR:
            return ACTION_TYPES.LX;
        case ACTION_TYPES.LXR:
            return ACTION_TYPES.LXR;
        default:
            return type;
    }
}

export const actionKeys = Object.values(actionTypeToKeyMap);

export function keyToActionType(key: string): ACTION_TYPES {
    return Object.keys(actionTypeToKeyMap).find((k) => actionTypeToKeyMap[k as ACTION_TYPES] === key) as ACTION_TYPES;
}


export function actionTypesToKey(type: ACTION_TYPES): string {
    return actionTypeToKeyMap[type] || ''
}
