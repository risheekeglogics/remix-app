import { Link, useLoaderData, Outlet } from "@remix-run/react";
// import { products } from '../data/product';
import { PrismaClient } from "@prisma/client";
import {Page, Layout, Card, ResourceList, ResourceItem, Text} from "@shopify/polaris";

const prisma = new PrismaClient();

export const loader = async () => {
    const products = await prisma.product.findMany();
    return {products}
    
}



export default function ProductsPage() {
  const { products } = useLoaderData();

  return (
    <Page title="Products">
      {products.map((product) => (
        <Card key={product.id} sectioned>
          <Text variant="headingMd" as="h2">
            <Link to={`/app/${product.id}`}>
              {product.name} — ₹{product.price}
            </Link>
          </Text>
        </Card>
      ))}
    </Page>
  );
}

// export default function(){

//     const { products } = useLoaderData();

//     console.log(products);

//     return(<div>
//         <h1>Products</h1>
        
//             <ul>
//         {
//             products.map((product) => (<li><Link to={`/app/${product.id}`}>{product.name} | {product.price} USD</Link></li>))
//         }
//             </ul>
//         <Outlet/>
//     </div>);
// }