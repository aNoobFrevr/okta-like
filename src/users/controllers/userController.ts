import { Request, Response } from 'express';

export const getUsers = (_req: Request, res: Response) => {
  res.json([]);
};

export const createUser = (_req: Request, res: Response) => {
  res.status(201).json({});
};

export const getUserById = (_req: Request, res: Response) => {
  res.json({});
};

export const updateUser = (_req: Request, res: Response) => {
  res.json({});
};

export const deleteUser = (_req: Request, res: Response) => {
  res.status(204).send();
};
