
import { useLoaderData } from "@remix-run/react";

export const loader = async() => {

return {tags: ['giraffe', 'elephant', 'dog']};

};

export default function(){

    const {tags} = useLoaderData();

    return(
        <div>
            <h2>Tags</h2>
            <ul>
                {
                    tags.map((tag) => (<li>{tag}</li>))
                }
            </ul>        
        </div>
    );
}