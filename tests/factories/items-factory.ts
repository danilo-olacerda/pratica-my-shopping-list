import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import { items } from '@prisma/client';
import { faker } from '@faker-js/faker';
type IItemData = items;

async function newItem(autoInsert: boolean, itemData?: Partial<IItemData>) {

    const data: Partial<IItemData> = itemData || {
        title: faker.commerce.productName(),
        url: 'http://item1.com',
        description: 'Item 1 description',
        amount: 10,
    };

    if (autoInsert) {
        return await prisma.items.create({ data: data as IItemData });
    }
        
    return data;

}

export { newItem, prisma };
