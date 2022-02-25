import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

import { DatabaseService } from './../db/database.service';
import {
    IAverageCarLoadByDayResponse,
    IResultAvgCar,
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

    async report(
        dt_from: Date = addDays(new Date(), -30),
        dt_to: Date = new Date(),
    ) {
        const data = await this.averageCarLoadByDay(dt_from, dt_to);
        const diff = Math.abs(differenceInDays(dt_from, dt_to));
        const result: IResultAvgCar[] = [];
        for (let i = 1; i <= diff; i++) {
            const date = i === 1 ? dt_from : addDays(dt_from, i - 1);
            result.push({
                id: i,
                date,
                data: data.filter(
                    el =>
                        isAfter(date, addDays(el.dt_from, -1)) &&
                        isBefore(date, addDays(el.dt_to, 1)),
                ),
            });
        }
        const toDay = format(new Date(), 'Pp');
        const header = `
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
        const footer = `
                </div>
            </body>
        </html>
        `;
        const ths = result
            .map(
                el =>
                    `<th scope="col">${format(el.date, 'ccc')} ${format(
                        el.date,
                        'dd',
                    )}</th>`,
            )
            .join('');
        const tbody = `
            <tbody>
                ${data
                    .sort((a, b) => (a.car > b.car ? 1 : -1))
                    .map(el => {
                        return `<tr>
                        <td>${el.car}</td>
                        ${result
                            .map(res =>
                                isAfter(res.date, addDays(el.dt_from, -1)) &&
                                isBefore(res.date, addDays(el.dt_to, 1)) &&
                                res.data.every(d => d.car === el.car)
                                    ? '<td>1</td>'
                                    : '<td>0</td>',
                            )
                            .join('')}
                    </tr>`;
                    })
                    .join('')}
            </tbody>
        `;
        const table = `
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
        const labels = result
            .map(el => `'${format(el.date, 'ccc')} ${format(el.date, 'dd')}'`)
            .join(',');
        const chartData = result.map(el => `${el.data.length}`).join(',');
        const label = `${format(dt_from, 'dd')} ${format(
            dt_from,
            'LLLL',
        )} - ${format(dt_to, 'dd')} ${format(dt_to, 'LLLL')}`;

        const cars = data
            .sort((a, b) => (a.car > b.car ? 1 : -1))
            .map(el => `'${el.car}'`);
        const barData = cars.map(car =>
            result.reduce(
                (a, b) =>
                    a + (b.data.map(el => `'${el.car}'`).includes(car) ? 1 : 0),
                0,
            ),
        );

        const chart = `
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
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
            const lineChartCtx = document.getElementById('lineChart').getContext('2d')
            const barChartCtx = document.getElementById('barChart').getContext('2d')
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
            const barChart = new Chart(barChartCtx, {
                type: 'bar',
                data: {
                    labels: [${cars.join(',')}],
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
        </script>
        `;
        return `
            ${header}
            ${table}
            ${chart}
            ${footer}
        `;
    }
}
