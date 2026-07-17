window.CLASSROOM_SITE = {
  startContainer: "home",

  containers: {
    home: {
      title: "Ms. Campbell's Classroom",
      subtitle: "Choose an activity",
      parent: null,
      active: true,

      children: ["morning-meeting", "reading", "math"],

      layout: [
        {
          type: "navigation",
          container: "morning-meeting",
          image: "images/morning-meeting.jpg",
        },
        {
          type: "navigation",
          container: "reading",
          image: "images/reading.jpg",
        },
        {
          type: "navigation",
          container: "math",
          image: "images/math.jpg",
        },
        {
          type: "video",
          label: "Movement",
          image: "images/movement.jpg",
          target: "M7lc1UVf-VE",
        },
      ],
    },

    "morning-meeting": {
      title: "Morning Meeting",
      subtitle: "Choose a morning activity",
      parent: "home",
      active: true,

      children: ["calendar"],

      layout: [
        {
          type: "section",
          title: "Songs and Activities",
        },
        {
          type: "video",
          label: "Hello Song",
          image: "images/hello-song.jpg",
          target: "M7lc1UVf-VE",
        },
        {
          type: "navigation",
          container: "calendar",
          image: "images/calendar.jpg",
        },
      ],
    },

    reading: {
      title: "Reading",
      parent: "home",
      active: true,

      children: [],

      layout: [],
    },

    math: {
      title: "Math",
      parent: "home",
      active: true,

      children: [],

      layout: [],
    },

    calendar: {
      title: "Calendar",
      parent: "morning-meeting",
      active: true,

      children: [],

      layout: [],
    },
  },
};
