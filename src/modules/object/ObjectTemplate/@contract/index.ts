export interface ObjectTemplateDetails {

    ObjectTemplate<T extends Record<string, any>>(template: T) : () => T
    
    /**
     * `sharedObject(obj)
     * In the ObjectTemplate, this subpart will be shared by reference instead of being copied.
     */
    sharedObject<const T extends Record<string, any>>(target: T): T
}