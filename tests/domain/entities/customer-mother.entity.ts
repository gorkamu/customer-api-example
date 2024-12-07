import { faker } from '@faker-js/faker';
import {Customer} from "../../../src/domain/entities/customer.entity";

export class CustomerMother extends Customer {
    static create() {
        return Customer.create({
            id: faker.database.mongodbObjectId(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number({ style: 'international'})
        })
    }
}
