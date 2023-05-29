# Food Delivery Project

Welcome to the Food Delivery Project! This project consists of two parts: FED (Front-end) and BED (Back-end).

[Deploy](https://food-delivery-front-end.onrender.com)


## Installation

> For the first, this project uses PostgreSQL. Assuming that you should have installed Postgres=SQL and have created individual database for this app.

> After creating signle PostgreSQL database, open *bed* folder and find **.env** file. Replace default values with your own. Make sure that password choosen from specifical database rather than master password from PG tools.

Download this repo to local machine, if it not done, and go to root directory.

Next, please follow these steps:

1. Install dependencies for both FED and BED:
   ```
   npm run install:all
   ```

2. Create the database configuration file:
   ```
   npm run create:dbconfig
   ```

3. Execute database migration:
   ```
   npm run execute:migrate
   ```

## Usage

To start the project, you need 2 terminals. Go and execute **npm run start** from *fed* folder and **npm run dev** from the *bed* folder. Although, yo just can excecute the following command from root directory:
   ```
   npm run start:all
   ```
This will concurrently start the FED (Front-end) and BED (Back-end) servers.

# About
Main technologies on client side are: React, Redux, Chakra UI for client side and Express with PostgreSQL on the server. Both parts writed with Typescript.

I good understand, that code structure and cleanliness leaves much to be desired. But I have only 3 days for this test task. Redux or Firebase are installed just because I planned to give more fuctionality to this app, but met some problems, unfortunately.
