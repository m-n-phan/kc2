import React from 'react'
import { useParams } from 'react-router-dom'
import { useTrainingModule } from '../../hooks/useTrainingModules'
import { Card } from '../../components/Card'

export const TrainingModuleView: React.FC = () => {
  const { id = '' } = useParams()
  const { data: module } = useTrainingModule(id)

  if (!module) return <p className="p-8">Loading...</p>

  return (
    <div className="space-y-section p-8">
      <h1 className="text-h1 text-charcoal mb-4">{module.title}</h1>
      {module.description && <p className="text-slate-600 mb-4">{module.description}</p>}
      {module.content.sections?.map(sec => (
        <Card key={sec.title} className="p-4 space-y-2">
          <h3 className="text-h3">{sec.title}</h3>
          <p className="whitespace-pre-line text-slate-700">{sec.content}</p>
        </Card>
      ))}
    </div>
  )
}
