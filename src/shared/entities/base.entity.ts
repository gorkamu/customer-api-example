export abstract class Entity {
    /**
     * @param from T extends Entity
     * @param _c Class type of T
     */
    static createFromJson<T>(from: object, _c = Entity as T): T {
        // @ts-ignore
        return _c.create(from) as T;
    }
}
