import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, integer, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['Manager', 'Supervisor', 'Staff'])
export const trainingStatusEnum = pgEnum('training_status', ['draft', 'active', 'archived'])
export const assignmentStatusEnum = pgEnum('assignment_status', ['pending', 'in_progress', 'completed', 'overdue'])
export const checklistFrequencyEnum = pgEnum('checklist_frequency', ['daily', 'weekly', 'monthly', 'on_demand'])

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  locationId: uuid('location_id').references(() => locations.id),
  passwordHash: text('password_hash').notNull(),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Locations table
export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Training modules table
export const trainingModules = pgTable('training_modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  content: jsonb('content').notNull(), // Rich content structure
  estimatedDuration: integer('estimated_duration'), // minutes
  version: integer('version').default(1),
  status: trainingStatusEnum('status').default('draft'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Training assignments table
export const trainingAssignments = pgTable('training_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id').references(() => trainingModules.id).notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id).notNull(),
  assignedBy: uuid('assigned_by').references(() => users.id).notNull(),
  status: assignmentStatusEnum('status').default('pending'),
  dueDate: timestamp('due_date'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  score: integer('score'), // percentage 0-100
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Checklists table
export const checklists = pgTable('checklists', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  frequency: checklistFrequencyEnum('frequency').notNull(),
  locationId: uuid('location_id').references(() => locations.id),
  isActive: boolean('is_active').default(true),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Checklist items table
export const checklistItems = pgTable('checklist_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  checklistId: uuid('checklist_id').references(() => checklists.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull(),
  isRequired: boolean('is_required').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Task runs table (checklist executions)
export const taskRuns = pgTable('task_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  checklistId: uuid('checklist_id').references(() => checklists.id).notNull(),
  completedBy: uuid('completed_by').references(() => users.id).notNull(),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  status: assignmentStatusEnum('status').default('in_progress'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Task run items table (individual checklist item completions)
export const taskRunItems = pgTable('task_run_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskRunId: uuid('task_run_id').references(() => taskRuns.id).notNull(),
  checklistItemId: uuid('checklist_item_id').references(() => checklistItems.id).notNull(),
  isCompleted: boolean('is_completed').default(false),
  notes: text('notes'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Corrective actions table
export const correctiveActions = pgTable('corrective_actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskRunItemId: uuid('task_run_item_id').references(() => taskRunItems.id).notNull(),
  description: text('description').notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id),
  dueDate: timestamp('due_date'),
  status: assignmentStatusEnum('status').default('pending'),
  completedAt: timestamp('completed_at'),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Activity feed table
export const activityFeed = pgTable('activity_feed', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow()
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  location: one(locations, {
    fields: [users.locationId],
    references: [locations.id]
  }),
  trainingAssignments: many(trainingAssignments),
  createdModules: many(trainingModules),
  completedTaskRuns: many(taskRuns),
  activityFeed: many(activityFeed)
}))

export const locationsRelations = relations(locations, ({ many }) => ({
  users: many(users),
  checklists: many(checklists)
}))

export const trainingModulesRelations = relations(trainingModules, ({ one, many }) => ({
  creator: one(users, {
    fields: [trainingModules.createdBy],
    references: [users.id]
  }),
  assignments: many(trainingAssignments)
}))

export const trainingAssignmentsRelations = relations(trainingAssignments, ({ one }) => ({
  module: one(trainingModules, {
    fields: [trainingAssignments.moduleId],
    references: [trainingModules.id]
  }),
  assignee: one(users, {
    fields: [trainingAssignments.assignedTo],
    references: [users.id]
  }),
  assigner: one(users, {
    fields: [trainingAssignments.assignedBy],
    references: [users.id]
  })
}))

export const checklistsRelations = relations(checklists, ({ one, many }) => ({
  location: one(locations, {
    fields: [checklists.locationId],
    references: [locations.id]
  }),
  creator: one(users, {
    fields: [checklists.createdBy],
    references: [users.id]
  }),
  items: many(checklistItems),
  taskRuns: many(taskRuns)
}))

export const checklistItemsRelations = relations(checklistItems, ({ one, many }) => ({
  checklist: one(checklists, {
    fields: [checklistItems.checklistId],
    references: [checklists.id]
  }),
  taskRunItems: many(taskRunItems)
}))

export const taskRunsRelations = relations(taskRuns, ({ one, many }) => ({
  checklist: one(checklists, {
    fields: [taskRuns.checklistId],
    references: [checklists.id]
  }),
  completedBy: one(users, {
    fields: [taskRuns.completedBy],
    references: [users.id]
  }),
  items: many(taskRunItems)
}))

export const taskRunItemsRelations = relations(taskRunItems, ({ one, many }) => ({
  taskRun: one(taskRuns, {
    fields: [taskRunItems.taskRunId],
    references: [taskRuns.id]
  }),
  checklistItem: one(checklistItems, {
    fields: [taskRunItems.checklistItemId],
    references: [checklistItems.id]
  }),
  correctiveActions: many(correctiveActions)
}))

export const correctiveActionsRelations = relations(correctiveActions, ({ one }) => ({
  taskRunItem: one(taskRunItems, {
    fields: [correctiveActions.taskRunItemId],
    references: [taskRunItems.id]
  }),
  assignedTo: one(users, {
    fields: [correctiveActions.assignedTo],
    references: [users.id]
  }),
  createdBy: one(users, {
    fields: [correctiveActions.createdBy],
    references: [users.id]
  })
}))

export const activityFeedRelations = relations(activityFeed, ({ one }) => ({
  user: one(users, {
    fields: [activityFeed.userId],
    references: [users.id]
  })
})) 
