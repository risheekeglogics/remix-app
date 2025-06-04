import { useLoaderData, Link } from "@remix-run/react";
import { products } from '../data/product';
import { PrismaClient } from "@prisma/client";
import {Page, Layout, Card, ResourceList, ResourceItem, Text} from "@shopify/polaris";

const prisma = new PrismaClient();

// const products = [{id: 69, name: "Toffees", price: 30 }, {id: 70, name: "Chocolates", price: 50 }, {id: 71, name: "Coke", price: 10 }]


export const loader = async ({ params }) => {

  const products = await prisma.product.findMany();

  const product = products.find(
    (product) => product.id.toString() === params.productid
  );

  if (!product) {
    throw new Response("Not Found", { status: 404 });
  }

  return { product };
};


export default function(){

    const { product } = useLoaderData();

    return(<Page title="Product Details">
      <Card>
        <Text>
          <ul>
         <li>{product.name}</li>
         <li>{product.price}</li>
         </ul>
        <Link to="/app/products/">Go back to products</Link>
        </Text>
      </Card>
    </Page>); 
}


// export default function(){

//     const { product } = useLoaderData();

//     return(<div>
//         <ul>
//         <li>{product.name}</li>
//         <li>{product.price}</li>
//         </ul>
//         <Link to="/app/products/">Go back to products</Link>
//     </div>); 
// }