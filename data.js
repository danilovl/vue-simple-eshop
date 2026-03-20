const { faker } = require('@faker-js/faker');

const products = [];

faker.seed(100);

for (let i = 1; i <= 50; i++) {
    products.push({
        id: i,
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 10000 })),
        rating: faker.number.int({ min: 0, max: 5 }),
        ratingCount: faker.number.int({ min: 0, max: 10000 }),
        image: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
    });
}

module.exports = function () {
    return {
        products: products,
        orders: []
    };
};
