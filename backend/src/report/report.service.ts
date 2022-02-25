import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

import { DatabaseService } from './../db/database.service';
import {
    IAverageCarLoadByDayResponse,
    ICarWithDates,
} from './reposrt.interface';
import { addDays, differenceInDays, format, isAfter, isBefore } from 'date-fns';

@Injectable()
export class ReportService {
    log: Logger = new Logger(ReportService.name);

    constructor(private readonly db: DatabaseService) {}

    async averageCarLoadByDay(
        dt_from: Date,
        dt_to: Date,
    ): Promise<IAverageCarLoadByDayResponse[]> {
        const diff = differenceInDays(dt_from, dt_to);
        if (diff > 31) {
            throw new HttpException(
                'The maximum number of days must not exceed 30',
                HttpStatus.BAD_REQUEST,
            );
        }
        const res = await this.db.executeQuery<IAverageCarLoadByDayResponse>(
            `
            select b.dt_from, b.dt_to, a.brand || ' ' || a.model as car
            from cars as a
            left join session as b on b.car_id = a.id
            where b.dt_from is null or (b.dt_from >= $1 and b.dt_from <= $2)
        `,
            [dt_from, dt_to],
        );
        this.log.debug(res);
        return res;
    }

    async report(dt_from: Date, dt_to: Date) {
        const data = await this.averageCarLoadByDay(dt_from, dt_to);

        // Array of date by period
        const colDates: Date[] = [];
        let dt: Date = dt_from;
        while (dt < addDays(dt_to, 1)) {
            colDates.push(dt);
            dt = addDays(dt, 1);
        }

        // Array of car with rent days
        const carsWithDates: ICarWithDates[] = [];
        data.forEach(el => {
            carsWithDates[el.car] = data.filter(car => car.car === el.car);
        });

        // HTML Page
        const header = getHTMLHeader(format(new Date(), 'Pp'));
        const footer = `</div></body></html>`;

        // HTML Table
        const ths = getHTMLTableThs(colDates);

        const tbody = getHTMLTableTBody(colDates, carsWithDates);
        const table = getHTMLTable(ths, tbody);

        // Charts
        // Line
        const label = `${format(dt_from, 'dd')} ${format(
            dt_from,
            'LLLL',
        )} - ${format(dt_to, 'dd')} ${format(dt_to, 'LLLL')}`;
        const labels = colDates
            .map(el => `'${format(el, 'ccc')} ${format(el, 'dd')}'`)
            .join(',');
        const charLinetData = colDates
            .map(
                date =>
                    data.filter(
                        el =>
                            isAfter(date, el.dt_from) &&
                            isBefore(date, addDays(el.dt_to, 1)),
                    ).length,
            )
            .join(',');

        const chartWrapper = getChartWrapper();
        const lineChart = getLineChart(label, labels, charLinetData);

        // Bar
        const arrayOfCars = Object.keys(carsWithDates).sort();
        const cars = arrayOfCars.map(car => `'${car}'`).join(',');
        const barData = arrayOfCars
            .map(car => data.filter(el => el.car === car).length)
            .join(',');
        const barChart = getBarChart(cars, barData, label);

        const charts = `
            ${chartWrapper}
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
                ${lineChart}
                ${barChart}
            </script>
        `;
        return `
            ${header}
            ${table}
            ${charts}
            ${footer}
        `;
    }
}

function getHTMLHeader(toDay: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
                crossorigin="anonymous"
            />
            <title>Report</title>
        </head>
        <body>
            <div class="container">
                <div class="row mb-3 align-items-center">
                    <div class="col-sm-6">
                        <h1>Average car load</h1>
                    </div>
                    <div class="col-sm-6 text-muted text-end">
                        ${toDay}
                    </div>
                </div>
    `;
}

function getHTMLTable(ths: string, tbody: string): string {
    return `
    <table class="table table-striped table-responsive table-sm">
        <thead>
            <tr>
                <th scope="col">Auto/Day</th>
                ${ths}
            </tr>
        </thead>
        ${tbody}
    </table>
    `;
}

function getHTMLTableThs(columns: Date[]) {
    return columns
        .map(
            el =>
                `<th scope="col">${format(el, 'ccc')} ${format(el, 'dd')}</th>`,
        )
        .join('');
}

function getHTMLTableTBody(columns: Date[], carsWithDates: ICarWithDates[]) {
    function getTr(car: string): string {
        const checkCar: number[] = columns.map(date => {
            let check = false;
            Array.from(carsWithDates[car]).some(el => {
                if (
                    isAfter(date, el['dt_from']) &&
                    isBefore(date, addDays(el['dt_to'], 1))
                ) {
                    check = true;
                    return;
                }
            });
            return check ? 1 : 0;
        });
        return `
            <tr><td>${car}</td>${checkCar
            .map(el => `<td>${el}</td>`)
            .join('')}</tr>`;
    }
    return `
        <tbody>
            ${Object.keys(carsWithDates)
                .sort()
                .map(car => getTr(car))
                .join('')}
        </tbody>
        <tbody>
            
        </tbody>
    `;
}

function getLineChart(
    label: string,
    labels: string,
    chartData: string,
): string {
    return `
    const lineChartCtx = document.getElementById('lineChart').getContext('2d')
    const lineChart = new Chart(lineChartCtx, {
        type: 'line',
        data: {
            labels: [${labels}],
            datasets: [
                {
                    label: '${label}',
                    data: [${chartData}],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
            ],
        },
    })
    `;
}

function getBarChart(cars: string, barData: string, label: string): string {
    return `
    const barChartCtx = document.getElementById('barChart').getContext('2d')
    const barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: [${cars}],
            datasets: [
              {
                label: 'Cars',
                data: [${barData}],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgb(129, 230, 230)',
              }
            ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Average car load by ${label}'
            }
          }
        },
    })
    `;
}

function getChartWrapper(): string {
    return `
    <div class="row mt-4 justify-content-between">
        <div class="col-sm-6">
            <div class="card">
                <canvas id="lineChart"></canvas>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="card">
                <canvas id="barChart"></canvas>
            </div>
        </div>
    </div>
    `;
}
