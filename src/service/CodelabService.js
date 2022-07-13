export class CodelabService {
    getUsers(){
        return fetch('data/codelabs.json', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(d => d.data);
    }
}