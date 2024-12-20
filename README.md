# mtn

## Swagger link

https://app.swaggerhub.com/apis/OMNIAKHALED239/MTNApis/1.0.0

## Installation

1. Clone the repository
2. Install docker and docker-compose and stop postgres service
3. Run `docker-compose -f docker-compose-db.yaml up -d --build`
4. Install pnpm `npm install -g pnpm`
5. Run `pnpm install`
6. Run `pnpm migrate`
7. Run `pnpm dev`
