# Food Delivery Project

Welcome to the Food Delivery Project! This project consists of two parts: FED (Front-end) and BED (Back-end).

## Installation

> Project uses **node** version **18.12.1**. Make sure, that intalled appropriate node, npm and npx versions.

> Project uses PostgreSQL as database. Assuming that PostgreSQL should be installed and **created individual database** for this app.

> After creating signle PostgreSQL database, open *bed* folder and find **.env** file. Replace default values with your own. Make sure that password choosen appropriately(PosgreSQL have master password and database user password that is needed).

Download this repo to local machine, if it not done, and go to root directory.
   ```
   gh repo clone GoodNightBuddy/food_delivery
   ```
Or you can choose ZIP archive.   

Next, follow these steps:

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

Excecute the following command from root directory:
   ```
   npm run start:all
   ```
This will concurrently start the FED (Front-end) and BED (Back-end) servers. Client runs at *http://localhost:3000/* and server at *http://localhost:3001/*. Check if this ports are free.

Or, you can use 2 terminals. Go and execute **npm run start** from *fed* folder and **npm run dev** from the *bed* folder.

# About
Main technologies are: React, Redux, Chakra UI for client side and Express with PostgreSQL on the server. Both parts writed with Typescript.

I good understand, that code structure and cleanliness leaves much to be desired. But I have only 3 days for this test task and it was done in a hurry. Redux or Firebase are installed just because I planned to give more fuctionality to this app, but met some problems, unfortunatelly.
[Deploy](https://food-delivery-front-end.onrender.com)

