# karvalet

A small project that gives "live" statistics on Chalmers student unions council elections

## Development

```sh
npm run dev
```

## Build

```sh
npm run build
```

## Update for a new year

1. In `frontend/src/views/HomeView.vue` update the students_by_division object to correct values of how many total students each division has
2. Update the `backend/getData.js` file with a new `mecenat.id` and `ASP.NET_SessionId`. You can get these by logging in on your mecenat account -> opening devTools -> finding the correct cookies
3. Push your changes to GitHub

<!-- 3. build the project using `yarn build`
4. copy `frontend/public` and `../getData.sh` to the correct place for hosting -->
<!-- 5. Update the `../getData.sh` file with the location for the `data.json` file (last part of the script) -->
<!-- 6. Setup something that makes the `../getData.sh` file periodically update. For example a cronjob or similar. Alternatively run the file manually whenever you want updated values from mecenat -->

## Credits

Made by [Lucas Glimfjord](https://github.com/hallavad)
