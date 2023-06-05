import Category from '@Models/categoryModel';
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
  bulkUpdate,
  deleteMany,
} from './handlerFactory';

export const getAllCategories = getAll(Category);
export const getCategory = getOne(Category);
export const createCategory = createOne(Category);
export const updateCategory = updateOne(Category);
export const bulkUpdateCategories = bulkUpdate(Category);
export const deleteCategory = deleteOne(Category);
export const deleteManyCategories = deleteMany(Category);
