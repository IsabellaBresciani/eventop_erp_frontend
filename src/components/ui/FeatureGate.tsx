import { ReactNode } from 'react'
import { FeatureFlag, useFeatureConfig } from '../../hooks/useFeatureConfig'

interface FeatureGateProps {
  name: FeatureFlag
  children: ReactNode
  fallback?: ReactNode
}

export function FeatureGate({ name, children, fallback = null }: FeatureGateProps) {
  const isEnabled = useFeatureConfig(name)

  if (!isEnabled) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
