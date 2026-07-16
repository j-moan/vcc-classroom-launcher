window.CLASSROOM_SITE = {
  startPage: "home",

  pages: {
    home: {
      header: "Ms. Campbell's Classroom",
      subtitle: "Choose an activity",
      parent: null,
      sections: [
        {
          heading: "",
          tiles: [
            {
              id: "morning-meeting",
              label: "Morning Meeting",
              image: "images/morning-meeting.jpg",
              type: "page",
              target: "morning-meeting",
              enabled: true,
            },
            {
              label: "Reading",
              image: "images/reading.jpg",
              type: "page",
              target: "reading",
            },
            {
              label: "Math",
              image: "images/math.jpg",
              type: "page",
              target: "math",
            },
            {
              label: "Movement",
              image: "images/movement.jpg",
              type: "video",
              target: "M7lc1UVf-VE",
            },
          ],
        },
      ],
    },

    "morning-meeting": {
      header: "Morning Meeting",
      subtitle: "Choose a morning activity",
      parent: "home",
      sections: [
        {
          heading: "Songs and Activities",
          tiles: [
            {
              label: "Hello Song",
              image: "images/hello-song.jpg",
              type: "video",
              target: "M7lc1UVf-VE",
            },
            {
              label: "Calendar",
              image: "images/calendar.jpg",
              type: "page",
              target: "calendar",
            },
          ],
        },
      ],
    },

    reading: {
      header: "Reading",
      parent: "home",
      sections: [],
    },

    math: {
      header: "Math",
      parent: "home",
      sections: [],
    },

    calendar: {
      header: "Calendar",
      parent: "morning-meeting",
      sections: [],
    },
  },
};
