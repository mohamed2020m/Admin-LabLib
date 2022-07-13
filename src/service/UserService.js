
export class UserService {
    getUsers() {
        return fetch('data/users.json',{
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(d => d.data)
        .catch((error) => {
            console.log('Error happened here!')
            console.log(error)
        })
    }
}
    