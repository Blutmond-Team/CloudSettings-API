export function isValid<T>(obj: any | Array<any>, ...keys: (keyof T)[]): obj is T {
    if (Array.isArray(obj)) {
        return isValidArray<T>(obj, ...keys);
    } else {
        for (const key of keys) {
            if (!obj.hasOwnProperty(key)) return false;
        }
        return true;
    }
}

export function isValidArray<T>(obj: Array<any>, ...keys: (keyof T)[]): obj is T[] {
    for (const entry of obj) {
        if (!isValid<T>(entry, ...keys)) return false;
    }

    return true;
}