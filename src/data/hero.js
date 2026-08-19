/* Hero composition — background plus the floating cards over it. */
import { local } from './images'

export const HERO_IMG = local('player.jpg') // athlete on court

// Floating cards around the hero composition
export const HERO_CARDS = {
  coach: {
    name: 'Davis Korsgaard',
    role: 'Head coach & wellness lead',
    avatar: local('player.jpg'),
  },
  // three small avatars — people in motion reads better than empty courts
  members: [local('runners.jpg'), local('cycling.jpg'), local('swim.jpg')],
}
