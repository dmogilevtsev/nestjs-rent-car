# Nestjs Rent Car
Backend-app for rent cars
## Posibilities:
- REST-API
- Generate Report
- Docker

## Technology stack
<table width="100%">
  <tr>
    <td align="center" valign="middle" width="20%">
      <a href="https://nestjs.com/">
        <img height="50" alt="NestJS" src="https://hsto.org/getpro/habr/post_images/d11/98b/ac8/d1198bac8e4ced0d89d5e5983061f418.png"/>
      </a>
      <br />
      NestJS
    </td>
    <td align="center" valign="middle" width="20%">
      <a href="https://www.postgresql.org/">
      <img height="50" alt="PostgresSQL" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/640px-Postgresql_elephant.svg.png"/>
      </a>
      <br />
      PostgresSQL
    </td>
    <td align="center" valign="middle" width="20%">
      <a href="https://www.docker.com/">
      <img height="50" alt="Docker" src="https://d1.awsstatic.com/acs/characters/Logos/Docker-Logo_Horizontel_279x131.b8a5c41e56b77706656d61080f6a0217a3ba356d.png"/>
      </a>
      <br />
      Docker
    </td>
  </tr>
</table>

## Start app
1) Create `.env` file, example
```dotenv
API_PORT=5000
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

<img height="80" alt="Postman" src="https://www.itsdelta.ru/upload/iblock/d41/d4164c9d28b9e2c11e347b5e477ab831.png"/>

If you like test app with Postman - import `RENT CAR.postman_collection.json` to your Postman APP

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
- SWAGGER on http://localhost:5000/swagger
- REPORT on http://localhost:5000/report
- REPORT by period on http://localhost:5000/report?dt_from=2022-02-13&dt_to=2022-02-28