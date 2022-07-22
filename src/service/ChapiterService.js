const header = new Headers({
    'Accept': 'application/json'
});

export async function GetChapiter() {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/chapter');
}

export async function GetChapiterItem(id) {
    const response = await fetch(`https://lablib-api.herokuapp.com/api/v1/chapter/${id}/list`);
    const categories = await response.json();
    return categories;
}

export async function PostChapiter(newChapiter) {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/chapter', newChapiter);
}

export async function PutChapiter(id, data) {
    let modifieChapiter = {
        method: 'PUT',
        headers: header,
        body: JSON.stringify(data),
        redirect: 'follow'
    }
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/chapter/${id}`, modifieChapiter);
}

export async function DelChapiter(id) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/chapter/${id}`,  { method: 'DELETE'});
}
