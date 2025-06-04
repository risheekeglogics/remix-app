import { Link, useLoaderData, Outlet, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
// import { products } from '../data/product';
import { PrismaClient } from "@prisma/client";
import {
  Card,
  Page,
  TextField,
  ResourceList,
  ResourceItem,
  Pagination,
} from "@shopify/polaris";
import { useState } from "react";
import {authenticate} from "../shopify.server";

const prisma = new PrismaClient();

export const loader = async ({request}) => {


    const {admin} = await authenticate.admin(request);
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const cursor = url.searchParams.get('cursor');
    const direction = url.searchParams.get('direction');

    
  let query = `
    query($first: Int, $last: Int, $after: String, $before: String, $query: String) {
      products(
        first: $first
        last: $last
        after: $after
        before: $before
        query: $query
      ) {
        edges {
          cursor
          node {
            id
            title
            handle
            totalInventory
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
        pageInfo {
          hasNextPage
          hasPreviousPage
           startCursor
          endCursor
        }
      }
        
    }
  `;

  const variables = {
    first: direction !== "prev" ? 5 : null,
    last: direction === "prev" ? 5 : null,
    after: direction !== "prev" ? cursor : null,
    before: direction === "prev" ? cursor : null,
    query: search ? `title:*${search}*` : null,

  };


  const response = await admin.graphql(query, {variables});
  const result = await response.json();

    // const products = await prisma.product.findMany();
    return json({
      products: result.data.products.edges,
      pageInfo: result.data.products.pageInfo,
      search
    })
    
}



export default function ProductsPage() {
  const { products, pageInfo, search } = useLoaderData();
  const [searchTerm, setSearchTerm] = useState(search || "");
  console.log(products);
  
  const firstcursor = products?.[0]?.cursor ?? "";
  const lastCursor = products?.[products.length - 1]?.cursor ?? "";


  return (
     <Page title="Products">
      <Card sectioned>
        <Form method="get">
          <TextField
            label="Search products"
            value={searchTerm}
            name="search"
            onChange={setSearchTerm}
            autoComplete="off"
          />
          <button type="submit" style={{ marginTop: "10px" }}>Search</button>
        </Form>
      </Card>

      <Card>
        <ResourceList
          resourceName={{ singular: "product", plural: "products" }}
          items={products}
          media
          renderItem={({ node }) => {
            const { id, title, handle, totalInventory, images } = node;
            const productId = id.split("/").pop();
            const image = images?.edges?.[0]?.node;
            return (
              
              <ResourceItem id={id} accessibilityLabel={`View details for ${title}`}  url={`/app/${productId}`}  media={
        image?.originalSrc ? (
          <img
            src={image.originalSrc}
            alt={image.altText || title}
            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : null
      }>
                <h3>{title}</h3>
                <div>Handle: {handle}</div>
                <div>Inventory: {totalInventory}</div>
              </ResourceItem>
              
            );
          }}
        />
      </Card>

      <div style={{ marginTop: "1rem" }}>
        
        <Form method="get" style={{ display: "flex", justifyContent: "space-between" }}>
          <input type="hidden" name="cursor" value={firstcursor} />
          <input type="hidden" name="direction" value="prev" />
          <button disabled={!pageInfo.hasPreviousPage} type="submit">Previous</button>
        </Form>

        <Form method="get" style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
          <input type="hidden" name="cursor" value={lastCursor} />
          <input type="hidden" name="direction" value="next" />
          <button disabled={!pageInfo.hasNextPage} type="submit">Next</button>
        </Form>
      </div>
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