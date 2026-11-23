import { cloneObject } from "./cloneObject";

export function ObjectTemplate<T extends Record<string, any>>(template: T)
                                                                : () => T {
    return () => {
        return cloneObject(template);
    }
}
