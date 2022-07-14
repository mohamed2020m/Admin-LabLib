export class CategoryService {
    getCategory(id=null, method="GET", data=""){
        let newCategory, raw;

        const header = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json', 
        });

        if(method === 'POST' || method === 'PUT'){
            raw = JSON.stringify(data);
            newCategory = {
                method: method,
                headers: header,
                body: raw,
                redirect: 'follow'
            }
        }
        else{
            newCategory = {
                headers: header
            }
        }
    
        if(method === "POST"){
            return fetch("https://admin-newlablib.herokuapp.com/http://projet-apis.herokuapp.com/api/v1/category", newCategory)
            .then(res => {
                if(res.ok){
                    res.json()
                }
                throw res;
            })
            .then(d => d)
            .catch(error => console.log('error', error));
        }
        else if(method === "GET"){
            return fetch('https://admin-newlablib.herokuapp.com/http://projet-apis.herokuapp.com/api/v1/category', newCategory)
            .then(res => {
                if(res.ok){
                    res.json()
                }
                throw res;
            })
            .then(d => d)
            .catch(error => console.log('error', error));
        }
        else if(method === 'PUT'){
            return fetch(`https://admin-newlablib.herokuapp.com/http://projet-apis.herokuapp.com/api/v1/category/${id}`, newCategory)
            .then(res => {
                if(res.ok){
                    res.json()
                }
                throw res;
            })
            .then(d => d.data)
            .catch(error => console.log('error', error));
        }
        else if(method === 'DELETE'){
            return fetch(`https://admin-newlablib.herokuapp.com/http://projet-apis.herokuapp.com/api/v1/category/${id}`, newCategory)
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
}



