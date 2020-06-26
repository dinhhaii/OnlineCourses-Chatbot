module.exports = {
  validURL: function validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  },

  validTime: function(string) {
    const regex24hourFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3])\s*:\s*([0-5][0-9]|[0-9])/g; // 13:30
    const regex24hourFormatWithMinHour = /^([0-9]|0[0-9]|1[0-9]|2[0-3])\s*[hH]\s*([0-5][0-9]|[0-9])\s*[mM]?/g; // 13h30m
    const regex12hourFormat = /^(0?[0-9]|1?[0-2])\s*:\s*([0-9]|[0-5][0-9])\s*([AaPp][Mm])/g; // 1:30pm
    const regex12hourFormatWithMinHour = /^(0?[0-9]|1?[0-2])\s*[hH]?\s*([0-9]|[0-5][0-9])\s*[mM]?\s*([AaPp][Mm])/g; // 1h30m pm
  
    let executor12hourFormat = regex12hourFormat.exec(string);
    if (executor12hourFormat) {
      const meridiem = executor12hourFormat[3];
      let hour = parseInt(executor12hourFormat[1]);
      if (meridiem === 'pm' && hour != 12) {
        hour = hour + 12;
      }
      if (meridiem === 'am' && hour == 12) {
        hour = 0;
      }
      return `${hour}:${executor12hourFormat[2]}`; 
    }

    let executor12hourFormatWithMinHour = regex12hourFormatWithMinHour.exec(string);
    if (executor12hourFormatWithMinHour) {
      const meridiem = executor12hourFormatWithMinHour[3];
      let hour = parseInt(executor12hourFormatWithMinHour[1]);
      if (meridiem === 'pm' && hour != 12) {
        hour = hour + 12;
      }
      if (meridiem === 'am' && hour == 12) {
        hour = 0;
      }
      return `${hour}:${executor12hourFormatWithMinHour[2]}`;
    }

    let executor24hourFormat = regex24hourFormat.exec(string);
    if (executor24hourFormat) {
      return `${executor24hourFormat[1]}:${executor24hourFormat[2]}`; 
    }
    
    let executor24hourFormatWithMinHour = regex24hourFormatWithMinHour.exec(string);
    if (executor24hourFormatWithMinHour) {
      return `${executor24hourFormatWithMinHour[1]}:${executor24hourFormatWithMinHour[2]}`; 
    }
    
    return null;
  },

  validDays: function(days) {
    const tokens = days.split(',').map(value => value.toLowerCase().trim());
    const result = [];

    if (tokens.indexOf("daily") !== -1 || tokens.indexOf("everyday") !== -1) {
      return [0,1,2,3,4,5,6];
    }

    tokens.forEach(value => {
      switch(value) {
        case "sunday": result.push(0); break;
        case "monday": result.push(1); break;
        case "tuesday": result.push(2); break;
        case "wednesday": result.push(3); break;
        case "thursday": result.push(4); break;
        case "friday": result.push(5); break;
        case "saturday": result.push(6); break;
      }
      if (value >= 0 && value <= 6) {
        result.push(parseInt(value));
      }
    });

    return [ ...new Set(result) ];
  },

  getDayString: function(days) {
    if (days.length === 7) {
      return 'Everyday';
    }
    return days.map(value => {
      switch(value) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
      }
    }).join(', ');
  },

  findTimeAndDays: function(message) {
    const result = [];
    
    // Time
    const regex24hourFormat = /(0?[0-9]|1[0-9]|2[0-3])\s*:\s*([0-5][0-9]|[0-9])/g; // 13:30
    const regex24hourFormatWithMinHour = /(0?[0-9]|1[0-9]|2[0-3])\s*[hH]\s*([0-5][0-9]|[0-9])?\s*[mM]?/g; // 13h30m
    const regex12hourFormat = /(0?[0-9]|1?[0-2])\s*:\s*([0-9]|[0-5][0-9])\s*([AaPp][Mm])/g; // 1:30pm
    const regex12hourFormatWithMinHour = /(0?[0-9]|1?[0-2])\s*[hH]?\s*([0-9]|[0-5][0-9])?\s*[mM]?\s*([AaPp][Mm])/g; // 1h30m pm

    let executor12hourFormat = regex12hourFormat.exec(message);
    let executor12hourFormatWithMinHour = regex12hourFormatWithMinHour.exec(message);
    let executor24hourFormat = regex24hourFormat.exec(message);
    let executor24hourFormatWithMinHour = regex24hourFormatWithMinHour.exec(message);
    
    if (executor12hourFormat) {
      const meridiem = executor12hourFormat[3];
      let hour = parseInt(executor12hourFormat[1]);
      if (meridiem === 'pm' && hour != 12) {
        hour = hour + 12;
      }
      if (meridiem === 'am' && hour == 12) {
        hour = 0;
      }
      result.push(`${hour}:${executor12hourFormat[2]}`); 
    } else if (executor12hourFormatWithMinHour) {
      const meridiem = executor12hourFormatWithMinHour[3];
      let hour = parseInt(executor12hourFormatWithMinHour[1]);
      console.log(hour);
      let min = executor12hourFormatWithMinHour[2] ? parseInt(executor12hourFormatWithMinHour[2]) : '00';
      if (meridiem === 'pm' && hour != 12) {
        hour = hour + 12;
      }
      if (meridiem === 'am' && hour == 12) {
        hour = 0;
      }
      result.push(`${hour}:${min}`);
    } else if (executor24hourFormat) {
      result.push(`${executor24hourFormat[1]}:${executor24hourFormat[2]}`); 
    } else if (executor24hourFormatWithMinHour) {
      let min = executor24hourFormatWithMinHour[2] ? parseInt(executor24hourFormatWithMinHour[2]) : '00';
      result.push(`${executor24hourFormatWithMinHour[1]}:${min}`); 
    }

    // Days
    let days = [];
    const regexDays = /((every|mon|tues|wed(nes)?|thur(s)?|fri|sat(ur)?|sun)(day)?(s)?)\b/ig;
    while ((executorDays = regexDays.exec(message.toLowerCase())) !== null) {
      if (executorDays.index === regexDays.lastIndex) {
        regexDays.lastIndex++;
      }
      if (executorDays[0]) {
        let value = executorDays[0];
        value = value[value.length - 1] === 's' ? value.substr(0, value.length - 1) : value;
        switch(value) {
          case "sun":
          case "sunday": days.push(0); break;
          case "mon":
          case "monday": days.push(1); break;
          case "tues":
          case "tuesday": days.push(2); break;
          case "wed":
          case "wednesday": days.push(3); break;
          case "thur":
          case "thursday": days.push(4); break;
          case "fri":
          case "friday": days.push(5); break;
          case "sat":
          case "saturday": days.push(6); break;
          case "everyday":
          case "daily": days = [0,1,2,3,4,5,6]; break;
        }
      }
    }
    if (days.length !== 0) {
      result.push(days);
    }
    
    if (result.length === 0 || result.length === 1) {
      return [];
    }
    return result[0] && result[1] ? result : [];
    
  }
};

