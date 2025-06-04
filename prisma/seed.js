import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(){
await prisma.product.createMany({
    data: [    { id: 1, name: "Organic Honey", price: '150' },
  { id: 2, name: "Gluten-Free Pasta", price: '120' },
  { id: 3, name: "Vegan Chocolate", price: '200' },
]
})
}


main()
.catch((e) => {
    console.log(e);
})
.finally(() => {
    prisma.$disconnect();
})