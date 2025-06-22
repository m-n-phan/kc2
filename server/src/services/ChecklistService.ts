export interface Checklist {
  id: string
  title: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'on_demand'
  locationId?: string | null
  isActive: boolean
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateChecklistRequest {
  title: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'on_demand'
  locationId?: string
  isActive?: boolean
}

export interface UpdateChecklistRequest extends Partial<CreateChecklistRequest> {}

export interface ChecklistService {
  getChecklists(): Promise<Checklist[]>
  getChecklist(id: string): Promise<Checklist | null>
  createChecklist(data: CreateChecklistRequest, createdBy?: string): Promise<Checklist>
  updateChecklist(id: string, data: UpdateChecklistRequest): Promise<Checklist | null>
  deleteChecklist(id: string): Promise<boolean>
}
