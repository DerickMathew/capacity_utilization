### Setup:
##### Register app:
1. Use `manifest\register_app.json` payload structure to register this app with **elrond**.
2. Copy the app registration response from **elrond**. User returned in the response is **App User**. User details will be used to update the config files.

##### Update Configs:
1. Update configs in `client\config\dev.env.js` for dev environment.

2. Copy `config\local.json.dist.json` to `config\local.json` and update the configs in `config\local.json` accordingly. Update `app.apiKey` with the **App User's** apiKey. 

##### Client setup:
``` 
cd client
npm install
npm run build
cd ..
 ```
 
##### Server setup:
 ``` 
 npm install
 npm run start
  ```
  