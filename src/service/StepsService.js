export async function GetSteps() {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/step');
}

export async function PostSteps(newSteps) {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/step', newSteps);
}

export async function PutSteps(id, modifieSteps) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/step/${id}`, modifieSteps);
}

export async function DelSteps(id) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/step/${id}`,  { method: 'DELETE'});
}