import { useLoaderData } from "@remix-run/react";

export const loader = async() => {
    const currentTime = new Date().toLocaleTimeString();
    return {greeting: "Welcome to the About page",
            currentTime
    }
}

export default function(){
    const { greeting, currentTime } = useLoaderData();

    return (
        <div>
            <h2>{ greeting }</h2>
            <p>Current Server Time: {currentTime}</p>
        </div>
    );
}