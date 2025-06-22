import type { ChecklistRunService, CompleteChecklistRunRequest } from './ChecklistRunService'

export class MockChecklistRunService implements ChecklistRunService {
  async startRun(_checklistId: string, _userId: string) {
    return { success: true, message: 'Checklist run started' }
  }

  async completeRun(_id: string, _userId: string, _data: CompleteChecklistRunRequest) {
    return { success: true, message: 'Checklist run completed' }
  }
}
