import {Entity} from "../../../src/shared/entities/base.entity";

class TestEntity extends Entity {
    static create(from: object): TestEntity {
        const entity = new TestEntity();
        Object.assign(entity, from);
        return entity;
    }
}

describe('Entity', () => {
    it('creates an entity from a valid JSON object', () => {
        const json = { id: 1, name: 'Test' };
        const entity = Entity.createFromJson<TestEntity>(json, TestEntity);

        expect(entity).toBeInstanceOf(TestEntity);
        expect(entity).toEqual(expect.objectContaining(json));
    });

    it('throws an error when create method is not implemented in subclass', () => {
        class IncompleteEntity extends Entity {}

        const json = { id: 1, name: 'Test' };

        expect(() => Entity.createFromJson<IncompleteEntity>(json, IncompleteEntity)).toThrow();
    });


    it('handles empty JSON object', () => {
        const json = {};
        const entity = Entity.createFromJson<TestEntity>(json, TestEntity);

        expect(entity).toBeInstanceOf(TestEntity);
        expect(entity).toEqual(expect.objectContaining(json));
    });

    it('handles null JSON object', () => {
        const json = null;
        expect(() => {
            if (json === null) throw new Error('Invalid JSON object');
            Entity.createFromJson<TestEntity>(json, TestEntity);
        }).toThrow('Invalid JSON object');
    });
});
