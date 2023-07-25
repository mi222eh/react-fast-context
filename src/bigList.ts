import {faker} from '@faker-js/faker';

export type Person = {
    name: string,
    age: number,
    city: string,
    userId: string
}
export const peopleData: Person[] = Array(20000).fill(0).map(() => ({
    name: faker.internet.displayName(),
    userId: faker.internet.ip(),
    age: faker.datatype.number(100),
    city: faker.location.city()
}));

