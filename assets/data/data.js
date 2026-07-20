"use strict";

window.CLASSROOM_SITE = {
  "startContainer": "home",
  "containers": {
    "home": {
      "title": "Ms. Campbell's Classroom",
      "subtitle": "Choose an activity",
      "parent": null,
      "active": true,
      "children": [
        "morning-meeting",
        "reading",
        "math"
      ],
      "layout": [
        {
          "id": "nav-morning-meeting",
          "type": "navigation",
          "container": "morning-meeting",
          "image": "morning-meeting.jpg",
          "active": true
        },
        {
          "id": "section-2873ecbd-8a3f-49c2-9dc1-93bac71480f5",
          "type": "section",
          "label": "separator",
          "active": true
        },
        {
          "id": "nav-math",
          "type": "navigation",
          "container": "math",
          "image": "math.jpg",
          "active": true
        },
        {
          "id": "movement-video",
          "type": "video",
          "label": "Movement",
          "image": "movement.jpg",
          "target": "M7lc1UVf-VE",
          "active": true
        }
      ]
    },
    "morning-meeting": {
      "title": "Morning Meeting",
      "subtitle": "Choose a morning activity",
      "parent": "home",
      "active": true,
      "children": [
        "calendar"
      ],
      "layout": [
        {
          "id": "section-songs",
          "type": "section",
          "label": "Songs and Activities",
          "active": true
        },
        {
          "id": "hello-song",
          "type": "video",
          "label": "Hello Song",
          "image": "hello-song.jpg",
          "target": "M7lc1UVf-VE",
          "active": true
        },
        {
          "id": "nav-calendar",
          "type": "navigation",
          "container": "calendar",
          "image": "calendar.jpg",
          "active": true
        },
        {
          "id": "tile-25fd7fe9-ccee-424d-bfb0-8250b3800912",
          "type": "information",
          "label": "helloo song message",
          "image": "hello-song.jpg",
          "target": "hello i am working :-)",
          "active": true
        },
        {
          "id": "tile-65c5b1e9-dc03-4644-b15e-3ffc8f17ff75",
          "type": "placeholder",
          "label": "null test",
          "image": "",
          "target": "",
          "active": true
        }
      ]
    },
    "reading": {
      "title": "Reading",
      "subtitle": "",
      "parent": "home",
      "active": true,
      "children": [],
      "layout": [
        {
          "id": "tile-478600eb-2d2e-4f45-9000-1c6e20be7e34",
          "type": "pdf",
          "label": "Brown Bear",
          "image": "cover brown bear.jpg",
          "target": "brown-bear-bk.pdf",
          "active": true
        }
      ]
    },
    "math": {
      "title": "Math",
      "subtitle": "",
      "parent": "home",
      "active": true,
      "children": [
        "math-videos"
      ],
      "layout": [
        {
          "type": "navigation",
          "container": "math-videos",
          "image": ""
        }
      ]
    },
    "calendar": {
      "title": "Calendar",
      "subtitle": "",
      "parent": "morning-meeting",
      "active": true,
      "children": [],
      "layout": [
        {
          "id": "tile-b1691105-14d2-4aa4-b46a-f4479374b7dc",
          "type": "information",
          "label": "octopus test",
          "image": "octopus.jpg",
          "target": "happy swimming",
          "active": true
        }
      ]
    },
    "math-videos": {
      "title": "math videos",
      "subtitle": "",
      "parent": "math",
      "active": true,
      "children": [],
      "layout": [
        {
          "id": "tile-65874ac0-2481-464b-87d8-b1df4baa54b7",
          "type": "video",
          "label": "video added",
          "image": "hello-song.jpg",
          "target": "https://www.youtube.com/watch?v=yIx1DplJMB4",
          "active": true
        }
      ]
    }
  }
};
