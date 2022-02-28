# Nest JS app for calculation of cars rent
A backend app that provides a set of functionality related to cars rent.
## Posibilities:
1) to calculate a rent of car for a specific period
2) to create a session for renting a car
3) to generate a report on average load of cars per day, car, all cars
4) REST-API based
5) Easy set up with Docker 

## Technology stack
<table width="100%">
  <tr>
    <td align="center" valign="middle" width="16%">
      <a href="https://nestjs.com/">
        <img height="50" alt="NestJS" src="https://hsto.org/getpro/habr/post_images/d11/98b/ac8/d1198bac8e4ced0d89d5e5983061f418.png"/>
      </a>
      <br />
      NestJS
    </td>
    <td align="center" valign="middle" width="16%">
      <a href="https://www.postgresql.org/">
      <img height="50" alt="PostgresSQL" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/640px-Postgresql_elephant.svg.png"/>
      </a>
      <br />
      PostgresSQL
    </td>
    <td align="center" valign="middle" width="16%">
      <a href="https://www.docker.com/">
      <img height="50" alt="Docker" src="https://d1.awsstatic.com/acs/characters/Logos/Docker-Logo_Horizontel_279x131.b8a5c41e56b77706656d61080f6a0217a3ba356d.png"/>
      </a>
      <br />
      Docker
    </td>
    <td align="center" valign="middle" width="16%">
      <a href="https://jestjs.io/ru/">
      <img height="50" alt="Jest" src="https://jestjs.io/ru/img/opengraph.png"/>
      </a>
      <br />
      Jest
    </td>
    <td align="center" valign="middle" width="16%">
      <a href="https://www.typescriptlang.org/">
      <img height="50" alt="TypeScript" src="https://cdn.coursehunter.net/category/typescript.png"/>
      </a>
      <br />
      TypeScript
    </td>
    <td align="center" valign="middle" width="16%">
      <a href="https://www.chartjs.org/">
      <img height="50" alt="ChartJS" src="https://www.chartjs.org/img/chartjs-logo.svg"/>
      </a>
      <br />
      ChartJS
    </td>
  </tr>
</table>

## Start app
1) Create `.env` file, example
```dotenv
API_PORT=3001
API_HOST=http://localhost:
PG_CONNECTION=postgres
PG_USERNAME=user1
PG_PASSWORD=123456
PG_DATABASE=db_rent_car
PG_PORT=5432
PG_HOST=localhost
```
2) Start APP
```shell
docker-compose up -d
```
<div style="padding: 10px">
  <img height="80" alt="Postman" src="https://www.itsdelta.ru/upload/iblock/d41/d4164c9d28b9e2c11e347b5e477ab831.png"/>
</div>

If you want to test this app via Postman, import `RENT CAR.postman_collection.json` to your Postman collection and create an environment `API_HOST` = http://localhost:3001

## TEST
1) Clone this project to your repository
2) Open in terminal and run command:
```
cd backend/
npm install
```
3) Run test
```
npm run test
```

## API
- SWAGGER Documentation at http://localhost:3001/swagger
- REPORT at http://localhost:3001/report
- REPORT by period at http://localhost:3001/report?dt_from=2022-02-13&dt_to=2022-02-28
- REPORT by period and car at http://localhost:3001/report?dt_from=2022-02-13&dt_to=2022-02-28&car_id=2

## Demonstration
![gif](https://github.com/dmogilevtsev/nestjs-rent-car/blob/master/Rent%20Car.gif)