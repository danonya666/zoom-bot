1. Clone the repository then run `npm install` in the github directory to get all the dependencies.
2. Make sure you're set up to use the MTurk API. I have a [intro](https://glitch.com/edit/#!/mturk) that will get you started.
3. Add an `.env` with the following content:

```PowerShell
NODE_ENV=development/production //var for setup front build and etc, not for mturk
API_HOST=your host
MONGO_URI=your mongo connect uri
ADMIN_TOKEN=your admin token
```

4. Set up mongodb (ver. 4.0)
5. Start the server (port 3001) by running `node built/index.js`.
6. Build front in prod mode by `npm run build-front` and use /front/build/ as static folder or
   Start dev front-server with hot reload by `npm run start-front` (port 3000)

## Source/etc files

All server code - /server;
All front code - /front/src, /front/public;
Front building utils - /front/scripts, /front/config;
Built front code - /front/build;
Built server code - /built;

## Developing

Run `tsc` to watch typescript files for changes and `supervisor server/index.js` so that the server will restart when files in the github folder are changed.

The URL parameters are required because they are read in from Amazon Mechanical Turk. Here's an example URL for local host: http://127.0.0.1:3000/?assignmentId=3K4J6M3CXF8DU3JZ8XUVEMJHFWEAGV&hitId=3TRB893CSJPTPHN7BSD9FBMB45DG72&workerId=A19MTSLG2OYDLZ&turkSubmitTo=https%3A%2F%2Fworkersandbox.mturk.com

