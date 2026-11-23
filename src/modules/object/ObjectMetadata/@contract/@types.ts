export type ObjectMetadata<T> = {
    set(target: object, value: T): void;
    get(target: object): T;
    getOrNull(target: object): T|null;
    has(target: object): boolean;
}