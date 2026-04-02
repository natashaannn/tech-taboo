// Game Development Terms - 54 cards per deck
import type { TabooWord } from "../../../types/taboo";

export const gameDevTabooList: TabooWord[] = [
  {
    index: 1,
    word: "Unity",
    taboo: ["Engine", "3D", "C#", "GameObject", "Unreal"],
    explanation:
      "A popular platform for creating video games across multiple devices and platforms.",
    category: "Game Dev",
  },
  {
    index: 2,
    word: "Unreal Engine",
    taboo: ["Epic", "Blueprint", "C++", "Unity", "Graphics"],
    explanation:
      "A powerful game creation tool known for high-quality visuals and used in AAA games.",
    category: "Game Dev",
  },
  {
    index: 3,
    word: "Game Loop",
    taboo: ["Update", "Render", "Frame", "Cycle", "Tick"],
    explanation:
      "The continuous process that runs the game, handling input, updating state, and drawing graphics.",
    category: "Game Dev",
  },
  {
    index: 4,
    word: "Frame Rate",
    taboo: ["FPS", "Frames Per Second", "Smooth", "Performance", "60"],
    explanation:
      "How many images are displayed per second, affecting how smooth the game looks.",
    category: "Game Dev",
  },
  {
    index: 5,
    word: "Sprite",
    taboo: ["2D", "Image", "Texture", "Pixel", "Character"],
    explanation:
      "A two-dimensional image or animation that represents an object in a game.",
    category: "Game Dev",
  },
  {
    index: 6,
    word: "Collision Detection",
    taboo: ["Hit", "Physics", "Overlap", "Boundary", "Contact"],
    explanation:
      "The process of determining when two objects in a game touch or intersect.",
    category: "Game Dev",
  },
  {
    index: 7,
    word: "Rigging",
    taboo: ["Skeleton", "Bones", "Animation", "3D", "Character"],
    explanation:
      "Creating a skeletal structure for a 3D model so it can be animated and moved.",
    category: "Game Dev",
  },
  {
    index: 8,
    word: "Texture Mapping",
    taboo: ["Surface", "Image", "Material", "UV", "Wrap"],
    explanation:
      "Applying images to 3D models to give them color, detail, and realistic surfaces.",
    category: "Game Dev",
  },
  {
    index: 9,
    word: "Level Design",
    taboo: ["Map", "Stage", "Environment", "Layout", "World"],
    explanation:
      "Creating the spaces and challenges that players navigate through in a game.",
    category: "Game Dev",
  },
  {
    index: 10,
    word: "Game Mechanics",
    taboo: ["Rules", "Gameplay", "System", "Interaction", "Core"],
    explanation:
      "The fundamental rules and systems that define how players interact with a game.",
    category: "Game Dev",
  },
  {
    index: 11,
    word: "Shader",
    taboo: ["Graphics", "GPU", "Rendering", "Visual", "Effect"],
    explanation:
      "A program that controls how surfaces and lighting appear in a game's graphics.",
    category: "Game Dev",
  },
  {
    index: 12,
    word: "Particle System",
    taboo: ["Effect", "Fire", "Smoke", "Explosion", "Emitter"],
    explanation:
      "A technique for creating visual effects like fire, smoke, or magic using many small sprites.",
    category: "Game Dev",
  },
  {
    index: 13,
    word: "Hitbox",
    taboo: ["Collision", "Area", "Damage", "Detection", "Boundary"],
    explanation:
      "An invisible area around a character or object that determines when it can be hit.",
    category: "Game Dev",
  },
  {
    index: 14,
    word: "NPC",
    taboo: ["Non-Player Character", "AI", "Bot", "Enemy", "Villager"],
    explanation:
      "Characters in a game controlled by the computer rather than human players.",
    category: "Game Dev",
  },
  {
    index: 15,
    word: "Procedural Generation",
    taboo: ["Random", "Algorithm", "Minecraft", "Automatic", "Create"],
    explanation:
      "Using algorithms to automatically create game content like levels or terrain instead of designing by hand.",
    category: "Game Dev",
  },
  {
    index: 16,
    word: "Asset",
    taboo: ["Resource", "File", "Model", "Sound", "Texture"],
    explanation:
      "Any piece of content used in a game, like images, sounds, or 3D models.",
    category: "Game Dev",
  },
  {
    index: 17,
    word: "Polygon",
    taboo: ["Triangle", "3D", "Mesh", "Vertex", "Face"],
    explanation:
      "A flat shape with straight sides used as building blocks for 3D models.",
    category: "Game Dev",
  },
  {
    index: 18,
    word: "Mesh",
    taboo: ["3D", "Model", "Polygon", "Vertices", "Geometry"],
    explanation:
      "A collection of vertices, edges, and faces that defines the shape of a 3D object.",
    category: "Game Dev",
  },
  {
    index: 19,
    word: "Raycast",
    taboo: ["Line", "Physics", "Detection", "Shoot", "Trace"],
    explanation:
      "Shooting an invisible line through the game world to detect what it hits.",
    category: "Game Dev",
  },
  {
    index: 20,
    word: "Game State",
    taboo: ["Status", "Condition", "Save", "Progress", "Data"],
    explanation:
      "All the information about the current situation in a game, like player position and score.",
    category: "Game Dev",
  },
  {
    index: 21,
    word: "Spawn Point",
    taboo: ["Start", "Respawn", "Location", "Appear", "Origin"],
    explanation:
      "A designated location where characters or objects appear in the game world.",
    category: "Game Dev",
  },
  {
    index: 22,
    word: "Buff",
    taboo: ["Power-up", "Boost", "Enhance", "Temporary", "Stronger"],
    explanation:
      "A temporary enhancement that makes a character more powerful or capable.",
    category: "Game Dev",
  },
  {
    index: 23,
    word: "Nerf",
    taboo: ["Weaken", "Balance", "Reduce", "Patch", "Update"],
    explanation:
      "To reduce the power or effectiveness of something in a game to improve balance.",
    category: "Game Dev",
  },
  {
    index: 24,
    word: "Game Engine",
    taboo: ["Unity", "Unreal", "Framework", "Tool", "Platform"],
    explanation:
      "Software that provides the core functionality needed to create and run games.",
    category: "Game Dev",
  },
  {
    index: 25,
    word: "Pathfinding",
    taboo: ["AI", "Navigation", "Route", "A*", "Movement"],
    explanation:
      "The process of calculating the best route for a character to move from one point to another.",
    category: "Game Dev",
  },
  {
    index: 26,
    word: "Skybox",
    taboo: ["Background", "Sky", "Horizon", "Environment", "Cube"],
    explanation:
      "A large cube surrounding the game world that displays distant scenery like sky and mountains.",
    category: "Game Dev",
  },
  {
    index: 27,
    word: "Prefab",
    taboo: ["Template", "Reusable", "Unity", "Object", "Clone"],
    explanation:
      "A reusable template for game objects that can be placed multiple times in a scene.",
    category: "Game Dev",
  },
  {
    index: 28,
    word: "Culling",
    taboo: ["Hide", "Optimize", "Frustum", "Performance", "Render"],
    explanation:
      "Not rendering objects that aren't visible to the camera to improve performance.",
    category: "Game Dev",
  },
  {
    index: 29,
    word: "LOD",
    taboo: [
      "Level of Detail",
      "Distance",
      "Optimize",
      "Quality",
      "Performance",
    ],
    explanation:
      "Using simpler versions of 3D models when they're far away to save processing power.",
    category: "Game Dev",
  },
  {
    index: 30,
    word: "Bounding Box",
    taboo: ["Collision", "Rectangle", "Area", "Detection", "Boundary"],
    explanation:
      "A simple rectangular shape used to approximate an object's area for collision detection.",
    category: "Game Dev",
  },
  {
    index: 31,
    word: "Game Balance",
    taboo: ["Fair", "Difficulty", "Tuning", "Adjust", "Nerf"],
    explanation:
      "Adjusting game elements so that no strategy or character is too powerful or weak.",
    category: "Game Dev",
  },
  {
    index: 32,
    word: "Playtesting",
    taboo: ["Test", "Feedback", "Players", "QA", "Bug"],
    explanation:
      "Having people play your game to find problems and gather feedback.",
    category: "Game Dev",
  },
  {
    index: 33,
    word: "Checkpoint",
    taboo: ["Save", "Progress", "Respawn", "Point", "Restart"],
    explanation:
      "A location in a game where progress is saved so players don't lose everything if they fail.",
    category: "Game Dev",
  },
  {
    index: 34,
    word: "Boss Fight",
    taboo: ["Enemy", "Challenge", "Final", "Difficult", "Battle"],
    explanation:
      "A climactic battle against a powerful enemy, usually at the end of a level or game.",
    category: "Game Dev",
  },
  {
    index: 35,
    word: "Loot",
    taboo: ["Reward", "Drop", "Item", "Treasure", "Collect"],
    explanation:
      "Items or rewards that players can collect from defeated enemies or chests.",
    category: "Game Dev",
  },
  {
    index: 36,
    word: "Inventory System",
    taboo: ["Items", "Storage", "Bag", "Manage", "Collect"],
    explanation:
      "The interface and logic for managing items a player has collected.",
    category: "Game Dev",
  },
  {
    index: 37,
    word: "Quest",
    taboo: ["Mission", "Task", "Objective", "Story", "Goal"],
    explanation:
      "A specific task or objective given to the player to complete for rewards.",
    category: "Game Dev",
  },
  {
    index: 38,
    word: "Cutscene",
    taboo: ["Cinematic", "Video", "Story", "Animation", "Watch"],
    explanation:
      "A non-interactive sequence that advances the story or shows important events.",
    category: "Game Dev",
  },
  {
    index: 39,
    word: "HUD",
    taboo: ["Heads-Up Display", "UI", "Interface", "Health", "Score"],
    explanation:
      "The on-screen display showing important information like health, ammo, and score.",
    category: "Game Dev",
  },
  {
    index: 40,
    word: "Minimap",
    taboo: ["Map", "Radar", "Navigation", "Corner", "Location"],
    explanation:
      "A small map displayed on screen showing the player's position and nearby areas.",
    category: "Game Dev",
  },
  {
    index: 41,
    word: "Respawn",
    taboo: ["Revive", "Reappear", "Death", "Restart", "Spawn"],
    explanation: "When a character reappears in the game after being defeated.",
    category: "Game Dev",
  },
  {
    index: 42,
    word: "Lag",
    taboo: ["Delay", "Slow", "Network", "Latency", "Connection"],
    explanation:
      "A delay between player input and game response, often due to network issues.",
    category: "Game Dev",
  },
  {
    index: 43,
    word: "Hitmarker",
    taboo: ["Indicator", "Damage", "Confirm", "Visual", "Feedback"],
    explanation:
      "A visual or audio cue confirming that an attack successfully hit a target.",
    category: "Game Dev",
  },
  {
    index: 44,
    word: "Cooldown",
    taboo: ["Wait", "Ability", "Timer", "Recharge", "Delay"],
    explanation:
      "The time a player must wait before using a special ability again.",
    category: "Game Dev",
  },
  {
    index: 45,
    word: "Ragdoll Physics",
    taboo: ["Death", "Floppy", "Realistic", "Body", "Fall"],
    explanation:
      "Realistic physics simulation that makes characters move naturally when falling or dying.",
    category: "Game Dev",
  },
  {
    index: 46,
    word: "Clipping",
    taboo: ["Bug", "Through", "Wall", "Glitch", "Collision"],
    explanation:
      "A visual error where objects pass through each other instead of colliding properly.",
    category: "Game Dev",
  },
  {
    index: 47,
    word: "Speedrun",
    taboo: ["Fast", "Record", "Time", "Complete", "Quick"],
    explanation:
      "Completing a game as quickly as possible, often using advanced techniques.",
    category: "Game Dev",
  },
  {
    index: 48,
    word: "Easter Egg",
    taboo: ["Secret", "Hidden", "Reference", "Joke", "Surprise"],
    explanation:
      "A hidden message, feature, or joke placed in a game by developers.",
    category: "Game Dev",
  },
  {
    index: 49,
    word: "Mod",
    taboo: ["Modification", "Custom", "Community", "Change", "User"],
    explanation:
      "Player-created modifications that change or add content to a game.",
    category: "Game Dev",
  },
  {
    index: 50,
    word: "Sandbox",
    taboo: ["Open", "Freedom", "Minecraft", "Creative", "Explore"],
    explanation:
      "A game style that gives players freedom to explore and create without strict objectives.",
    category: "Game Dev",
  },
  {
    index: 51,
    word: "Permadeath",
    taboo: ["Permanent", "Death", "Roguelike", "Restart", "Hardcore"],
    explanation:
      "When a character's death is permanent and you must start the entire game over.",
    category: "Game Dev",
  },
  {
    index: 52,
    word: "Grinding",
    taboo: ["Repetitive", "Farm", "Level", "Experience", "Boring"],
    explanation:
      "Repeatedly performing the same actions to gain experience, items, or currency.",
    category: "Game Dev",
  },
  {
    index: 53,
    word: "Meta",
    taboo: ["Strategy", "Best", "Optimal", "Popular", "Competitive"],
    explanation:
      "The most effective strategies or characters currently dominating competitive play.",
    category: "Game Dev",
  },
  {
    index: 54,
    word: "DLC",
    taboo: ["Downloadable Content", "Expansion", "Add-on", "Extra", "Purchase"],
    explanation:
      "Additional content released after a game's launch that players can download.",
    category: "Game Dev",
  },
];
