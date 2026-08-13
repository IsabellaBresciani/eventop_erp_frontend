import featureConfig from '../config/featureConfig.json'

export type FeatureFlag = keyof typeof featureConfig

export function useFeatureConfig(feature: FeatureFlag): boolean {
  return featureConfig[feature] === true
}
