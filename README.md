The assignment was very fun to work on and I enjoyed learning a lot of new things. I use different tools in day to day work, so almost all the tech in this assignment was new to me. As part of preparation I got basic overview of TypeScript, added configuration for npm, git, Three.js and Vite, mostly relying on tutorials.

I spent around 10 hours on preparation and another 8 on the actual assignment. Unfortunatelly most of this time was consumed by figuring out things, less on writing code, so although I liked the chanllenge a lot, I'm aware that the time invested doesn't translate in high quality of the results.

I didn't complete all the steps. The elements that are done:
- Added one object to scene from .glb files. 
- Implemented selecting a model and a box. 
    - when item is selected the gizmo is attached to it.
    - it's possible to see long red indicator when hovering over objects, if there was more time it could be semi transpart bounding box instead. Only specific objects can be selected.
- Created function that moves vertices of the plane, when they are clicked.
- Added texture to a wall
- Added basic setup for scene and lighting.

Priorities
- I prioritized the parts of the assignment that had the most risk in my opinion of taking up time and troubleshooting: 
    -  loading model.
    - selecting an object.
    - modifying vertixes.
- I assumed that many of the elements that would improve visual quality are more a matter of tinkering and tweaking the setup, which would be satisfying to do in next iterations,but I didn't want to risk running out of time with big chunks of work left.
- I focused on minimum valiable solutions. Each of the feature could use more attention to details and visual improvements. 
    - for example: improving lights and shadows, textures, materials etc.

File structure and code quality: 
- I focused first on getting the changes in, without much attention to organizing code.
- I did a bit of clean up when it started to be difficult to work with and there were already few features implemented
    - added separate class for DemoScene extending implementation of THREE.Scene
    - encapsulated code in functions
    - separated initialization and update funtionality
    - there are still many potential improvements, like reducing amount of global variables and moving code from main.ts in separate files.
- The code quality is probably far from senior level coding standards, I would need a bit more time to learn best practices in TypeScript.

The command I used to setup Three.js 

`npm install three`

it might recuired extra command if import causes errors:

`npm i --save-dev @types/three`

command to run it:

`npm run dev`

