import { Request, Response } from 'express';
import { User } from '../models/User';
import { TodoList } from '../models/TodoList';
import { ListUser } from '../models/ListUser';
import { Task } from '../models/Task';

export const createTodoList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: 'User not authenticated' });
      return;
    }

    const newTodoList = await TodoList.create({
      title,
      ownerId: userId,
    });

    await ListUser.create({
      userId,
      todoListId: newTodoList.id,
      role: 'Admin',
    });

    res.status(201).json({
      message: 'List created',
      list: newTodoList,
    });
  } catch (err) {
    console.error('Error creating todo list:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getTodoLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: 'User not authenticated' });
      return;
    }

    const todoLists = await TodoList.findAll({
      where: { ownerId: userId },
    });

    res.status(200).json({ todoLists });
  } catch (err) {
    console.error('Error fetching todo lists:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const addTaskToList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: 'User not authenticated' });
      return;
    }

    const todoList = await TodoList.findByPk(listId);
    if (!todoList) {
      res.status(404).json({ message: 'Todo list not found' });
      return;
    }

    const task = await Task.create({
      title,
      description,
      status,
      todoListId: todoList.id,
    });

    res.status(201).json({
      message: 'Task added successfully',
      task,
    });
  } catch (err) {
    console.error('Error adding task to list:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, taskId } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOne({
      where: { id: taskId, todoListId: listId },
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    task.title = title;
    task.description = description;
    task.status = status;
    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, taskId } = req.params;

    const task = await Task.findOne({
      where: { id: taskId, todoListId: listId },
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await task.destroy();

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, taskId } = req.params;
    const { status } = req.body;

    if (!['completed', 'pending'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const task = await Task.findOne({
      where: { id: taskId, todoListId: listId },
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      message: 'Task status updated successfully',
      task,
    });
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const addCollaborator = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const { email, role } = req.body;

    if (!['Admin', 'Viewer'].includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const existingCollaborator = await ListUser.findOne({
      where: { userId: user.id, todoListId: listId },
    });

    if (existingCollaborator) {
      res.status(400).json({ message: 'User already a collaborator' });
      return;
    }

    await ListUser.create({
      userId: user.id,
      todoListId: listId,
      role,
    });

    res.status(200).json({
      message: 'Collaborator added successfully',
    });
  } catch (err) {
    console.error('Error adding collaborator:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getTodoListById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const todoList = await TodoList.findByPk(id, {
      include: ['tasks'],
    });

    if (!todoList) {
      res.status(404).json({ message: 'Todo list not found' });
      return;
    }

    res.status(200).json(todoList);
  } catch (err) {
    console.error('Error fetching todo list:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

