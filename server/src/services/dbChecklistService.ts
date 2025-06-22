import { desc, eq } from 'drizzle-orm'
import { db, checklists } from '../db'
import type {
  ChecklistService,
  Checklist,
  CreateChecklistRequest,
  UpdateChecklistRequest
} from './ChecklistService'

export class DbChecklistService implements ChecklistService {
  async getChecklists(): Promise<Checklist[]> {
    const items = await db.select().from(checklists).orderBy(desc(checklists.createdAt))
    return items as unknown as Checklist[]
  }

  async getChecklist(id: string): Promise<Checklist | null> {
    const item = await db.select().from(checklists).where(eq(checklists.id, id)).limit(1)
    return (item[0] as unknown as Checklist) || null
  }

  async createChecklist(data: CreateChecklistRequest, createdBy?: string): Promise<Checklist> {
    const [result] = await db
      .insert(checklists)
      .values({ ...data, createdBy })
      .returning()
    return result as unknown as Checklist
  }

  async updateChecklist(id: string, data: UpdateChecklistRequest): Promise<Checklist | null> {
    const [result] = await db
      .update(checklists)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(checklists.id, id))
      .returning()
    return (result as unknown as Checklist) || null
  }

  async deleteChecklist(id: string): Promise<boolean> {
    const [result] = await db.delete(checklists).where(eq(checklists.id, id)).returning()
    return !!result
  }
}
