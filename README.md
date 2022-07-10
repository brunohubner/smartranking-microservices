# Smart Ranking Microservices

Smart Ranking is a backend application for organizing challenges and matches between multiple players. Basically when a player challenges another player to a new challenge the challenged player receives an email being notified. At the end of each challenge the score is saved and with that it is possible to have access to the Ranking of the best players.

The application was developed using the NestJS Framework with the Microservices Architecture, which is divided into 5 NodeJS projects that communicate with each other using RabbitMQ queues.

These are the Projects:

- API Gateway
- Backend Admin Microservice
- Challenges Microservice
- Rankings Microservice
- Notifications microservice

API Gateway has Swagger documentation for Endpoints, while microservices connect to external services like MongoDB and SendGrid.

#

Steps to run the project locally:

<br/>

- Create a [RabbitMQ](https://hub.docker.com/_/rabbitmq) docker container.
- Create a [MongoDB](https://hub.docker.com/_/mongo) docker container.
- Create account in [SendGrid](https://sendgrid.com/).
- Install dependencies in all NodeJS projects.
- Fill `.env` files with correct valriables values.
- Execute NPM scripts to build and start each NodeJS Project.
- Consult Swagger Documentation in API Gateway.