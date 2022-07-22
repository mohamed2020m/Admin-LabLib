// converting time to milliSeconde
export const Time = (time) => {
    var timeParts = time.split(":");
    return (+timeParts[0] * (60000 * 60)) + (+timeParts[1] * 60000);
}