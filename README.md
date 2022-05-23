# SomtodaySSOLogin

Helper tool to get the credentials for the SomToday API using SSO login

## Installing

- Clone the repository `git clone https://github.com/Underlyingglitch/SomtodaySSOLogin`
- Run `npm install` to install dependencies

## Setting up

- Get the UUID for your school from `https://servers.somtoday.nl/organisaties.json`

## Using the program

- Run `node run {uuid}` and replace {uuid} by the uuid for your school
- A browser window will open with the login screen for your school.
  NOTICE: This is the real login window and is therefore secure. The code is open source, so you can verify I'm not doing anything with the credentials. They don't end up in de script anywhere and are sent to Microsoft over secure HTTPS only
- When you arrive at the last step, the browser will automatically close
- The token will be found in the `token.json` file that is automatically created
