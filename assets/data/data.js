"use strict";

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
          id: "nav-morning-meeting",
          type: "navigation",
          container: "morning-meeting",
          image: "morning-meeting.jpg",
          active: true,
        },
        {
          id: "nav-reading",
          type: "navigation",
          container: "reading",
          image: "reading.jpg",
          active: true,
        },
        {
          id: "nav-math",
          type: "navigation",
          container: "math",
          image: "math.jpg",
          active: true,
        },
        {
          id: "movement-video",
          type: "video",
          label: "Movement",
          image: "movement.jpg",
          target: "M7lc1UVf-VE",
          active: true,
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
          id: "section-songs",
          type: "section",
          label: "Songs and Activities",
          active: true,
        },
        {
          id: "hello-song",
          type: "video",
          label: "Hello Song",
          image: "hello-song.jpg",
          target: "M7lc1UVf-VE",
          active: true,
        },
        {
          id: "nav-calendar",
          type: "navigation",
          container: "calendar",
          image: "calendar.jpg",
          active: true,
        },
      ],
    },

    reading: {
      title: "Reading",
      subtitle: "",
      parent: "home",
      active: true,

      children: [],

      layout: [],
    },

    math: {
      title: "Math",
      subtitle: "",
      parent: "home",
      active: true,

      children: [],

      layout: [],
    },

    calendar: {
      title: "Calendar",
      subtitle: "",
      parent: "morning-meeting",
      active: true,

      children: [],

      layout: [],
    },
  },
};
