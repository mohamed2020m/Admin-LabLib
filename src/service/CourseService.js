const header = new Headers({
    'Accept': 'application/json'
});

export async function GetCourse() {
    const response = await fetch('https://lablib-api.herokuapp.com/api/v1/course');
    const courses = await response.json();
    return courses;
}

export async function PostCourse(newCourse) {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/course', newCourse);
}

export async function PutCourse(id, data) {
    let modifieCourse = {
        method: 'PUT',
        headers: header,
        body: JSON.stringify(data),
        redirect: 'follow'
    }
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/course/${id}`, modifieCourse);
}

export async function DelCourse(id) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/course/${id}`,  { method: 'DELETE'});
}
