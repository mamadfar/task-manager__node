/* As a convention, it's better to import modules in this order: built-in, third-party, local */
import conn from "../db/index.js";
import type { RowDataPacket } from "mysql2/promise";

import { ITask } from "../types/task.type.js";

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
      conditions += ` and completed = ${finished}`;
    }

    const start = (page - 1) * limit;
    let query = `select * from tasks where ${conditions} limit ${start}, ${limit}`;
    const [tasks] = (await conn.query<RowDataPacket[]>(
      query,
    )) as unknown as ITask[];

    query = `select count(*) as total from tasks
                union all
                select count(*) from tasks where ${conditions}`;

    let [totals] = (await conn.query<RowDataPacket[]>(query)) as unknown as {
      total: number;
    }[][];

    return {
      tasks,
      totalTasks: {
        all: totals[0].total,
        filtered: totals[1].total,
      },
    };
  }

  static async getTaskById(id: number) {
    const [results] = await conn.query<RowDataPacket[]>(
      `select * from tasks where id = ?`,
      [id],
    );

    return results.length ? (results[0] as ITask) : false;
  }

  static async getTaskByTitle(title: string) {
    const [results] = await conn.query<RowDataPacket[]>(
      `select * from tasks where title = ?`,
      [title],
    );

    return results.length ? (results[0] as ITask) : false;
  }

  static async addTask(title: string, completed: boolean) {
    const [result] = await conn.query(
      `insert into tasks(title, completed) values(?, ?)`,
      [title, completed],
    );

    if ("insertId" in result) {
      return {
        id: result.insertId,
        title,
        completed,
      };
    } else {
      return false;
    }
  }

  static async updateTask(id: number, title: string, completed: boolean) {
    await conn.query(
      `update tasks set title = ?, completed = ? where id = ?`,
      [title, completed, id],
    );
    return true;
  }

  static async deleteTask(id: number) {
    const [result] = await conn.query(`delete from tasks where id = ?`, [id]);
    if ("affectedRows" in result) {
      return result.affectedRows > 0;
    } else {
      return false;
    }
  }
}
