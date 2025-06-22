import React from 'react'
import { Card } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import { Clock, Users, Play, Edit, Trash2 } from 'lucide-react'
import type { TrainingModuleListItem, TrainingStatus } from '@shared/types/training'
import { cn } from '../utils/cn'

interface TrainingModuleCardProps {
  module: TrainingModuleListItem
  onStart?: (moduleId: string) => void
  onEdit?: (moduleId: string) => void
  onDelete?: (moduleId: string) => void
  showActions?: boolean
  className?: string
}

const statusConfig: Record<TrainingStatus, { variant: 'success' | 'warning' | 'default', label: string }> = {
  active: { variant: 'success', label: 'Active' },
  draft: { variant: 'warning', label: 'Draft' },
  archived: { variant: 'default', label: 'Archived' }
}

export const TrainingModuleCard: React.FC<TrainingModuleCardProps> = ({
  module,
  onStart,
  onEdit,
  onDelete,
  showActions = true,
  className
}) => {
  const statusInfo = statusConfig[module.status]

  return (
    <Card className={cn('p-6 hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-h3 font-medium text-charcoal">{module.title}</h3>
            <Badge variant={statusInfo.variant} className="text-xs">
              {statusInfo.label}
            </Badge>
          </div>
          {module.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {module.description}
            </p>
          )}
        </div>
      </div>

      {/* Module Metadata */}
      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
        <div className="flex items-center gap-4">
          {module.estimatedDuration && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {module.estimatedDuration} min
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {module.enrollmentCount ?? 0} enrolled
          </span>
        </div>
        {module.creator && (
          <span className="text-xs">
            by {module.creator.name}
          </span>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2">
          {module.status === 'active' && onStart && (
            <Button 
              size="sm" 
              onClick={() => onStart(module.id)}
              className="flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              Start Training
            </Button>
          )}
          
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(module.id)}
              className="flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(module.id)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          )}
        </div>
      )}
    </Card>
  )
} 
