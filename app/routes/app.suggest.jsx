import { useActionData, Form } from "@remix-run/react";
import prisma from "../db.server";

export const action = async ({request}) => {
const formData = await request.formData();

const name = formData.get('name');
const price = formData.get('price');

if(!name || !price){
return {error: "All fields are mandatory to be filled"};
}

await prisma.productSuggestion.create({data: {name, price}})

return {success: `Product with name ${name} at price ${price} is suggested!`};
}

export default function(){

    const data = useActionData();

    return(<div>
      <h2>Suggest a Product</h2>
      <Form method="post">
        <label>
          Product Name:
          <input type="text" name="name" />
        </label>
        <br />
        <label>
          Price (USD):
          <input type="number" name="price" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </Form>
{data?.error && <p style={{color: "red"}}>{data.error}</p> }
{data?.success && <p style={{color: "green"}}>{data.success}</p>}
    </div>);
}