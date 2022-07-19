const header = new Headers({
    'Accept': 'application/json'
});

export async function GetCategory() {
    const response = await fetch('https://lablib-api.herokuapp.com/api/v1/category');
    const categories = await response.json();
    return categories;
}

export async function GetCategoryItem(id) {
    const response = await fetch(`https://lablib-api.herokuapp.com/api/v1/category/${id}/list`);
    const categories = await response.json();
    return categories;
}

export async function PostCategory(newCategory) {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/category', newCategory);
}

export async function PutCategory(id, modifieCategory) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/category/${id}`, modifieCategory);
}

export async function DelCategory(id) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/category/${id}`,  { method: 'DELETE'});
}



