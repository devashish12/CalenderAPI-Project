var event = {
    'summary': 'testing',
    'location': 'Delhi India',
    'description': 'testing Calender API',
    'start': {
      'dateTime': '2018-10-22T09:00:00-07:00',
      'timeZone': 'INDIA/NEW DELHI',
    },
    'end': {
      'dateTime': '2018-10-22T17:00:00-07:00',
      'timeZone': 'INDIA/NEW DELHI',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': 'vatsdev.1998@gmail.com'},
      {'email': 'vatsdev.1998@gmail.com'},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 1500},
      ],
    },
  };

  module.exports.event=event;
