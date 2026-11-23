// We can't use "this" if we want to be able to reuse the function.
export type Effects<O, T extends Record<string, any>> = {
    [K in keyof T]: (target: O, value: T[K], values: T) => void
}

export type UpdateFct = () => void;