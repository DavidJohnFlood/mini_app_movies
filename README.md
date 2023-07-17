# mini_app_movies
npm install in server and client directories

# add apikey
and your api key to the client/src/App.js

# create a docker container from an image
docker run --rm --name knex_pg_db -e POSTGRES_PASSWORD=docker -d -p 5432:5432

# run and terminal into that docker containter
docker exec -it knex_pg_db bash

# log into postgres from container
psql -U postgres

# create a database called moviedb
CREATE DATABASE moviedb;

# create tables
npx knex migrate:latest

# start server from ./server directory
npm start

# start client from ./client directory
npm start

Enjoy