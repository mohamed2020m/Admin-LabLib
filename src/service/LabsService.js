export async function GetLabs() {
    const response = await fetch('https://lablib-api.herokuapp.com/api/v1/lab');
    const labs = await response.json();
    return labs;
}

export async function PostLabs(newLabs) {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/lab', newLabs);
}

export async function PutLabs(id, data) {
    let modifieLabs = {
        method: 'PUT',
        headers: header,
        body: JSON.stringify(data),
        redirect: 'follow'
    }
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/lab/${id}`, modifieLabs);
}

export async function DelLabs(id) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/lab/${id}`,  { method: 'DELETE'});
}