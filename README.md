# NodeJS_E-commerce_kafka
This Node.js project allows you to use Kafkajs with my application

## Table of Contents

  - [NodeJS\_E-commerce\_kafka](#nodejs_e-commerce_kafka)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) installed on your machine.
- [MongoDB](https://www.mongodb.com/) MongoDB localhost.
- [Docker](https://www.docker.com/) 
- [Kafkajs](https://kafka.js.org/docs/getting-started) apache kafka client

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone git@github.com:MontaserHassan/simple-E-commerce-Kafka.git

2. install dependencies:

    ```bash
    cd kafka-configuration
    npm install

    cd ../e-commerce-services
    npm install

3. Run Docker Container:

   ```bash
   cd ..
   docker compose up

4. Run E-commerce App:

    ```bash
    cd e-commerce-services
    npm start

5. Run Messaging-Notification App:

    ```bash
    cd ../messaging-notify
    npm start

6. Run Messaging-Sold App:

    ```bash
    cd ../Messaging-sold
    npm start



<h2>App Features:</h2>
<ol>
 <li>User can register and login</li>
 <li>User can update  his data.</li>
 <li>User will receive notification after add new product in database.</li>
 <li>User can buy product then will receive a notification and create order delivery.</li>
</ol>