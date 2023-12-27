import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { toast } from "react-toastify";

export function generateUuid(arg) {
    const namespace = uuidv4();
    const generatedUuid = uuidv5(arg, namespace);

    return generatedUuid
}

export default async function createUser(name, email, image) {
    const generatedUuid = generateUuid(email);

    try {
        await fetch(`https://wasteful-brown.cmd.outerbase.io/createUser`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                user_id: generatedUuid,
                name: name,
                email: email,
                image: image,
            }),
        });
        localStorage.removeItem("isAuthenticated")
        toast.success("Logged In successfully!", {
            position: toast.POSITION.TOP_RIGHT
        })
    } catch (error) {
        toast.error("There was an error while logging in!", {
            position: toast.POSITION.TOP_RIGHT
        })
    }
}

export async function getUser(paramVal, byEmail=true) {
    const param = byEmail? "email" : "user_id"
    const endpoint = byEmail? "getUser" : "getUserById"
    try {
        const response = await fetch(`https://wasteful-brown.cmd.outerbase.io/${endpoint}?${param}=${paramVal}`, {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        // console.log(await response.text())
        const userData = await response.json(); // Parse the response body as JSON
        return userData; // Return the parsed data
    } catch (error) {
        console.log(error, "err")
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

export async function getBlog(paramVal, byPostId=true, endpoint) {
    const param = byPostId? "post_id" : "user_id"
    const blogEndpoint = endpoint? endpoint : byPostId? "getBlogById" : "getBlogsByUserId"

    try {
        const response = await fetch(`https://wasteful-brown.cmd.outerbase.io/${blogEndpoint}?${param}=${paramVal}`, {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const blogData = await response.json(); // Parse the response body as JSON
        return blogData; // Return the parsed data
    } catch (error) {
        toast.error("There was an error while getting user!", {
            position: toast.POSITION.TOP_RIGHT
        })
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

export function getCloudinaryImgUrl(img_id) {
    if (!img_id || img_id === "%!s(<nil>)") return ""
    
    return `https://res.cloudinary.com/dxzo4ug5i/image/upload/${img_id}`
}

export function formatTimestamp(time) {
    const timeArr = time.split("T")[0].split("-") // YY - MM - DD
    const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const formattedStr = `${monthArr[+timeArr[1] - 1]} ${timeArr[2]}, ${timeArr[0]}`

    return formattedStr;
}