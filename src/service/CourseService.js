const header = new Headers({
    'Accept': 'application/json'
});

export async function GetCourse() {
    const response = await fetch('https://lablib-api.herokuapp.com/api/v1/course');
    const courses = await response.json();
    return courses;
}

export async function GetCourseItem(id) {
    const response = await fetch(`https://lablib-api.herokuapp.com/api/v1/course/${id}/list`);
    const courses = await response.json();
    return courses;
}

export async function PostCourse(newCourse) {
    return await fetch('https://lablib-api.herokuapp.com/api/v1/course', newCourse);
}

export async function PutCourse(id, modifieCourse) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/course/${id}`, modifieCourse);
}

export async function DelCourse(id) {
    return await fetch(`https://lablib-api.herokuapp.com/api/v1/course/${id}`,  { method: 'DELETE'});
}
