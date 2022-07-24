// converting time to milliSeconde
export const Time = (time) => {
    let hours=0, minutes=0;
    let timeParts = time.split(":");
    if(timeParts[0]) hours = +timeParts[0] * (60000 * 60);
    if(timeParts[1]) minutes =  +timeParts[1] * 60000;
    return hours+ minutes
}


export const findIdCategory = (name, categories) => {
    const _category =  categories.filter(item => (
        item.name === name
    ));
    if(_category.length) return _category[0].id
}

export const findIdCourse = (name, courses) => {
    const _course =  courses.filter(item => (
        item.name === name
    ));
    if(_course.length) return _course[0].id
}

export  const findIdChapiter = (name, chapiters) => {
    const _chapiter =  chapiters.filter(item => (
        item.name === name
    ));
    if(_chapiter.length) return _chapiter[0].id
}