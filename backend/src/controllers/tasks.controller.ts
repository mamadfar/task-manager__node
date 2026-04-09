import { Request, Response } from "express";

import Task from "../models/task.js";
import { Op } from "@sequelize/core";

export default class TasksController {
  static async getTasks(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    const finished =
      req.query.finished?.toString().toLowerCase() === "true"
        ? true
        : req.query.finished?.toString().toLowerCase() === "false"
          ? false
          : undefined;
    const search = req.query.search ? String(req.query.search) : "";
    try {
      const filters: any = {
        title: {
          [Op.like]: `%${search}%`,
        },
      };
      if (finished !== undefined) {
        filters.completed = finished;
      }
      const { rows, count } = await Task.findAndCountAll({
        where: filters,
        limit,
        offset: (page - 1) * limit,
      });
      const allCount = await Task.count();
      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        body: rows,
        pagination: {
          page,
          limit,
          totalPages,
          totalTasks: {
            all: allCount,
            filtered: count,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  static async getTaskById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const task = await Task.findByPk(id);
      if (task) {
        res.json({
          success: true,
          body: task,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Not Found: Task with the specified ID was not found.",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  static async createTask(req: Request, res: Response) {
    //? Always check the required fields in the request body before processing the request
    if (req.body.title) {
      const title = req.body.title;
      const completed = !!req.body.completed;

      //   if (typeof title !== "string" || title.length < 3) {
      //     return res.status(400).json({
      //       success: false,
      //       message:
      //         "Invalid Request: Title must be a string with at least 3 characters.",
      //     });
      //   } else if (await Task.getTaskByTitle(title)) {
      //     return res.status(409).json({
      //       success: false,
      //       message:
      //         "Invalid Request: A task with the same title already exists.",
      //     });
      //   }

      try {
        const task = await Task.create({ title, completed });
        res.status(201).json({ success: true, body: task });
      } catch (error) {
        if ((error as any).errors?.length) {
          res.status(500).json({
            success: false,
            message: (error as any).errors[0].message,
          });
        }
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid Request: Title is required.",
      });
    }
  }

  static async updateTask(req: Request, res: Response) {
    if (req.body.title && req.body.completed !== undefined) {
      const { title, completed } = req.body;

      //   if (title.length < 3) {
      //     return res.status(400).json({
      //       success: false,
      //       message: "Invalid Request: Title must be at least 3 characters long.",
      //     });
      //   }

      //   let task = await Task.getTaskByTitle(title);
      //   if (task && task.id !== Number(req.params.id)) {
      //     return res.status(409).json({
      //       success: false,
      //       message:
      //         "Invalid Request: A task with the same title already exists.",
      //     });
      //   }

      const task = await Task.findByPk(Number(req.params.id));
      if (task) {
        try {
          // @ts-ignore
          task.title = title;
          // @ts-ignore
          task.completed = Boolean(completed);
          await task.save();
          res.json({ success: true, body: task });
        } catch (error) {
          if ((error as any).errors?.length) {
            res.status(500).json({
              success: false,
              message: (error as any).errors[0].message,
            });
          }
          res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "Not Found: Task with the specified ID was not found.",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message:
          "Invalid Request: Task title and completed status are required.",
      });
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      if (await Task.destroy({ where: { id: Number(req.params.id) } })) {
        res.json({ success: true });
      } else {
        res.status(404).json({
          success: false,
          message: "Not Found: Task with the specified ID was not found.",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
