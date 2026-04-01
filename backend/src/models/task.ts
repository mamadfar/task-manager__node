/* As a convention, it's better to import modules in this order: built-in, third-party, local */
import conn from '../db/index.js'

import { ITask } from '../types/task.type.js';

interface IGetTasksOptions {
    page: number;
    limit: number;
    finished?: boolean;
    search?: string;
}

export default class Task {
    static async getTasks({ page, limit, finished, search }: IGetTasksOptions) {
        let conditions = `title like '%${search}%'`;
        if (finished !== undefined) {
            conditions += ` and completed = ${finished}`
        }

        const start = (page - 1) * limit;
        let query = `select * from tasks where ${conditions} limit ${start}, ${limit}`;
        const [tasks] = await conn.query(query) as unknown as [ITask[], any];

        query = `select count(*) as total from tasks
                union all
                select count(*) from tasks where ${conditions}`;

        let [totals] = await conn.query(query) as unknown as [ { total: number }[], any ];

        return {
            tasks,
            totalTasks: {
                all: totals[0].total,
                filtered: totals[1].total,
            }
        }
    }

    static getTaskById(id: number) {
        return true
    }

    static getTaskByTitle(title: string) {
        return true
    }
}