import { desc, eq } from 'drizzle-orm';
import db from '../../db/database';
import { productTable } from '../../db/models';
import { IAddProduct } from './dto/add-product.dto';

class ProductRepository {
  async findAll(limit = 10, skip = 0) {
    const products = await db
      .select()
      .from(productTable)
      .groupBy(productTable.id)
      .orderBy(desc(productTable.createdAt))
      .offset(Number(skip))
      .limit(Number(limit));
    return products;
  }

  async findById(id: number) {
    const products = await db.select().from(productTable).where(eq(productTable.id, id));
    return products[0];
  }

  async create(data: IAddProduct) {
    const newUser = await db.insert(productTable).values(data).returning();
    return newUser[0];
  }

  async update(id: number, data: Partial<IAddProduct>) {
    const updatedUser = await db.update(productTable).set(data).where(eq(productTable.id, id)).returning();
    return updatedUser[0];
  }

  async delete(id: number) {
    const deletedUser = await db.delete(productTable).where(eq(productTable.id, id)).returning();
    return deletedUser[0];
  }
  async deleteAll() {
    await db.delete(productTable);
  }
}

export default new ProductRepository();
