// converting time to milliSeconde
export const Time = (time) => {
    let hours=0, minutes=0;
    let timeParts = time.split(":");
    if(timeParts[0]) hours = +timeParts[0] * (60000 * 60);
    if(timeParts[1]) minutes =  +timeParts[1] * 60000;
    return hours+ minutes
}
