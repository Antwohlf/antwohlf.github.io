(() => {
  "use strict";

  const isEmbedded = new URLSearchParams(window.location.search).get("embed") === "1";
  document.documentElement.classList.toggle("is-embedded", isEmbedded);

  const WORLD_WIDTH = 960;
  const WORLD_HEIGHT = 640;
  const PLAYER_RADIUS = 12;
  const PLAYER_SPEED = 172;
  const NPC_FOOT_RADIUS = 8;
  const ACTOR_MINIMUM_DISTANCE = 30;
  const NPC_DEFAULT_SPEED = 42;
  const EDGE_WRAP_INSET = 2;
  const EDGE_WRAP_SEARCH_STEP = 4;
  const TIME_SEGMENTS = ["morning", "day", "evening", "night"];
  const TOWN_TIME_IMAGES = {
    morning: "../assets/world/project-town-morning-v2.png",
    day: "../assets/world/project-town-v8.png",
    evening: "../assets/world/project-town-evening-v2.png",
    night: "../assets/world/project-town-night-v2.png",
  };
  const LOCATION_TIME_ZONES = {
    detroit: "America/New_York",
    annarbor: "America/New_York",
    nyc: "America/New_York",
    sansebastian: "Europe/Madrid",
    tokyo: "Asia/Tokyo",
    losangeles: "America/Los_Angeles",
  };
  const TIME_THEME_COLORS = {
    morning: "#143447",
    day: "#081522",
    evening: "#241a20",
    night: "#040b18",
  };

  function getTownTimeZone() {
    try {
      const savedLocation = window.localStorage.getItem("bgLocation");
      return LOCATION_TIME_ZONES[savedLocation] ?? "America/New_York";
    } catch (error) {
      return "America/New_York";
    }
  }

  function getTownHour() {
    const hourPart = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: getTownTimeZone(),
    })
      .formatToParts(new Date())
      .find((part) => part.type === "hour");
    return Number(hourPart?.value ?? new Date().getHours());
  }

  function getTownTimeOfDay() {
    const override = new URLSearchParams(window.location.search).get("time");
    if (TIME_SEGMENTS.includes(override)) {
      return override;
    }

    const hour = getTownHour();
    if (hour >= 5 && hour < 11) {
      return "morning";
    }
    if (hour >= 11 && hour < 17) {
      return "day";
    }
    if (hour >= 17 && hour < 21) {
      return "evening";
    }
    return "night";
  }

  const sceneElement = document.querySelector("#scene");
  const townBuilthereForeground = document.querySelector(
    "#town-builthere-foreground",
  );
  const stage = document.querySelector("#game-stage");
  const playerElement = document.querySelector("#player");
  const hotspotsElement = document.querySelector("#hotspots");
  const npcsElement = document.querySelector("#npcs");
  const locationTitle = document.querySelector("#location-title");
  const promptElement = document.querySelector("#interaction-prompt");
  const promptText = document.querySelector("#interaction-text");
  const arrivalCard = document.querySelector("#arrival-card");
  const transitionElement = document.querySelector("#scene-transition");
  const projectDialog = document.querySelector("#project-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  const helpDialog = document.querySelector("#help-dialog");

  if (
    !sceneElement ||
    !townBuilthereForeground ||
    !stage ||
    !playerElement ||
    !hotspotsElement ||
    !npcsElement ||
    !locationTitle ||
    !promptElement ||
    !promptText ||
    !arrivalCard ||
    !transitionElement ||
    !projectDialog ||
    !dialogContent ||
    !helpDialog
  ) {
    return;
  }

  const initialTownTimeOfDay = getTownTimeOfDay();
  document.documentElement.dataset.timeOfDay = initialTownTimeOfDay;
  stage.dataset.timeOfDay = initialTownTimeOfDay;

  const scenes = {
    town: {
      title: "Project Town",
      image: TOWN_TIME_IMAGES[initialTownTimeOfDay],
      timeImages: TOWN_TIME_IMAGES,
      spawn: { x: 347, y: 618 },
      bounds: { left: 20, right: 940, top: 20, bottom: 640 },
      edgeWrap: { horizontal: true, top: true },
      collisions: [
        // Buildings.
        { x: 42, y: 18, width: 235, height: 192 },
        { x: 328, y: 18, width: 305, height: 198 },
        { x: 696, y: 18, width: 220, height: 194 },
        // The construction facade reaches the lower sign/door lintel. Its
        // matching foreground layer supplies correct top-down occlusion.
        { x: 60, y: 352, width: 245, height: 204 },
        { x: 384, y: 420, width: 190, height: 150 },
        { x: 384, y: 570, width: 62, height: 30 },
        { x: 514, y: 570, width: 60, height: 30 },
        { x: 678, y: 356, width: 200, height: 182 },

        // Upper gardens, hedges, planters, and benches.
        { x: 20, y: 205, width: 38, height: 94 },
        { x: 54, y: 194, width: 91, height: 71 },
        { x: 188, y: 194, width: 82, height: 71 },
        { x: 278, y: 56, width: 44, height: 230 },
        { x: 306, y: 207, width: 50, height: 40 },
        { x: 442, y: 207, width: 84, height: 42 },
        { x: 593, y: 207, width: 49, height: 40 },
        { x: 638, y: 55, width: 42, height: 231 },
        { x: 675, y: 194, width: 90, height: 71 },
        { x: 825, y: 194, width: 78, height: 71 },
        { x: 903, y: 205, width: 37, height: 94 },

        // Follow the fountain basin's full oval footprint. The old shallow,
        // low-set ellipse let the avatar's feet cross the north rim and made
        // the sprite appear to stand on the statue.
        { x: 480, y: 334, radiusX: 72, radiusY: 52 },
        { x1: 132, y1: 274, x2: 132, y2: 312, radius: 7 },
        { x1: 826, y1: 274, x2: 826, y2: 312, radius: 7 },
        { x1: 383, y1: 332, x2: 383, y2: 372, radius: 7 },
        { x1: 575, y1: 332, x2: 575, y2: 372, radius: 7 },
        { x1: 326, y1: 394, x2: 326, y2: 434, radius: 7 },
        { x1: 634, y1: 394, x2: 634, y2: 434, radius: 7 },
        { x1: 360, y1: 552, x2: 360, y2: 594, radius: 7 },
        { x1: 597, y1: 552, x2: 597, y2: 594, radius: 7 },

        // Lower gardens, signs, hedges, trees, and fences. Door paths remain open.
        { x: 20, y: 359, width: 40, height: 202 },
        { x: 44, y: 516, width: 120, height: 84 },
        { x: 216, y: 516, width: 105, height: 84 },
        // Preserve a full avatar-width lane beside the southwest lamp post.
        { x: 286, y: 360, width: 32, height: 240 },
        { x: 370, y: 467, width: 27, height: 133 },
        { x: 370, y: 550, width: 80, height: 50 },
        { x: 510, y: 550, width: 82, height: 50 },
        { x: 574, y: 467, width: 18, height: 133 },
        { x: 640, y: 365, width: 38, height: 235 },
        // Side Quests frontage: two tight garden boxes around the actual door.
        { x: 661, y: 520, width: 65, height: 80 },
        { x: 774, y: 520, width: 132, height: 80 },
        // Keep the east-west lane open to the right-edge wrap. The painted
        // garden begins below the path at y=359, not at the cobblestone seam.
        { x: 878, y: 359, width: 62, height: 202 },
      ],
      hotspots: [
        {
          id: "duo-door",
          x: 161,
          y: 218,
          range: 54,
          label: "Enter DuoCalculator",
          scene: "duo",
        },
        {
          id: "pizza-door",
          x: 397,
          y: 220,
          range: 50,
          label: "Enter through the pizza shop",
          scene: "pizza",
          destination: { x: 137, y: 585 },
        },
        {
          id: "taco-door",
          x: 560,
          y: 220,
          range: 50,
          label: "Enter through the taco shop",
          scene: "pizza",
          destination: { x: 813, y: 585 },
        },
        {
          id: "resume-door",
          x: 781,
          y: 218,
          range: 54,
          label: "Enter Resume Revamped",
          scene: "resume",
        },
        {
          id: "builthere-door",
          x: 190,
          y: 562,
          range: 54,
          label: "Enter BuiltHere.City",
          scene: "builthere",
        },
        {
          id: "homelab-door",
          x: 483,
          y: 610,
          range: 54,
          label: "Enter the Homelab",
          scene: "homelab",
        },
        {
          id: "side-quests-door",
          x: 750,
          y: 562,
          range: 54,
          label: "Enter Side Quests",
          scene: "travel",
        },
      ],
    },
    pizza: {
      title: "Michigan Food Lab · Pizza + Tacos",
      image: "../assets/world/michigan-restaurant-interior-v5.png",
      spawn: { x: 137, y: 585 },
      bounds: { left: 28, right: 932, top: 300, bottom: 610 },
      playerWallRadiusX: 48,
      collisions: [
        // The shared service counter is a continuous physical barrier.
        { x: 28, y: 238, width: 904, height: 84 },
        { x: 157, y: 358, width: 274, height: 58 },
        { x: 529, y: 358, width: 274, height: 58 },
        { x: 157, y: 464, width: 274, height: 58 },
        { x: 529, y: 464, width: 274, height: 58 },
      ],
      npcBounds: { left: 28, right: 932, top: 190, bottom: 232 },
      npcCollisions: [],
      npcs: [
        {
          id: "food-sauce-agent",
          label: "Sauce agent",
          signal: "#ff7a59",
          speed: 36,
          direction: "up",
          route: [
            {
              x: 230,
              y: 220,
              pause: 2600,
              task: "STIRRING SAUCE",
              action: "stir",
              direction: "up",
            },
            { x: 230, y: 204, pause: 450, task: "CHECKING HEAT" },
            { x: 205, y: 204, pause: 350, task: "FETCHING HERBS" },
            { x: 205, y: 220, pause: 650, task: "ADDING SEASONING" },
          ],
        },
        {
          id: "food-dough-agent",
          label: "Dough agent",
          signal: "#ffc83d",
          speed: 39,
          startDelay: 500,
          direction: "up",
          route: [
            {
              x: 340,
              y: 220,
              pause: 2700,
              task: "TOSSING DOUGH",
              action: "toss",
              direction: "up",
            },
            { x: 340, y: 204, pause: 400, task: "DUSTING FLOUR" },
            { x: 380, y: 204, pause: 350, task: "RESTING DOUGH" },
            { x: 380, y: 220, pause: 600, task: "SHAPING CRUST" },
          ],
        },
        {
          id: "food-onion-agent",
          label: "Onion prep agent",
          signal: "#63e6be",
          speed: 37,
          startDelay: 900,
          direction: "up",
          route: [
            {
              x: 500,
              y: 220,
              pause: 2500,
              task: "CUTTING ONIONS",
              action: "chop",
              direction: "up",
            },
            { x: 500, y: 204, pause: 400, task: "CLEARING BOARD" },
            { x: 540, y: 204, pause: 350, task: "FETCHING ONIONS" },
            { x: 540, y: 220, pause: 650, task: "SORTING ONIONS" },
          ],
        },
        {
          id: "food-trompo-agent",
          label: "Trompo agent",
          signal: "#50b7ff",
          speed: 38,
          startDelay: 1300,
          direction: "left",
          route: [
            {
              x: 675,
              y: 220,
              pause: 2800,
              task: "SHAVING THE TROMPO",
              action: "shave",
              direction: "left",
            },
            { x: 675, y: 204, pause: 400, task: "CHECKING ROTATION" },
            { x: 710, y: 204, pause: 350, task: "WARMING TORTILLAS" },
            { x: 710, y: 220, pause: 650, task: "PLATING TACOS" },
          ],
        },
      ],
      hotspots: [
        {
          id: "food-sauce",
          x: 230,
          y: 326,
          range: 74,
          label: "Watch the sauce station",
          dialog: "pizza-story",
        },
        {
          id: "food-dough",
          x: 340,
          y: 326,
          range: 74,
          label: "Watch the dough station",
          dialog: "pizza-pipeline",
        },
        {
          id: "food-onions",
          x: 500,
          y: 326,
          range: 74,
          label: "Watch the onion prep",
          dialog: "pizza-stack",
        },
        {
          id: "food-trompo",
          x: 675,
          y: 326,
          range: 74,
          label: "Watch the trompo station",
          dialog: "pizza-map",
        },
        {
          id: "pizza-exit",
          x: 137,
          y: 590,
          range: 46,
          label: "Exit through A Pizza Michigan",
          scene: "town",
          destination: { x: 397, y: 228 },
        },
        {
          id: "taco-exit",
          x: 813,
          y: 590,
          range: 46,
          label: "Exit through Taco 'Bout Michigan",
          scene: "town",
          destination: { x: 560, y: 228 },
        },
      ],
    },
    resume: {
      title: "Resume Revamped · Design Studio",
      image: "../assets/world/resume-interior-v5.png",
      spawn: { x: 480, y: 450 },
      bounds: { left: 20, right: 940, top: 115, bottom: 610 },
      playerWallRadiusX: 48,
      collisions: [
        // North wall displays and appropriately scaled workstations.
        { x: 10, y: 15, width: 205, height: 230 },
        { x: 205, y: 15, width: 530, height: 110 },
        { x: 370, y: 70, width: 225, height: 132 },
        { x: 735, y: 15, width: 215, height: 222 },

        // Compact drafting/export stations and the south entrance wall.
        { x: 124, y: 342, width: 158, height: 128 },
        { x: 694, y: 368, width: 154, height: 98 },
        { x: 320, y: 486, width: 312, height: 154 },
      ],
      npcs: [
        {
          id: "resume-layout-agent",
          label: "Layout agent",
          signal: "#ffca55",
          route: [
            { x: 330, y: 255, pause: 1800, task: "FORMATTING" },
            { x: 610, y: 255, pause: 2100, task: "RENDERING" },
            { x: 610, y: 325, pause: 1700, task: "CHECKING" },
            { x: 330, y: 325, pause: 1900, task: "LAYOUT" },
          ],
        },
        {
          id: "resume-review-agent",
          label: "Review agent",
          signal: "#6cc7ff",
          speed: 45,
          startDelay: 900,
          route: [
            { x: 380, y: 385, pause: 1800, task: "PARSING" },
            { x: 620, y: 385, pause: 2200, task: "REVIEWING" },
            { x: 620, y: 445, pause: 1700, task: "SCORING" },
            { x: 380, y: 445, pause: 1850, task: "SUGGESTING" },
          ],
        },
      ],
      hotspots: [
        {
          id: "resume-themes",
          x: 220,
          y: 270,
          range: 74,
          label: "Try the theme wall",
          dialog: "resume-themes",
        },
        {
          id: "resume-workstation",
          x: 480,
          y: 235,
          range: 78,
          label: "Open the live workstation",
          dialog: "resume-workstation",
        },
        {
          id: "resume-ai",
          x: 710,
          y: 265,
          range: 74,
          label: "Run an AI résumé scan",
          dialog: "resume-ai",
        },
        {
          id: "resume-drafting",
          x: 205,
          y: 492,
          range: 68,
          label: "Inspect the rendering plans",
          dialog: "resume-rendering",
        },
        {
          id: "resume-printer",
          x: 770,
          y: 490,
          range: 70,
          label: "Visit the export station",
          dialog: "resume-output",
        },
        {
          id: "resume-exit",
          x: 480,
          y: 490,
          range: 54,
          label: "Return to Project Town",
          scene: "town",
          destination: { x: 781, y: 228 },
        },
      ],
    },
    duo: {
      title: "DuoCalculator · Language Academy",
      image: "../assets/world/duocalculator-interior-v2.png",
      spawn: { x: 480, y: 500 },
      bounds: { left: 30, right: 930, top: 35, bottom: 610 },
      playerWallRadiusX: 48,
      collisions: [
        { x: 20, y: 20, width: 900, height: 235 },
        { x: 45, y: 345, width: 260, height: 220 },
        { x: 620, y: 310, width: 280, height: 240 },
        // Follow the bottom wall and the door surround's shallow inward step.
        // The player interacts from the room side instead of walking onto the door art.
        {
          points: [
            { x: 30, y: 538 },
            { x: 422, y: 538 },
            { x: 422, y: 520 },
            { x: 538, y: 520 },
            { x: 538, y: 538 },
            { x: 930, y: 538 },
            { x: 930, y: 610 },
            { x: 30, y: 610 },
          ],
        },
      ],
      npcs: [
        {
          id: "duo-course-sync-agent",
          label: "Duolingo course sync agent",
          signal: "#67d391",
          speed: 43,
          direction: "up",
          route: [
            {
              x: 770,
              y: 286,
              pause: 3200,
              task: "SCRAPING DUOLINGO COURSES",
              direction: "up",
            },
            {
              x: 600,
              y: 286,
              pause: 1100,
              task: "PARSING COURSE STRUCTURE",
              direction: "up",
            },
            {
              x: 580,
              y: 430,
              pause: 1500,
              task: "VALIDATING UNITS",
              direction: "right",
            },
            {
              x: 580,
              y: 510,
              pause: 3200,
              task: "UPDATING CALCULATOR",
              direction: "right",
            },
            {
              x: 580,
              y: 286,
              pause: 500,
              task: "QUEUEING REFRESH",
              direction: "up",
            },
          ],
        },
      ],
      hotspots: [
        {
          id: "duo-map",
          x: 480,
          y: 235,
          range: 76,
          label: "Explore the language map",
          dialog: "duo-overview",
        },
        {
          id: "duo-calculator",
          x: 780,
          y: 235,
          range: 76,
          label: "Open the course calculator",
          dialog: "duo-calculator",
        },
        {
          id: "duo-study",
          x: 185,
          y: 315,
          range: 72,
          label: "Inspect the course data",
          dialog: "duo-overview",
        },
        {
          id: "duo-path",
          x: 770,
          y: 315,
          range: 72,
          label: "Trace a learning path",
          dialog: "duo-calculator",
        },
        {
          id: "duo-exit",
          x: 480,
          y: 533,
          range: 50,
          label: "Return to Project Town",
          scene: "town",
          destination: { x: 161, y: 228 },
        },
      ],
    },
    builthere: {
      title: "BuiltHere.City · Planning Workshop",
      image: "../assets/world/builthere-interior-v2.png",
      spawn: { x: 480, y: 525 },
      bounds: { left: 30, right: 930, top: 35, bottom: 610 },
      collisions: [
        // Back wall and individually fitted north-wall workstations.
        { x: 30, y: 20, width: 900, height: 84 },
        { x: 28, y: 28, width: 80, height: 180 },
        { x: 110, y: 36, width: 200, height: 132 },
        { x: 307, y: 55, width: 56, height: 108 },
        { x: 378, y: 24, width: 196, height: 108 },
        { x: 596, y: 38, width: 316, height: 130 },
        { x: 206, y: 194, radiusX: 19, radiusY: 13 },
        { x: 70, y: 194, radiusX: 14, radiusY: 17 },
        { x: 891, y: 195, radiusX: 14, radiusY: 17 },

        // The city model has clipped corners rather than a rectangular halo.
        {
          points: [
            { x: 233, y: 224 },
            { x: 689, y: 224 },
            { x: 697, y: 232 },
            { x: 697, y: 460 },
            { x: 689, y: 468 },
            { x: 233, y: 468 },
            { x: 225, y: 460 },
            { x: 225, y: 224 },
          ],
        },

        // Side worktables use their actual footprints, including the cabinet
        // in the southwest corner that was previously missing entirely.
        {
          points: [
            { x: 30, y: 486 },
            { x: 102, y: 486 },
            { x: 108, y: 492 },
            { x: 108, y: 583 },
            { x: 99, y: 592 },
            { x: 30, y: 592 },
          ],
        },
        {
          points: [
            { x: 734, y: 402 },
            { x: 922, y: 402 },
            { x: 930, y: 410 },
            { x: 930, y: 571 },
            { x: 920, y: 581 },
            { x: 734, y: 581 },
          ],
        },

        // Compound south wall follows the raised doorway instead of blocking
        // the full lower floor with one oversized rectangle.
        { x: 30, y: 584, width: 312, height: 56 },
        {
          points: [
            { x: 342, y: 553 },
            { x: 410, y: 553 },
            { x: 410, y: 538 },
            { x: 550, y: 538 },
            { x: 550, y: 553 },
            { x: 620, y: 553 },
            { x: 620, y: 640 },
            { x: 342, y: 640 },
          ],
        },
        { x: 618, y: 584, width: 312, height: 56 },
      ],
      npcs: [
        {
          id: "built-mapping-agent",
          label: "Mapping agent",
          signal: "#5ab7ff",
          speed: 41,
          route: [
            { x: 190, y: 252, pause: 1900, task: "DRAFTING" },
            { x: 190, y: 520, pause: 1750, task: "SURVEYING" },
            { x: 470, y: 520, pause: 2200, task: "MAPPING" },
            { x: 190, y: 520, pause: 1800, task: "ZONING" },
          ],
        },
        {
          id: "built-simulation-agent",
          label: "Simulation agent",
          signal: "#f0a64a",
          speed: 44,
          startDelay: 800,
          route: [
            { x: 720, y: 260, pause: 1950, task: "SAMPLING" },
            { x: 880, y: 260, pause: 1800, task: "COMPARING" },
            { x: 880, y: 370, pause: 2200, task: "SIMULATING" },
            { x: 720, y: 370, pause: 1750, task: "CHECKING" },
          ],
        },
      ],
      hotspots: [
        {
          id: "buildhere-blueprint",
          x: 190,
          y: 225,
          range: 76,
          label: "Inspect the drafting table",
          dialog: "builthere-overview",
        },
        {
          id: "buildhere-map",
          x: 480,
          y: 190,
          range: 60,
          label: "Open the parcel map",
          dialog: "builthere-overview",
        },
        {
          id: "buildhere-materials",
          x: 780,
          y: 225,
          range: 76,
          label: "Browse the building kit",
          dialog: "builthere-overview",
        },
        {
          id: "buildhere-model",
          x: 480,
          y: 490,
          range: 32,
          label: "Explore the city model",
          dialog: "builthere-overview",
        },
        {
          id: "buildhere-exit",
          x: 480,
          y: 585,
          range: 60,
          label: "Return to Project Town",
          scene: "town",
          destination: { x: 190, y: 548 },
        },
      ],
    },
    homelab: {
      title: "Homelab · Operations Room",
      image: "../assets/world/homelab-interior-v3.png",
      spawn: { x: 480, y: 575 },
      bounds: { left: 30, right: 930, top: 35, bottom: 610 },
      playerWallRadiusX: 48,
      collisions: [
        // Equipment-sized boundaries preserve the newly opened aisles.
        { x: 50, y: 72, width: 205, height: 193 },
        { x: 322, y: 65, width: 305, height: 146 },
        { x: 668, y: 70, width: 250, height: 222 },
        { x: 76, y: 362, width: 130, height: 145 },
        { x: 726, y: 360, width: 138, height: 165 },
      ],
      npcs: [
        {
          id: "homelab-operations-agent",
          label: "Operations agent",
          signal: "#73e36f",
          speed: 46,
          route: [
            { x: 230, y: 322, pause: 1700, task: "QUEUING" },
            { x: 690, y: 322, pause: 2200, task: "MONITORING" },
            { x: 570, y: 382, pause: 1800, task: "RESTARTING" },
            { x: 310, y: 382, pause: 1900, task: "CHECKING" },
          ],
        },
        {
          id: "homelab-backup-agent",
          label: "Backup agent",
          signal: "#ff9f43",
          speed: 38,
          startDelay: 950,
          route: [
            { x: 310, y: 472, pause: 2300, task: "BACKING UP" },
            { x: 625, y: 472, pause: 1850, task: "VERIFYING" },
            { x: 625, y: 535, pause: 2100, task: "ARCHIVING" },
            { x: 310, y: 535, pause: 1750, task: "SYNCING" },
          ],
        },
      ],
      hotspots: [
        {
          id: "homelab-rack",
          x: 480,
          y: 230,
          range: 112,
          label: "Check the service rack",
          dialog: "homelab-overview",
        },
        {
          id: "homelab-network",
          x: 770,
          y: 230,
          range: 112,
          label: "Inspect the private network",
          dialog: "homelab-overview",
        },
        {
          id: "homelab-storage",
          x: 145,
          y: 342,
          range: 72,
          label: "Open the storage pool",
          dialog: "homelab-storage",
        },
        {
          id: "homelab-services",
          x: 800,
          y: 338,
          range: 92,
          label: "View running services",
          dialog: "homelab-overview",
        },
        {
          id: "homelab-exit",
          x: 480,
          y: 585,
          range: 50,
          label: "Return to Project Town",
          scene: "town",
          destination: { x: 483, y: 603 },
        },
      ],
    },
    travel: {
      title: "Side Quests · Adventure Guild",
      image: "../assets/world/travel-interior-v2.png",
      spawn: { x: 480, y: 575 },
      bounds: { left: 30, right: 930, top: 35, bottom: 610 },
      playerWallRadiusX: 48,
      collisions: [
        { x: 15, y: 20, width: 290, height: 240 },
        { x: 330, y: 30, width: 320, height: 205 },
        { x: 685, y: 40, width: 240, height: 210 },
        { x: 40, y: 288, width: 260, height: 238 },
        { x: 665, y: 278, width: 265, height: 242 },
      ],
      npcs: [
        {
          id: "travel-route-agent",
          label: "Route agent",
          signal: "#59c7ff",
          speed: 43,
          route: [
            { x: 320, y: 280, pause: 1850, task: "SEARCHING" },
            { x: 650, y: 280, pause: 2200, task: "ROUTING" },
            { x: 620, y: 340, pause: 1750, task: "PRICING" },
            { x: 350, y: 340, pause: 1900, task: "PLANNING" },
          ],
        },
        {
          id: "travel-archive-agent",
          label: "Archive agent",
          signal: "#f5b95b",
          speed: 39,
          startDelay: 900,
          route: [
            { x: 350, y: 500, pause: 2100, task: "ARCHIVING" },
            { x: 620, y: 500, pause: 1900, task: "TAGGING" },
            { x: 620, y: 420, pause: 2200, task: "CURATING" },
            { x: 350, y: 420, pause: 1800, task: "JOURNALING" },
          ],
        },
      ],
      hotspots: [
        {
          id: "travel-checkin",
          x: 190,
          y: 275,
          range: 76,
          label: "Check in for the journey",
          dialog: "travel-overview",
        },
        {
          id: "travel-routes",
          x: 480,
          y: 235,
          range: 82,
          label: "Explore the route map",
          dialog: "travel-overview",
        },
        {
          id: "travel-board",
          x: 760,
          y: 265,
          range: 76,
          label: "Read the departure board",
          dialog: "travel-overview",
        },
        {
          id: "travel-journal",
          x: 780,
          y: 285,
          range: 72,
          label: "Browse the travel journal",
          dialog: "travel-overview",
        },
        {
          id: "travel-exit",
          x: 480,
          y: 585,
          range: 50,
          label: "Return to Project Town",
          scene: "town",
          destination: { x: 750, y: 550 },
        },
      ],
    },
  };

  const player = {
    x: scenes.town.spawn.x,
    y: scenes.town.spawn.y,
    direction: "down",
  };

  const movement = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  const keyDirections = {
    arrowup: "up",
    w: "up",
    arrowdown: "down",
    s: "down",
    arrowleft: "left",
    a: "left",
    arrowright: "right",
    d: "right",
  };

  let currentSceneId = "town";
  let currentTownTimeOfDay = initialTownTimeOfDay;
  let npcStates = [];
  let nearestHotspot = null;
  let previousFrameTime = performance.now();
  let transitioning = false;
  let dialogReturnFocus = null;
  let pipelineTimer = null;
  let arrivalTimer = null;

  function applyTownTimeOfDay({ updateSceneImage = false } = {}) {
    const nextTimeOfDay = getTownTimeOfDay();
    const changed = nextTimeOfDay !== currentTownTimeOfDay;

    currentTownTimeOfDay = nextTimeOfDay;
    scenes.town.image = TOWN_TIME_IMAGES[nextTimeOfDay];
    document.documentElement.dataset.timeOfDay = nextTimeOfDay;
    stage.dataset.timeOfDay = nextTimeOfDay;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", TIME_THEME_COLORS[nextTimeOfDay]);

    if (!updateSceneImage || !changed || currentSceneId !== "town") {
      return;
    }

    const nextImage = scenes.town.image;
    preloadImage(nextImage)
      .then(() => {
        if (
          currentSceneId === "town" &&
          scenes.town.image === nextImage &&
          getTownTimeOfDay() === nextTimeOfDay
        ) {
          sceneElement.style.backgroundImage = `url("${nextImage}")`;
          townBuilthereForeground.style.backgroundImage = `url("${nextImage}")`;
        }
      })
      .catch((error) =>
        console.error(`Unable to preload ${nextImage}`, error),
      );
  }

  const dialogViews = {
    "pizza-story": () => `
      <span class="project-kicker">Michigan Food Lab · Intake</span>
      <h2 id="dialog-title">One data system, two storefronts</h2>
      <p class="dialog-lede">A personal pizza spreadsheet grew into A Pizza Michigan, then widened into a shared place-data system for pizza and tacos across Michigan and beyond.</p>
      <div class="story-path" aria-label="Project evolution">
        <div class="story-step"><span>01 · TRACK</span><strong>A personal pizza spreadsheet</strong></div>
        <div class="story-step"><span>02 · EXPAND</span><strong>Pizza and taco discovery</strong></div>
        <div class="story-step"><span>03 · OPERATE</span><strong>200,000+ enriched place records</strong></div>
      </div>
      <p>The two counters share the same underlying collection, enrichment, validation, and publishing machinery—just like the two halves of this room.</p>
      <div class="dialog-actions">
        <a class="pixel-button" href="https://www.apizzamichigan.com" target="_blank" rel="noopener">Visit the live food map ↗</a>
      </div>
    `,
    "pizza-map": () => `
      <span class="project-kicker">Michigan Food Lab · Publish</span>
      <h2 id="dialog-title">Two cravings, one map system</h2>
      <p class="dialog-lede">The published experience turns a large place dataset into something personal: search nearby, switch between pizza and tacos, and keep track of places worth returning to.</p>
      <img class="project-preview" src="../assets/images/apizzamichigan.jpg" alt="A Pizza Michigan map interface showing pizza places around Michigan" />
      <div class="demo-panel" data-pizza-demo>
        <div class="demo-panel__header">
          <strong>Sample map filter</strong>
          <span class="demo-panel__count" data-pizza-count>200,000+ entries</span>
        </div>
        <div class="filter-row" aria-label="Try a sample map filter">
          <button class="demo-chip is-active" type="button" data-pizza-filter="all">All places</button>
          <button class="demo-chip" type="button" data-pizza-filter="pizza">Pizza</button>
          <button class="demo-chip" type="button" data-pizza-filter="taco">Tacos</button>
          <button class="demo-chip" type="button" data-pizza-filter="tried">Tried</button>
        </div>
      </div>
      <div class="dialog-actions">
        <a class="pixel-button" href="https://www.apizzamichigan.com" target="_blank" rel="noopener">Explore the real map ↗</a>
      </div>
    `,
    "pizza-pipeline": () => `
      <span class="project-kicker">Michigan Food Lab · Enrichment</span>
      <h2 id="dialog-title">The crew behind the counter</h2>
      <p class="dialog-lede">A multi-agent LLM pipeline handles the work behind the map: collecting place data, enriching it, checking the results, and publishing only validated records.</p>
      <div class="demo-panel">
        <div class="demo-panel__header">
          <strong>Pipeline simulator</strong>
          <span class="demo-panel__count" id="pipeline-status">Ready</span>
        </div>
        <div class="pipeline" aria-label="Data pipeline steps">
          <div class="pipeline__node" data-pipeline-node>01<br />Scrape</div>
          <div class="pipeline__node" data-pipeline-node>02<br />Enrich</div>
          <div class="pipeline__node" data-pipeline-node>03<br />Validate</div>
          <div class="pipeline__node" data-pipeline-node>04<br />Publish</div>
        </div>
        <button class="pixel-button" id="run-pipeline" type="button">Run a sample batch</button>
      </div>
      <p>The kitchen choreography makes the invisible software work tangible: four independently bounded workers prepare one shared service, just as the live agents move each record from intake through enrichment, validation, and publishing.</p>
    `,
    "pizza-stack": () => `
      <span class="project-kicker">Michigan Food Lab · Validation</span>
      <h2 id="dialog-title">Nothing leaves unchecked</h2>
      <p class="dialog-lede">The public experience stays fast and approachable while the heavier collection, enrichment, and validation work happens behind the counter.</p>
      <div class="stat-grid">
        <div class="stat-card"><strong>Scrape</strong><span>Collect candidate places and source details</span></div>
        <div class="stat-card"><strong>Enrich</strong><span>Research categories, attributes, and context</span></div>
        <div class="stat-card"><strong>Validate</strong><span>Catch uncertainty before records are published</span></div>
      </div>
      <div class="dialog-actions">
        <a class="pixel-button" href="https://www.apizzamichigan.com" target="_blank" rel="noopener">Visit A Pizza Michigan ↗</a>
      </div>
    `,
    "resume-workstation": () => `
      <span class="project-kicker">Resume Revamped · Main workstation</span>
      <h2 id="dialog-title">Edit live. Export precisely.</h2>
      <p class="dialog-lede">Resume Revamped is a live résumé platform with company-inspired themes, structured editing, AI-assisted tailoring, and a shared preview-to-PDF rendering system.</p>
      <img class="project-preview" src="../assets/images/resume_builder.jpg" alt="Resume Revamped editor with a live résumé preview" />
      <div class="stat-grid">
        <div class="stat-card"><strong>8</strong><span>Distinct résumé themes</span></div>
        <div class="stat-card"><strong>≈1:1</strong><span>Browser-to-PDF rendering</span></div>
        <div class="stat-card"><strong>1.8k</strong><span>Unique visitors each month</span></div>
      </div>
      <div class="dialog-actions">
        <a class="pixel-button" href="https://resumerevamped.com" target="_blank" rel="noopener">Open Resume Revamped ↗</a>
      </div>
    `,
    "resume-themes": () => `
      <span class="project-kicker">Resume Revamped · Theme wall</span>
      <h2 id="dialog-title">One résumé, eight points of view</h2>
      <p class="dialog-lede">Themes change more than color. Each one has its own typography, spacing, hierarchy, and visual logic while preserving the same underlying résumé data.</p>
      <div class="theme-workbench">
        <div class="theme-row" aria-label="Choose a sample résumé theme">
          <button class="theme-chip is-active" type="button" data-theme="Default" data-color="#235c91" data-paper="#f8f5ed" style="--swatch:#235c91">Default</button>
          <button class="theme-chip" type="button" data-theme="Google" data-color="#4285f4" data-paper="#ffffff" style="--swatch:#4285f4">Google</button>
          <button class="theme-chip" type="button" data-theme="Amazon" data-color="#ff9900" data-paper="#ffffff" style="--swatch:#ff9900">Amazon</button>
          <button class="theme-chip" type="button" data-theme="Airbnb" data-color="#ff5a5f" data-paper="#fffafa" style="--swatch:#ff5a5f">Airbnb</button>
          <button class="theme-chip" type="button" data-theme="Facebook" data-color="#1877f2" data-paper="#f7f9fc" style="--swatch:#1877f2">Facebook</button>
          <button class="theme-chip" type="button" data-theme="Netflix" data-color="#b20710" data-paper="#fbfbfb" style="--swatch:#b20710">Netflix</button>
          <button class="theme-chip" type="button" data-theme="Duolingo" data-color="#58a700" data-paper="#fbfff5" style="--swatch:#58a700">Duolingo</button>
          <button class="theme-chip" type="button" data-theme="Spotify" data-color="#16883e" data-paper="#f7fff9" style="--swatch:#1db954">Spotify</button>
        </div>
        <div class="mini-resume" id="mini-resume" aria-live="polite">
          <div class="mini-resume__top">
            <span class="mini-resume__name">Anthony Wohlfeil</span>
            <span class="mini-resume__role"><span id="theme-name">Default</span> theme · Software Engineer</span>
          </div>
          <div class="mini-resume__body">
            <div class="mini-resume__section"><div class="mini-resume__heading">Experience</div><div class="mini-resume__line"></div><div class="mini-resume__line"></div></div>
            <div class="mini-resume__section"><div class="mini-resume__heading">Projects</div><div class="mini-resume__line"></div><div class="mini-resume__line"></div></div>
            <div class="mini-resume__section"><div class="mini-resume__heading">Education</div><div class="mini-resume__line"></div><div class="mini-resume__line"></div></div>
          </div>
        </div>
      </div>
      <div class="dialog-actions">
        <a class="pixel-button" href="https://resumerevamped.com" target="_blank" rel="noopener">Design your résumé ↗</a>
      </div>
    `,
    "resume-ai": () => `
      <span class="project-kicker">Resume Revamped · AI analysis console</span>
      <h2 id="dialog-title">Tailoring with evidence</h2>
      <p class="dialog-lede">The AI tools compare a résumé with a target role, surface gaps, and help strengthen the writing without replacing the experience behind it.</p>
      <div class="demo-panel">
        <div class="demo-panel__header">
          <strong>Sample role alignment</strong>
          <span class="demo-panel__count" id="scan-score">28% scanned</span>
        </div>
        <div class="scan-meter" aria-hidden="true"><div class="scan-meter__fill" id="scan-fill"></div></div>
        <div class="scan-tags" aria-label="Signals to find">
          <span data-scan-tag>Quantified impact</span>
          <span data-scan-tag>Role vocabulary</span>
          <span data-scan-tag>Evidence-backed skills</span>
        </div>
        <div class="dialog-actions">
          <button class="pixel-button" id="run-scan" type="button">Run sample scan</button>
        </div>
      </div>
      <p>Feedback remains tied to the résumé and job description, so suggestions stay grounded in the candidate's actual background.</p>
    `,
    "resume-rendering": () => `
      <span class="project-kicker">Resume Revamped · Drafting table</span>
      <h2 id="dialog-title">One rendering system, two outputs</h2>
      <p class="dialog-lede">The live preview and exported PDF share the same semantic document and pagination logic. That keeps the document you edit close to the document employers receive.</p>
      <div class="story-path">
        <div class="story-step"><span>01 · STRUCTURE</span><strong>Typed résumé data</strong></div>
        <div class="story-step"><span>02 · RENDER</span><strong>Shared layout engine</strong></div>
        <div class="story-step"><span>03 · VERIFY</span><strong>Visual parity tests</strong></div>
      </div>
      <p>Playwright, PDF extraction, and visual regression checks guard page count, content, and pixel-level layout before changes ship.</p>
    `,
    "resume-output": () => `
      <span class="project-kicker">Resume Revamped · Export station</span>
      <h2 id="dialog-title">Ready for the real application</h2>
      <p class="dialog-lede">The finished document can leave the studio in the format the application needs, without sacrificing the live editing experience.</p>
      <div class="output-list">
        <div><strong>Pixel-parity PDF</strong><span>The primary visual export, rendered in a real browser.</span></div>
        <div><strong>Editable Word</strong><span>A practical editable option for the default theme.</span></div>
        <div><strong>Saved versions</strong><span>Keep tailored variants organized for different roles.</span></div>
      </div>
      <div class="dialog-actions">
        <a class="pixel-button" href="https://resumerevamped.com" target="_blank" rel="noopener">Try Resume Revamped ↗</a>
      </div>
    `,
    "duo-overview": () => `
      <span class="project-kicker">DuoCalculator · Course data</span>
      <h2 id="dialog-title">Plan the whole learning journey</h2>
      <p class="dialog-lede">DuoCalculator turns course structure and current progress into a practical answer: how long will this language take, and how much should I do each day?</p>
      <div class="stat-grid">
        <div class="stat-card"><strong>≈300</strong><span>Language courses covered by the data pipeline</span></div>
        <div class="stat-card"><strong>Weekly</strong><span>Automated scraping and validation refresh</span></div>
        <div class="stat-card"><strong>2 ways</strong><span>Finish-date or daily-pace planning</span></div>
      </div>
      <div class="dialog-actions">
        <a class="pixel-button" href="https://www.duocalculator.com" target="_blank" rel="noopener">Open DuoCalculator ↗</a>
      </div>
    `,
    "duo-calculator": () => `
      <span class="project-kicker">DuoCalculator · Planning console</span>
      <h2 id="dialog-title">Course progress becomes a schedule</h2>
      <p class="dialog-lede">Pick a course, section, unit, lesson pace, and daily goal. The calculator translates the remaining path into a finish date—or works backward from a target date.</p>
      <div class="story-path">
        <div class="story-step"><span>01 · SELECT</span><strong>Language and current unit</strong></div>
        <div class="story-step"><span>02 · PACE</span><strong>Minutes or target completion</strong></div>
        <div class="story-step"><span>03 · PLAN</span><strong>A realistic daily route</strong></div>
      </div>
      <div class="dialog-actions">
        <a class="pixel-button" href="https://www.duocalculator.com" target="_blank" rel="noopener">Try the real calculator ↗</a>
      </div>
    `,
    "builthere-overview": () => `
      <span class="project-kicker">BuiltHere.City · Planning desk</span>
      <h2 id="dialog-title">A city is a system of choices</h2>
      <p class="dialog-lede">This workshop represents BuiltHere.City as a living planning table: parcels, streets, buildings, and shared spaces are components that can be rearranged and understood together.</p>
      <div class="story-path">
        <div class="story-step"><span>01 · PLACE</span><strong>Choose a parcel</strong></div>
        <div class="story-step"><span>02 · BUILD</span><strong>Compose the neighborhood</strong></div>
        <div class="story-step"><span>03 · CONNECT</span><strong>See how the pieces interact</strong></div>
      </div>
      <div class="dialog-actions">
        <a class="pixel-button" href="https://builthere.city" target="_blank" rel="noopener">Visit BuiltHere.City ↗</a>
      </div>
    `,
    "homelab-overview": () => `
      <span class="project-kicker">Homelab · Operations</span>
      <h2 id="dialog-title">The infrastructure under the projects</h2>
      <p class="dialog-lede">A Linux home server runs isolated services on a shared Docker network, routes selected traffic through a VPN, and exposes approved apps through a secure reverse proxy.</p>
      <img class="project-preview" src="../assets/images/home-lab-architecture.png" alt="Architecture diagram of Anthony's self-hosted Linux home lab" />
      <div class="stat-grid">
        <div class="stat-card"><strong>Docker</strong><span>Isolated services on a shared network</span></div>
        <div class="stat-card"><strong>Proxy</strong><span>Controlled secure remote access</span></div>
        <div class="stat-card"><strong>Jobs</strong><span>Automated processing and research workflows</span></div>
      </div>
    `,
    "homelab-storage": () => `
      <span class="project-kicker">Homelab · Storage pool</span>
      <h2 id="dialog-title">Storage and services scale separately</h2>
      <p class="dialog-lede">Multiple physical disks are pooled behind stable service paths, so capacity can grow without rebuilding every container around new hardware.</p>
      <div class="story-path">
        <div class="story-step"><span>01 · DISKS</span><strong>Independent physical storage</strong></div>
        <div class="story-step"><span>02 · POOL</span><strong>One durable logical layer</strong></div>
        <div class="story-step"><span>03 · SERVE</span><strong>Persistent container volumes</strong></div>
      </div>
    `,
    "travel-overview": () => `
      <span class="project-kicker">Side Quests · Travel journal</span>
      <h2 id="dialog-title">The map behind the memories</h2>
      <p class="dialog-lede">Travel has shaped how Anthony thinks about language, culture, cities, and the kinds of tools worth building. The main site turns those journeys into an interactive map and year-by-year journal.</p>
      <div class="stat-grid">
        <div class="stat-card"><strong>79</strong><span>Destinations on the interactive map</span></div>
        <div class="stat-card"><strong>43</strong><span>Flight markers connecting the routes</span></div>
        <div class="stat-card"><strong>2018–26</strong><span>Stories organized by travel year</span></div>
      </div>
      <div class="dialog-actions">
        <a class="pixel-button" href="../#travel">Open the travel journal ↗</a>
      </div>
    `,
    directory: () => `
      <span class="project-kicker">Project Town · Directory</span>
      <h2 id="dialog-title">Choose a building</h2>
      <p class="dialog-lede">Jump into an exhibit now, or close this panel and walk there yourself.</p>
      <div class="directory-grid">
        <article class="directory-card directory-card--pizza">
          <div class="directory-card__number">01</div>
          <div><span class="directory-card__type">Food + location platform</span><h3>Pizza + Taco 'Bout Michigan</h3><p>Two discovery experiences sharing one multi-agent data pipeline.</p></div>
          <button class="pixel-button" type="button" data-dialog-enter="pizza">Enter exhibit</button>
        </article>
        <article class="directory-card directory-card--resume">
          <div class="directory-card__number">02</div>
          <div><span class="directory-card__type">Design + career platform</span><h3>Resume Revamped</h3><p>Eight themes, AI assistance, and precise browser-to-PDF rendering.</p></div>
          <button class="pixel-button" type="button" data-dialog-enter="resume">Enter exhibit</button>
        </article>
        <article class="directory-card directory-card--duo">
          <div class="directory-card__number">03</div>
          <div><span class="directory-card__type">Language planning</span><h3>DuoCalculator</h3><p>Course data becomes a finish date and practical daily pace.</p></div>
          <button class="pixel-button" type="button" data-dialog-enter="duo">Enter exhibit</button>
        </article>
        <article class="directory-card directory-card--buildhere">
          <div class="directory-card__number">04</div>
          <div><span class="directory-card__type">City building</span><h3>BuiltHere.City</h3><p>A living workshop for parcels, neighborhoods, and connected choices.</p></div>
          <button class="pixel-button" type="button" data-dialog-enter="builthere">Enter exhibit</button>
        </article>
        <article class="directory-card directory-card--homelab">
          <div class="directory-card__number">05</div>
          <div><span class="directory-card__type">Self-hosted infrastructure</span><h3>Homelab</h3><p>The storage, services, networking, and workflows beneath the projects.</p></div>
          <button class="pixel-button" type="button" data-dialog-enter="homelab">Enter exhibit</button>
        </article>
        <article class="directory-card directory-card--travel">
          <div class="directory-card__number">06</div>
          <div><span class="directory-card__type">Experiments + adventures</span><h3>Side Quests</h3><p>Travel stories and smaller explorations that live beyond the main project path.</p></div>
          <button class="pixel-button" type="button" data-dialog-enter="travel">Enter exhibit</button>
        </article>
      </div>
    `,
  };

  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function isDialogOpen() {
    return projectDialog.open || helpDialog.open;
  }

  function renderPlayer() {
    playerElement.style.left = `${(player.x / WORLD_WIDTH) * 100}%`;
    playerElement.style.top = `${(player.y / WORLD_HEIGHT) * 100}%`;
    playerElement.style.zIndex = String(30 + Math.floor(player.y / 18));
    playerElement.dataset.direction = player.direction;
  }

  function renderNpcState(state) {
    state.element.style.left = `${(state.x / WORLD_WIDTH) * 100}%`;
    state.element.style.top = `${(state.y / WORLD_HEIGHT) * 100}%`;
    state.element.style.zIndex = String(28 + Math.floor(state.y / 18));
    state.element.dataset.direction = state.direction;
    state.element.dataset.activity = state.isWorking
      ? state.currentTask
      : "WALKING";
    state.element.dataset.action = state.isWorking
      ? state.currentAction
      : "none";
    state.element.classList.toggle("is-walking", state.isWalking);
    state.element.classList.toggle("is-working", state.isWorking);
    state.taskElement.textContent = state.currentTask;
  }

  function renderNpcs(scene) {
    const now = performance.now();
    npcsElement.replaceChildren();
    npcStates = (scene.npcs ?? []).map((config, index) => {
      const route = config.route ?? [];
      const start = route[0] ?? { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 };
      const element = document.createElement("div");
      const sprite = document.createElement("div");
      const action = document.createElement("span");
      const tool = document.createElement("span");
      const ingredient = document.createElement("span");
      const signal = document.createElement("span");
      const task = document.createElement("span");

      element.className = "npc";
      element.dataset.npcId = config.id;
      element.dataset.direction = config.direction ?? "down";
      element.title = config.label;
      element.style.setProperty("--npc-signal", config.signal ?? "#5ee7f2");
      sprite.className = "npc__sprite";
      action.className = "npc__action";
      tool.className = "npc__tool";
      ingredient.className = "npc__ingredient";
      signal.className = "npc__signal";
      task.className = "npc__task";
      action.append(tool, ingredient);
      element.append(sprite, action, signal, task);
      npcsElement.appendChild(element);

      const state = {
        blocked: false,
        config,
        currentAction: start.action ?? "idle",
        currentTask: start.task ?? "PROCESSING",
        direction: config.direction ?? "down",
        element,
        isWorking: true,
        isWalking: false,
        pauseUntil:
          now + (config.startDelay ?? index * 300) + (start.pause ?? 1400),
        route,
        scene,
        targetIndex: route.length > 1 ? 1 : 0,
        taskElement: task,
        x: start.x,
        y: start.y,
      };
      route.forEach((point, routeIndex) => {
        if (!isNpcPositionWalkable(state, point.x, point.y, true)) {
          console.error(
            `NPC route point outside walkable space: ${config.id}[${routeIndex}]`,
          );
        }
      });
      renderNpcState(state);
      return state;
    });
  }

  function maintainsActorSeparation(
    currentX,
    currentY,
    nextX,
    nextY,
    otherX,
    otherY,
  ) {
    const nextDistance = Math.hypot(nextX - otherX, nextY - otherY);
    if (nextDistance >= ACTOR_MINIMUM_DISTANCE) {
      return true;
    }

    // Let an actor escape a pre-existing overlap, but never move sideways
    // inside it or push more deeply into the other actor.
    const currentDistance = Math.hypot(currentX - otherX, currentY - otherY);
    return (
      currentDistance < ACTOR_MINIMUM_DISTANCE &&
      nextDistance > currentDistance + 0.01
    );
  }

  function isNpcPositionWalkable(state, x, y, ignoreActors = false) {
    const bounds = state.scene.npcBounds ?? state.scene.bounds;
    const collisions = state.scene.npcCollisions ?? state.scene.collisions;
    if (
      x - NPC_FOOT_RADIUS < bounds.left ||
      x + NPC_FOOT_RADIUS > bounds.right ||
      y - NPC_FOOT_RADIUS < bounds.top ||
      y + NPC_FOOT_RADIUS > bounds.bottom
    ) {
      return false;
    }

    const intersectsScenery = collisions.some((obstacle) =>
      intersectsCollisionShape(x, y, NPC_FOOT_RADIUS, obstacle),
    );
    if (intersectsScenery) {
      return false;
    }

    if (ignoreActors) {
      return true;
    }

    if (
      !maintainsActorSeparation(
        state.x,
        state.y,
        x,
        y,
        player.x,
        player.y,
      )
    ) {
      return false;
    }

    return npcStates.every(
      (otherState) =>
        otherState === state ||
        maintainsActorSeparation(
          state.x,
          state.y,
          x,
          y,
          otherState.x,
          otherState.y,
        ),
    );
  }

  function updateNpcs(deltaSeconds, frameTime) {
    npcStates.forEach((state) => {
      if (state.route.length < 2) {
        state.isWalking = false;
        state.isWorking = true;
        renderNpcState(state);
        return;
      }

      if (frameTime < state.pauseUntil) {
        state.isWalking = false;
        state.isWorking = true;
        renderNpcState(state);
        return;
      }

      const target = state.route[state.targetIndex];
      const deltaX = target.x - state.x;
      const deltaY = target.y - state.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance <= 1.5) {
        state.x = target.x;
        state.y = target.y;
        state.targetIndex = (state.targetIndex + 1) % state.route.length;
        state.pauseUntil = frameTime + (target.pause ?? 800);
        state.currentAction = target.action ?? "idle";
        state.currentTask = target.task ?? "PROCESSING";
        state.direction = target.direction ?? state.direction;
        state.isWalking = false;
        state.isWorking = true;
        state.blocked = false;
        renderNpcState(state);
        return;
      }

      const step = Math.min(
        distance,
        (state.config.speed ?? NPC_DEFAULT_SPEED) * deltaSeconds,
      );
      const stepX = (deltaX / distance) * step;
      const stepY = (deltaY / distance) * step;
      const nextX = state.x + stepX;
      const nextY = state.y + stepY;

      if (isNpcPositionWalkable(state, nextX, nextY)) {
        state.x = nextX;
        state.y = nextY;
        state.blocked = false;
      } else if (isNpcPositionWalkable(state, nextX, state.y)) {
        state.x = nextX;
        state.blocked = false;
      } else if (isNpcPositionWalkable(state, state.x, nextY)) {
        state.y = nextY;
        state.blocked = false;
      } else {
        if (!state.blocked) {
          console.warn(`NPC route blocked: ${state.config.id}`);
        }
        state.blocked = true;
        state.currentAction = "idle";
        state.currentTask = "WAITING";
        state.pauseUntil = frameTime + 1200;
        state.isWalking = false;
        state.isWorking = true;
        renderNpcState(state);
        return;
      }

      state.isWalking = true;
      state.isWorking = false;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        state.direction = deltaX < 0 ? "left" : "right";
      } else {
        state.direction = deltaY < 0 ? "up" : "down";
      }
      renderNpcState(state);
    });
  }

  function renderHotspots(scene) {
    hotspotsElement.replaceChildren();
    scene.hotspots.forEach((hotspot) => {
      const button = document.createElement("button");
      const label = document.createElement("span");
      button.className = "hotspot";
      button.type = "button";
      button.dataset.hotspotId = hotspot.id;
      button.setAttribute("aria-label", hotspot.label);
      button.style.left = `${(hotspot.x / WORLD_WIDTH) * 100}%`;
      button.style.top = `${(hotspot.y / WORLD_HEIGHT) * 100}%`;
      label.className = "hotspot__label";
      label.textContent = hotspot.label;
      button.appendChild(label);
      button.addEventListener("click", () => activateHotspot(hotspot));
      hotspotsElement.appendChild(button);
    });
  }

  function getScene() {
    return scenes[currentSceneId];
  }

  function intersectsCollisionShape(x, y, radius, obstacle) {
    if (
      Number.isFinite(obstacle.x1) &&
      Number.isFinite(obstacle.y1) &&
      Number.isFinite(obstacle.x2) &&
      Number.isFinite(obstacle.y2)
    ) {
      const segmentX = obstacle.x2 - obstacle.x1;
      const segmentY = obstacle.y2 - obstacle.y1;
      const segmentLengthSquared =
        segmentX * segmentX + segmentY * segmentY;
      const projection = segmentLengthSquared
        ? Math.max(
            0,
            Math.min(
              1,
              ((x - obstacle.x1) * segmentX +
                (y - obstacle.y1) * segmentY) /
                segmentLengthSquared,
            ),
          )
        : 0;
      const nearestX = obstacle.x1 + projection * segmentX;
      const nearestY = obstacle.y1 + projection * segmentY;
      const distanceX = x - nearestX;
      const distanceY = y - nearestY;
      const combinedRadius = radius + (obstacle.radius ?? 0);
      return (
        distanceX * distanceX + distanceY * distanceY <
        combinedRadius * combinedRadius
      );
    }

    if (obstacle.points?.length >= 3) {
      let inside = false;
      for (
        let pointIndex = 0, previousIndex = obstacle.points.length - 1;
        pointIndex < obstacle.points.length;
        previousIndex = pointIndex++
      ) {
        const point = obstacle.points[pointIndex];
        const previous = obstacle.points[previousIndex];
        const crossesRay =
          point.y > y !== previous.y > y &&
          x <
            ((previous.x - point.x) * (y - point.y)) /
              (previous.y - point.y) +
              point.x;
        if (crossesRay) {
          inside = !inside;
        }
      }
      if (inside) {
        return true;
      }

      const radiusSquared = radius * radius;
      return obstacle.points.some((point, pointIndex) => {
        const nextPoint =
          obstacle.points[(pointIndex + 1) % obstacle.points.length];
        const edgeX = nextPoint.x - point.x;
        const edgeY = nextPoint.y - point.y;
        const edgeLengthSquared = edgeX * edgeX + edgeY * edgeY;
        const projection = edgeLengthSquared
          ? Math.max(
              0,
              Math.min(
                1,
                ((x - point.x) * edgeX + (y - point.y) * edgeY) /
                  edgeLengthSquared,
              ),
            )
          : 0;
        const nearestX = point.x + projection * edgeX;
        const nearestY = point.y + projection * edgeY;
        const distanceX = x - nearestX;
        const distanceY = y - nearestY;
        return distanceX * distanceX + distanceY * distanceY < radiusSquared;
      });
    }

    if (obstacle.radiusX && obstacle.radiusY) {
      const expandedRadiusX = obstacle.radiusX + radius;
      const expandedRadiusY = obstacle.radiusY + radius;
      const normalizedX = (x - obstacle.x) / expandedRadiusX;
      const normalizedY = (y - obstacle.y) / expandedRadiusY;
      return normalizedX * normalizedX + normalizedY * normalizedY < 1;
    }

    return (
      x + radius > obstacle.x &&
      x - radius < obstacle.x + obstacle.width &&
      y + radius > obstacle.y &&
      y - radius < obstacle.y + obstacle.height
    );
  }

  function intersectsObstacle(x, y) {
    const scene = getScene();
    const bounds = scene.bounds;
    const wallRadiusX = scene.playerWallRadiusX ?? PLAYER_RADIUS;
    if (
      x - wallRadiusX < bounds.left ||
      x + wallRadiusX > bounds.right ||
      y - PLAYER_RADIUS < bounds.top ||
      y + PLAYER_RADIUS > bounds.bottom
    ) {
      return true;
    }

    const intersectsScenery = scene.collisions.some((obstacle) =>
      intersectsCollisionShape(x, y, PLAYER_RADIUS, obstacle),
    );
    if (intersectsScenery) {
      return true;
    }

    // Actors use small foot-level circles so they can pass visually behind one
    // another without ever occupying the same patch of floor. If an NPC walks
    // into a stationary player, still allow the player to move back out.
    return npcStates.some(
      (state) =>
        !maintainsActorSeparation(
          player.x,
          player.y,
          x,
          y,
          state.x,
          state.y,
        ),
    );
  }

  function findEdgeWrapLanding(targetX, targetY, searchAxis) {
    const scene = getScene();
    const bounds = scene.bounds;
    const wallRadiusX = scene.playerWallRadiusX ?? PLAYER_RADIUS;
    const minimum =
      searchAxis === "x"
        ? bounds.left + wallRadiusX
        : bounds.top + PLAYER_RADIUS;
    const maximum =
      searchAxis === "x"
        ? bounds.right - wallRadiusX
        : bounds.bottom - PLAYER_RADIUS;
    const startingCoordinate = searchAxis === "x" ? targetX : targetY;
    const maximumOffset = maximum - minimum;

    for (
      let offset = 0;
      offset <= maximumOffset;
      offset += EDGE_WRAP_SEARCH_STEP
    ) {
      const candidates = offset
        ? [startingCoordinate - offset, startingCoordinate + offset]
        : [startingCoordinate];

      for (const coordinate of candidates) {
        if (coordinate < minimum || coordinate > maximum) {
          continue;
        }
        const candidateX = searchAxis === "x" ? coordinate : targetX;
        const candidateY = searchAxis === "y" ? coordinate : targetY;
        if (!intersectsObstacle(candidateX, candidateY)) {
          return { x: candidateX, y: candidateY };
        }
      }
    }

    return null;
  }

  function tryMove(deltaX, deltaY) {
    const scene = getScene();
    const bounds = scene.bounds;
    const wallRadiusX = scene.playerWallRadiusX ?? PLAYER_RADIUS;
    const nextX = player.x + deltaX;
    let horizontalWrapX = null;
    if (scene.edgeWrap?.horizontal) {
      if (nextX - wallRadiusX < bounds.left) {
        horizontalWrapX = bounds.right - wallRadiusX - EDGE_WRAP_INSET;
      } else if (nextX + wallRadiusX > bounds.right) {
        horizontalWrapX = bounds.left + wallRadiusX + EDGE_WRAP_INSET;
      }
    }

    if (horizontalWrapX !== null) {
      const landing = findEdgeWrapLanding(
        horizontalWrapX,
        player.y,
        "y",
      );
      if (landing) {
        player.x = landing.x;
        player.y = landing.y;
      }
      return;
    }

    if (!intersectsObstacle(nextX, player.y)) {
      player.x = nextX;
    }

    const nextY = player.y + deltaY;
    if (scene.edgeWrap?.top && nextY - PLAYER_RADIUS < bounds.top) {
      const landing = findEdgeWrapLanding(
        player.x,
        bounds.bottom - PLAYER_RADIUS - EDGE_WRAP_INSET,
        "x",
      );
      if (landing) {
        player.x = landing.x;
        player.y = landing.y;
      }
      return;
    }

    if (!intersectsObstacle(player.x, nextY)) {
      player.y = nextY;
    }
  }

  function updateNearestHotspot() {
    const scene = getScene();
    let nextNearest = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    scene.hotspots.forEach((hotspot) => {
      const distance = Math.hypot(player.x - hotspot.x, player.y - hotspot.y);
      if (distance <= hotspot.range && distance < nearestDistance) {
        nextNearest = hotspot;
        nearestDistance = distance;
      }
    });

    if (nearestHotspot?.id === nextNearest?.id) {
      return;
    }

    nearestHotspot = nextNearest;
    stage.classList.toggle("has-nearby-hotspot", Boolean(nearestHotspot));
    hotspotsElement.querySelectorAll(".hotspot").forEach((element) => {
      element.classList.toggle(
        "is-near",
        element.dataset.hotspotId === nearestHotspot?.id,
      );
    });

    if (nearestHotspot) {
      promptText.textContent = nearestHotspot.label;
      promptElement.classList.add("is-visible");
    } else {
      promptElement.classList.remove("is-visible");
    }
  }

  function dismissArrival() {
    window.clearTimeout(arrivalTimer);
    arrivalCard.classList.add("is-hidden");
  }

  function showArrival(scene) {
    const eyebrow = arrivalCard.querySelector(".arrival-card__eyebrow");
    const title = arrivalCard.querySelector("strong");
    const detail = arrivalCard.querySelector("span:last-child");
    if (!eyebrow || !title || !detail) {
      return;
    }

    eyebrow.textContent = scene === scenes.town ? "WELCOME TO" : "NOW ENTERING";
    title.textContent = scene.title;
    detail.textContent =
      scene === scenes.town
        ? "Walk to a glowing marker to explore."
        : "Watch the worker agents and explore the glowing stations.";
    arrivalCard.classList.remove("is-hidden");
    window.clearTimeout(arrivalTimer);
    arrivalTimer = window.setTimeout(dismissArrival, 3600);
  }

  async function changeScene(sceneId, destination) {
    if (transitioning || !scenes[sceneId]) {
      return;
    }

    if (sceneId === "town") {
      applyTownTimeOfDay();
    }

    transitioning = true;
    Object.keys(movement).forEach((direction) => {
      movement[direction] = false;
    });
    playerElement.classList.remove("is-walking");
    promptElement.classList.remove("is-visible");
    transitionElement.classList.add("is-active");

    const nextScene = scenes[sceneId];
    try {
      await preloadImage(nextScene.image);
    } catch (error) {
      console.error(`Unable to preload ${nextScene.image}`, error);
    }

    await new Promise((resolve) => window.setTimeout(resolve, 230));
    currentSceneId = sceneId;
    stage.dataset.scene = sceneId;
    player.x = destination?.x ?? nextScene.spawn.x;
    player.y = destination?.y ?? nextScene.spawn.y;
    player.direction = sceneId === "town" ? "down" : "up";
    sceneElement.style.backgroundImage = `url("${nextScene.image}")`;
    townBuilthereForeground.style.backgroundImage = `url("${nextScene.image}")`;
    locationTitle.textContent = nextScene.title;
    renderHotspots(nextScene);
    renderNpcs(nextScene);
    renderPlayer();
    nearestHotspot = null;
    updateNearestHotspot();
    showArrival(nextScene);

    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    transitionElement.classList.remove("is-active");
    transitioning = false;
    stage.focus({ preventScroll: true });
  }

  function openProjectDialog(viewId) {
    const renderView = dialogViews[viewId];
    if (!renderView) {
      return;
    }

    window.clearInterval(pipelineTimer);
    dialogReturnFocus = document.activeElement;
    dialogContent.innerHTML = renderView();
    if (typeof projectDialog.showModal === "function") {
      projectDialog.showModal();
    } else {
      projectDialog.setAttribute("open", "");
    }
    bindDialogInteractions(viewId);
  }

  function closeProjectDialog({ restoreFocus = true } = {}) {
    window.clearInterval(pipelineTimer);
    if (typeof projectDialog.close === "function" && projectDialog.open) {
      projectDialog.close();
    } else {
      projectDialog.removeAttribute("open");
    }
    if (restoreFocus) {
      const target =
        dialogReturnFocus instanceof HTMLElement ? dialogReturnFocus : stage;
      target.focus({ preventScroll: true });
    }
  }

  function activateHotspot(hotspot) {
    if (transitioning) {
      return;
    }
    if (hotspot.scene) {
      changeScene(hotspot.scene, hotspot.destination);
      return;
    }
    if (hotspot.dialog) {
      openProjectDialog(hotspot.dialog);
    }
  }

  function interact() {
    if (isDialogOpen() || transitioning) {
      return;
    }
    if (nearestHotspot) {
      activateHotspot(nearestHotspot);
      return;
    }
    promptText.textContent = "Move closer to a glowing marker";
    promptElement.classList.add("is-visible");
    window.setTimeout(() => {
      if (!nearestHotspot) {
        promptElement.classList.remove("is-visible");
      }
    }, 1100);
  }

  function bindDialogInteractions(viewId) {
    dialogContent.querySelectorAll("[data-dialog-enter]").forEach((button) => {
      button.addEventListener("click", () => {
        const sceneId = button.dataset.dialogEnter;
        closeProjectDialog({ restoreFocus: false });
        changeScene(sceneId);
        stage.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    if (viewId === "pizza-map") {
      const counts = {
        all: "200,000+ entries",
        pizza: "Pizza places",
        taco: "Taco places",
        tried: "116 reviewed",
      };
      const count = dialogContent.querySelector("[data-pizza-count]");
      dialogContent
        .querySelectorAll("[data-pizza-filter]")
        .forEach((button) => {
          button.addEventListener("click", () => {
            dialogContent
              .querySelectorAll("[data-pizza-filter]")
              .forEach((item) => item.classList.remove("is-active"));
            button.classList.add("is-active");
            if (count) {
              count.textContent =
                counts[button.dataset.pizzaFilter] || counts.all;
            }
          });
        });
    }

    if (viewId === "pizza-pipeline") {
      const runButton = dialogContent.querySelector("#run-pipeline");
      const status = dialogContent.querySelector("#pipeline-status");
      const nodes = [...dialogContent.querySelectorAll("[data-pipeline-node]")];
      runButton?.addEventListener("click", () => {
        window.clearInterval(pipelineTimer);
        nodes.forEach((node) => node.classList.remove("is-complete"));
        runButton.disabled = true;
        if (status) {
          status.textContent = "Demo: processing…";
        }
        let index = 0;
        pipelineTimer = window.setInterval(() => {
          nodes[index]?.classList.add("is-complete");
          index += 1;
          if (index >= nodes.length) {
            window.clearInterval(pipelineTimer);
            if (status) {
              status.textContent = "Demo validated ✓";
            }
            runButton.disabled = false;
            runButton.textContent = "Run again";
          }
        }, 380);
      });
    }

    if (viewId === "resume-themes") {
      const preview = dialogContent.querySelector("#mini-resume");
      const themeName = dialogContent.querySelector("#theme-name");
      dialogContent.querySelectorAll("[data-theme]").forEach((button) => {
        button.addEventListener("click", () => {
          dialogContent
            .querySelectorAll("[data-theme]")
            .forEach((item) => item.classList.remove("is-active"));
          button.classList.add("is-active");
          preview?.style.setProperty(
            "--resume-accent",
            button.dataset.color || "#235c91",
          );
          preview?.style.setProperty(
            "--resume-paper",
            button.dataset.paper || "#f8f5ed",
          );
          if (themeName) {
            themeName.textContent = button.dataset.theme || "Default";
          }
        });
      });
    }

    if (viewId === "resume-ai") {
      const runButton = dialogContent.querySelector("#run-scan");
      const fill = dialogContent.querySelector("#scan-fill");
      const score = dialogContent.querySelector("#scan-score");
      const tags = [...dialogContent.querySelectorAll("[data-scan-tag]")];
      runButton?.addEventListener("click", () => {
        fill?.classList.remove("is-complete");
        tags.forEach((tag) => tag.classList.remove("is-found"));
        if (score) {
          score.textContent = "Scanning evidence…";
        }
        requestAnimationFrame(() => fill?.classList.add("is-complete"));
        tags.forEach((tag, index) => {
          window.setTimeout(
            () => tag.classList.add("is-found"),
            230 + index * 180,
          );
        });
        window.setTimeout(() => {
          if (score) {
            score.textContent = "94% aligned";
          }
          runButton.textContent = "Scan complete ✓";
        }, 850);
      });
    }
  }

  function openHelp() {
    dialogReturnFocus = document.activeElement;
    if (typeof helpDialog.showModal === "function") {
      helpDialog.showModal();
    } else {
      helpDialog.setAttribute("open", "");
    }
  }

  function closeHelp() {
    if (typeof helpDialog.close === "function" && helpDialog.open) {
      helpDialog.close();
    } else {
      helpDialog.removeAttribute("open");
    }
    const target =
      dialogReturnFocus instanceof HTMLElement ? dialogReturnFocus : stage;
    target.focus({ preventScroll: true });
  }

  function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (keyDirections[key] && !isDialogOpen()) {
      event.preventDefault();
      movement[keyDirections[key]] = true;
      dismissArrival();
      return;
    }

    if ((key === "e" || key === "enter") && !isDialogOpen()) {
      event.preventDefault();
      interact();
    }
  }

  function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (keyDirections[key]) {
      movement[keyDirections[key]] = false;
    }
  }

  function gameLoop(frameTime) {
    const deltaSeconds = Math.min((frameTime - previousFrameTime) / 1000, 0.04);
    previousFrameTime = frameTime;

    if (!transitioning) {
      updateNpcs(deltaSeconds, frameTime);
    } else {
      npcStates.forEach((state) => {
        state.isWalking = false;
        renderNpcState(state);
      });
    }

    if (!isDialogOpen() && !transitioning) {
      let horizontal = Number(movement.right) - Number(movement.left);
      let vertical = Number(movement.down) - Number(movement.up);
      const isMoving = horizontal !== 0 || vertical !== 0;

      if (isMoving) {
        const length = Math.hypot(horizontal, vertical) || 1;
        horizontal /= length;
        vertical /= length;
        tryMove(
          horizontal * PLAYER_SPEED * deltaSeconds,
          vertical * PLAYER_SPEED * deltaSeconds,
        );

        if (Math.abs(horizontal) > Math.abs(vertical)) {
          player.direction = horizontal < 0 ? "left" : "right";
        } else {
          player.direction = vertical < 0 ? "up" : "down";
        }
      }

      playerElement.classList.toggle("is-walking", isMoving);
      renderPlayer();
      updateNearestHotspot();
    } else {
      playerElement.classList.remove("is-walking");
    }

    requestAnimationFrame(gameLoop);
  }

  function bindTouchControls() {
    document.querySelectorAll("[data-direction]").forEach((button) => {
      const direction = button.dataset.direction;
      const release = () => {
        movement[direction] = false;
        button.classList.remove("is-pressed");
      };

      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture?.(event.pointerId);
        movement[direction] = true;
        button.classList.add("is-pressed");
        dismissArrival();
      });
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);
    });

    const actionButton = document.querySelector("#action-button");
    actionButton?.addEventListener("pointerdown", () =>
      actionButton.classList.add("is-pressed"),
    );
    actionButton?.addEventListener("pointerup", () =>
      actionButton.classList.remove("is-pressed"),
    );
    actionButton?.addEventListener("pointercancel", () =>
      actionButton.classList.remove("is-pressed"),
    );
    actionButton?.addEventListener("click", interact);
  }

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", () => {
    Object.keys(movement).forEach((direction) => {
      movement[direction] = false;
    });
  });

  stage.addEventListener("pointerdown", () =>
    stage.focus({ preventScroll: true }),
  );
  document
    .querySelector("#dialog-close")
    ?.addEventListener("click", () => closeProjectDialog());
  document
    .querySelector("#directory-button")
    ?.addEventListener("click", () => openProjectDialog("directory"));
  document.querySelector("#help-button")?.addEventListener("click", openHelp);
  document.querySelector("#help-close")?.addEventListener("click", closeHelp);
  document.querySelector("#help-done")?.addEventListener("click", closeHelp);

  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) {
      closeProjectDialog();
    }
  });
  helpDialog.addEventListener("click", (event) => {
    if (event.target === helpDialog) {
      closeHelp();
    }
  });

  document.querySelectorAll("[data-enter-scene]").forEach((button) => {
    button.addEventListener("click", () => {
      changeScene(button.dataset.enterScene);
      stage.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  applyTownTimeOfDay();
  bindTouchControls();
  renderPlayer();
  renderHotspots(scenes.town);
  renderNpcs(scenes.town);
  sceneElement.style.backgroundImage = `url("${scenes.town.image}")`;
  townBuilthereForeground.style.backgroundImage = `url("${scenes.town.image}")`;

  Promise.all([
    preloadImage(scenes.town.image),
    preloadImage("../assets/world/anthony-walkcycle-v5.png"),
    preloadImage("../assets/world/llm-worker-walkcycle-v2.png"),
  ])
    .catch((error) =>
      console.error("Project Town assets did not fully preload", error),
    )
    .finally(() => {
      stage.classList.remove("is-loading");
      showArrival(scenes.town);
      requestAnimationFrame(gameLoop);
    });

  window.setInterval(
    () => applyTownTimeOfDay({ updateSceneImage: true }),
    60 * 1000,
  );
})();
