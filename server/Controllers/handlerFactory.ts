import { NextFunction, Request, Response } from 'express';
import { Model, Query } from 'mongoose';
import catchAsync from '@Utils/catchAsync';
import AppError from '@Utils/AppError';
import APIFeatures from '@Utils/ApiFeatures';
import removeImage from '@Utils/removeImage';

export const createOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    const doc = await Model.create(req.body);

    return res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

export const getAll = <T>(Model: Model<T>, populateOptions?: object) =>
  catchAsync(async (req: Request, res: Response) => {
    // To allow for nested GET links of department (hack)
    let filter = {};
    if (req.params.linkId) filter = { link: req.params.linkId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (populateOptions)
      features.query = features.query.populate(populateOptions);

    const doc = await features.query;

    // SEND RESPONSE
    return res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

export const getOne = <T>(
  Model: Model<T>,
  populateOptions?: { path: string; select?: string | undefined }
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: Query<any, T> = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) return next(new AppError('No document found with that ID', 404));

    return res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const updateOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    delete req.body._id;
    delete req.body.id;

    const document = (await Model.findById(req.params.id)) as T;
    if (!document) {
      return next(new AppError('לא נמצאה רשומה', 404));
    }
    const oldImage = document[req.body.imageFieldName as keyof T] as string;
    const nameFolder = req.baseUrl.slice(req.baseUrl.lastIndexOf('/') + 1);

    if (
      req.body[req.body.imageFieldName] &&
      oldImage !== req.body[req.body.imageFieldName]
    )
      removeImage(oldImage, nameFolder);

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const bulkUpdate = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    const queries = [];

    for (let i = 0; i < req.body.length; i++) {
      const row = { ...req.body[i] };
      delete row.id;

      queries.push(
        Model.findByIdAndUpdate(req.body[i].id, row, {
          new: true,
          runValidators: true,
        })
      );
    }
    const docs = await Promise.all(queries);

    return res.status(200).json({
      status: 'success',
      data: docs,
    });
  });

export const deleteOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const oldImage = (doc as any)[req.body.imageFieldName];
    const nameFolder = req.baseUrl.slice(req.baseUrl.lastIndexOf('/') + 1);

    removeImage(oldImage, nameFolder);

    return res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const deleteMany = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const docs = await Model.deleteMany();
    if (!docs) {
      return next(new AppError('No documents found, Nothing to Delete', 404));
    }

    return res.status(204).json({
      status: 'success',
      data: null,
    });
  });
