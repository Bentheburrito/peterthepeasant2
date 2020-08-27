// Simplified battle command - UOT functions are unused atm.
const parseTimeData = (time, uot) => {

    let ms = time;
    uot = determineUOT(uot);
    switch (uot) {
        case 'second(s)':
        ms *= 1000;
            break;
        case 'minute(s)':
        ms *= 1000 * 60;
            break;
        case 'hour(s)': 
        ms *= 1000 * 60 * 60;
            break;
        case 'day(s)':
        ms += 1000 * 60 * 60 * 24;
            break;
    }

    return data = {ms, time, uot};
}

const determineUOT = (uot) => {

    if (uot.startsWith('sec') || uot === 's') uot = 'second(s)';
    else if (uot.startsWith('min') || uot === 'm') uot = 'minute(s)';
    else if (uot.startsWith('hour') || uot === 'h') uot = 'hour(s)';
    else if (uot.startsWith('day') || uot === 'd') uot = 'day(s)';
    else uot = undefined;
    
    return uot;
}

const getTimeUntil = (ms) => {
    let timeLeftSeconds = ms / 1000;
    let timeStamp = Math.floor(timeLeftSeconds) + " second(s)";
    if (timeLeftSeconds / 60 >= 60) timeStamp = `${Math.floor(timeLeftSeconds / 60 / 60)} hour(s), ${Math.floor(timeLeftSeconds / 60 - Math.floor(timeLeftSeconds / 60 / 60) * 60)} minute(s), ${Math.floor(timeLeftSeconds - Math.floor(timeLeftSeconds / 60) * 60)} second(s)`;
    else if (timeLeftSeconds >= 60) timeStamp = `${Math.floor(timeLeftSeconds / 60)} minute(s), ${Math.floor(timeLeftSeconds - Math.floor(timeLeftSeconds / 60) * 60)} second(s)`;

    timeStamp = timeStamp.replace(', 0 minute(s)', '');
    timeStamp = timeStamp.replace(', 0 second(s)', '');
    return timeStamp;
}

const delay = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}

module.exports = {
    parseTimeData,
    determineUOT,
    getTimeUntil,
    delay
}