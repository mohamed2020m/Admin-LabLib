export async function GetSteps() {
    const response = await fetch('https://lablib-api.herokuapp.com/api/v1/step');
    const Steps = await response.json();
    return Steps;
}

export async function PostSteps(newSteps) {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/step', newSteps);
}

export async function PutSteps(id, data) {
    let modifieSteps = {
        method: 'PUT',
        headers: header,
        body: JSON.stringify(data),
        redirect: 'follow'
    }
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/step/${id}`, modifieSteps);
}

export async function DelSteps(id) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/step/${id}`,  { method: 'DELETE'});
}