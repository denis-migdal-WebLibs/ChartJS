export const SHARED = Symbol();

export function sharedObject<const T extends Record<string, any>>(target: T): T {
    
    // @ts-expect-error
    target[SHARED] = true;

    return target;
}