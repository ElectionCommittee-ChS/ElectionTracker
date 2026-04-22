# ElectionTracker

A small project that gives "live" statistics on Chalmers student unions council elections

## Update for a new year

1. In `frontend/src/views/HomeView.vue` update the students_by_division object to correct values of how many total students each division has
2. In `backend/index.js` enable both `setInterval` functions
3. Push your changes to GitHub and they will be automatically deployed to the server
4. Update the `environment:` on portainer with a new `mecenat.id` and `ASP.NET_SessionId`. You can get these by logging in on your mecenat account -> opening devTools -> finding the correct cookies

## Local development

0. Install nodejs and git
1. Clone the repository
2. Copy the `.env` to `.env.local` and fill in the correct values for `MECENAT_ID` and `SESSION_ID` (`mecenat.id` and `ASP.NET_SessionId` from the cookies)
3. Run `npm install`
5. Run `npm start` to start the development server for both the frontend and backend. Open [localhost:5173/](http://localhost:5173/) in your browser to see the app. It will automatically reload when you make changes to the code, the backend might take a few seconds to restart after changes.

## Test like production

1. Install docker
2. Run `docker compose up --build` in the root of the project
3. Open [localhost:3000/](http://localhost:3000/) in your browser. This is exatly how the app will run in production, just make sure to update the environment variables in portainer!

## Credits

Made by [Lucas Glimfjord](https://github.com/hallavad)

Updated by [Emrik Östling](https://github.com/C4illin)
