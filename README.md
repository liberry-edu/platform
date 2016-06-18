## Directory structure
1. Create directory 'liberry' anywhere on your filesystem. This directory will be referred to as LIBERRY_HOME henceforth. Set the env variable LIBERRY_HOME to this directory.
2. Create directories 'pi' and 'central' within it
3. Create directories 'code', 'content', 'output' in both 'pi' and 'central' directories
4. Create directories 'pi' and 'central' within the 'output' directories created in the last step
5. Clone the 'platform' repository in the 'code' directory in both 'pi' and 'central' directories

## Setup instructions
1. sudo apt-get install node
2. sudo npm install -g pm2
3. pm2 install pm2-logrotate
4. sudo apt-get install node-vows
5. sudo npm install -g sequelize-cli
6. sudo apt-get install sqlite3
7. cd /home/<username>/liberry/code
8. npm install
9. Create database 'liberry' in your MySQL instance
10. Update the password for 'root' user in the env.js file
11. sequelize db:migrate
12. sudo apt-get install mysql-client-5.5

## Running instructions
1. cd into $LIBERRY_HOME/pi/code or $LIBERRY_HOME/central/code depending upon which server you want to run
2. Set the env variables
    1. 'export LIBERRY_ROOT=$LIBERRY_HOME/pi' or 'export LIBERRY_ROOT=$LIBERRY_HOME/central'
    2. 'export MODE=pi' or 'export MODE=central'
3. pm2 start app.js

## Tech stack
1. Node.js based backend
2. Hapi.js as the web framework on top of Node.js
3. PM2 as the process manager to run, monitor, log
4. SQLite3 as the Database for the Pi server
5. MySQL as the Database for the Central server
6. Sequelize as the ORM and Migration framework
7. Vows.js as the testing framework
8. Travis CI for automated testing

## Database tables
1. user - Represents both the end user and the admin. The difference between end user and admin is the 'role' field.
2. category - Represents the category and content would belong to. Just a way to categorize the content.
3. module - Represents a course containing many videos/texts/games. Belongs to a particular category.
4. content - Represents the actual content that the end user would consume. It holds the path to the actual file on the filesystem.
5. playlist - Represents a sequence of content to be played.
6. playlist_content - Used to define the content that a playlist contains along with the order in which the content should be played.
7. device - Represents a Raspberry Pi device
8. location - Represents a location(school, village, etc) where a Rapsberry Pi is installed
9. app -Represents a frontend app that is deployed on the Pi
10. activity - Captures the action of a user watching a content

## Central User Features
1. User can register to the app using /register endpoint and providing necessary details
2. User needs to access all other endpoints by providing the username:password with base64 encoding (Basic Auth)
3. There is no session maintained. All requests need to carry the Authentication header
4. User can access the /me endpoint to get his details

## Central Admin Features
1. Admin can access /me endpoint to get his details
2. Admin needs to be created directly in the DB. There is no way to register someone as Admin
3. Admin can upload the user.sql table to /syncdb url to insert the data into central DB
4. Admin can hit /download endpoint to dump the DB tables and pull new code of platform-pi in the liberry directory
5. /download does not actually download the data to the pendrive. That has to be done separately
6. Admin can create new devices, locations, categories, modules, content, playlist, etc

## Pi User Features
1. User can register to the app using /register endpoint and providing necessary details
2. User needs to access all other endpoints by providing the username:password with base64 encoding (Basic Auth)
3. There is no session maintained. All requests need to carry the Authentication header
4. User can access the /me endpoint to get his details
5. CRUD endpoints available for all content related tables. Only Admin can do write operations though

## Pi Admin Features
1. Admin can access /me endpoint to get his details
2. Admin needs to be created directly in the DB. There is no way to register someone as Admin
3. Admin can download the dump of 'user' table using /download?path=/path/to/liberry/directory/on/pendrive endpoint
4. Admin can upload new content and code using /upload?path=/path/to/liberry/directory/on/pendrive endpoint
5. Admin can sync all the content related tables using /syncdb?path=/path/to/liberry/directory/on/pendrive endpoint
6. Admin can restart the server using endpoint /restart

## Liberry directory content on central server
1. 'database.sqlite' file which is the actual database
2. 'code' directory containing the latest codebase of platform
3. 'content' directory containing all the content files
4. 'output/central' directory containing the dump created by accessing /download endpoint

## Liberry directory content on pi server
1. 'database.sqlite' file which is the actual database
2. 'code' directory containing the latest codebase of platform
3. 'content' directory containing all the content files
4. 'output/pi' directory containing the dump created by accessing /download endpoint

## Liberry directory content on the pendrive
1. 'code' directory containing the latest codebase of platform
2. 'content' directory containing all the content files
3. 'output/central' directory containing the dump created by accessing /download endpoint on the central server.
4. 'output/pi' directory in which the pi server will dump it's own database tables. The files will have naming convention mac_table.sql
