import { and, eq } from 'drizzle-orm'
import { db, taskRuns, taskRunItems, checklistItems } from '../db'
import type { ChecklistRunService, ChecklistRun, CompleteChecklistRunRequest } from './ChecklistRunService'

export class DbChecklistRunService implements ChecklistRunService {
  async startRun(checklistId: string, userId: string): Promise<ChecklistRun> {
    const [run] = await db
      .insert(taskRuns)
      .values({ checklistId, completedBy: userId })
      .returning()

    const items = await db
      .select({ id: checklistItems.id })
      .from(checklistItems)
      .where(eq(checklistItems.checklistId, checklistId))

    if (items.length) {
      await db.insert(taskRunItems).values(
        items.map(i => ({ taskRunId: run.id, checklistItemId: i.id }))
      )
    }

    return run as unknown as ChecklistRun
  }

  async completeRun(id: string, userId: string, data: CompleteChecklistRunRequest): Promise<ChecklistRun> {
    const [run] = await db
      .update(taskRuns)
      .set({
        status: 'completed',
        notes: data.notes,
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(eq(taskRuns.id, id), eq(taskRuns.completedBy, userId)))
      .returning()

    if (!run) {
      throw new Error('Checklist run not found')
    }

    if (data.items && data.items.length) {
      for (const item of data.items) {
        await db
          .update(taskRunItems)
          .set({
            isCompleted: item.isCompleted ?? true,
            notes: item.notes,
            completedAt: new Date(),
            updatedAt: new Date()
          })
          .where(and(eq(taskRunItems.id, item.id), eq(taskRunItems.taskRunId, id)))
      }
    }

    return run as unknown as ChecklistRun
  }
}
