const header = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

export async function getCategory() {
    const response = await fetch('https://lablib-api.herokuapp.com/api/v1/category');
    const categories = await response.json();
    return categories;
}
export class CategoryService {
    // getCategory(){
    //     return fetch('https://lablib-api.herokuapp.com/api/v1/category', { 
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Accept': 'application/json'
    //         }
    //     })
    //     .then(res => {
    //         if(res.ok){
    //             res.json();
    //         }
    //         else{
    //             throw res;
    //         }
    //     })
    //     .then(data => {
    //         // console.log("data:", d);
    //         return data;
    //     })
    //     .catch(error => console.log('error', error));
    // }

    postCategory(data){
        let newCategory = {
            method: 'POST',
            headers: header,
            body: JSON.stringify(data),
            redirect: 'follow'
        }
        return fetch("/api/v1/category", newCategory)
            .then(res => {
                if(res.ok){
                    res.json()
                }
                throw res;
            })
            .then(d => d)
            .catch(error => console.log('error', error));
    }
    
    putCategory(id, data){
        let newCategory = {
            method: 'PUT',
            headers: header,
            body: JSON.stringify(data),
            redirect: 'follow'
        }
        return fetch("/api/v1/category", newCategory)
            .then(res => {
                if(res.ok){
                    res.json()
                }
                throw res;
            })
            .then(d => d)
            .catch(error => console.log('error', error));
    }

    deleteCategory(id){
        let newCategory = {
            method: 'DELETE',
            headers: header,
            redirect: 'follow'
        }
        return fetch(`api/v1/category/${id}`, newCategory)
            .then(res => {
                if(res.ok){
                    res.json()
                }
                throw res;
            })
            .then(d => d.data)
            .catch(error => console.log('error', error));
    }
}



