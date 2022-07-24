export async function GetLabs() {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/lab');
}

export async function PostLabs(newLabs) {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/lab', newLabs);
}

export async function PutLabs(id, modifieLabs) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/lab/${id}`, modifieLabs);
}

export async function DelLabs(id) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/lab/${id}`,  { method: 'DELETE'});
}