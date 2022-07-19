const header = new Headers({
    'Accept': 'application/json'
});

export async function GetChapiter() {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/Chapter');
}

export async function PostChapiter(newChapiter) {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/Chapter', newChapiter);
}

export async function PutChapiter(id, data) {
    let modifieChapiter = {
        method: 'PUT',
        headers: header,
        body: JSON.stringify(data),
        redirect: 'follow'
    }
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/Chapter/${id}`, modifieChapiter);
}

export async function DelChapiter(id) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/Chapter/${id}`,  { method: 'DELETE'});
}
