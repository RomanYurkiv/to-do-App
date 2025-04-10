import express, { Request, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { createTodoList, getTodoLists, getTodoListById, addCollaborator, addTaskToList, updateTask, deleteTask, updateTaskStatus } from '../controllers/todoList.controller';

const router = express.Router();

router.post('/', authenticateToken, createTodoList as express.RequestHandler);
router.get('/', authenticateToken, getTodoLists as express.RequestHandler);
router.get('/:id', authenticateToken, getTodoListById as express.RequestHandler);
router.post('/:listId/tasks', authenticateToken, addTaskToList as express.RequestHandler);
router.put('/:listId/tasks/:taskId', authenticateToken, updateTask as express.RequestHandler);
router.delete('/:listId/tasks/:taskId', authenticateToken, deleteTask as express.RequestHandler);
router.put('/:listId/tasks/:taskId/status', authenticateToken, updateTaskStatus as express.RequestHandler);
router.post('/:listId/collaborators', authenticateToken, addCollaborator as express.RequestHandler);

export default router;