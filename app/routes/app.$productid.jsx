import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { products } from '../data/product';
import { PrismaClient } from "@prisma/client";
import {Page, Layout, Card, ResourceList, ResourceItem, Text} from "@shopify/polaris";

const prisma = new PrismaClient();

// const products = [{id: 69, name: "Toffees", price: 30 }, {id: 70, name: "Chocolates", price: 50 }, {id: 71, name: "Coke", price: 10 }]


export const loader = async ({ params, request }) => {

  const {admin} = await authenticate.admin(request);

    const query = `
    query product($id: ID!) {
      product(id: $id) {
        title
        descriptionHtml
        totalInventory
        variants(first: 5) {
          edges {
            node {
              title
              price
            }
          }
        }
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
      }
    }
  `;

  const globalId = `gid://shopify/Product/${params.productid}`;

  const response = await admin.graphql(query, {variables: {id: globalId}});
  const result = await response.json();

  return json({product: result.data.product});

  
};


export default function(){

    const { product } = useLoaderData();

    console.log(product);

    return(<Page title="Product Details">
      <Card>
        <Text>
          <ul>
         <img src={product.images?.edges?.[0].node.originalSrc} style={{width:"150px"}}></img> 
         <li>{product.title}</li>
         <li>{product.variants.edges[0].node.price}</li>
         <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}}></div>
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