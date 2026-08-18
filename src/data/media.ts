import { mediaUrl } from '../lib/media'

export type MediaAsset = { path: string; src?: string; posterPath?: string; poster?: string }

export const mediaManifest = {
  hero: {
    video: { path: 'hero/evolution.mp4', src: mediaUrl('hero/evolution.mp4') },
    poster: { path: 'hero/evolution-poster.webp', src: mediaUrl('hero/evolution-poster.webp') }
  },
  experiences: {
    home: { path: 'experiences/home/preview.mp4', src: mediaUrl('experiences/home/preview.mp4') },
    neon: { path: 'experiences/neon/preview.mp4', src: mediaUrl('experiences/neon/preview.mp4') },
    ultraLed: { path: 'experiences/ultra-led/preview.mp4', src: mediaUrl('experiences/ultra-led/preview.mp4') },
    decoration: { path: 'experiences/decoration/preview.mp4', src: mediaUrl('experiences/decoration/preview.mp4') }
  },
  technology: {
    ledFloor: { path: 'technology/led-floor.webp', src: mediaUrl('technology/led-floor.webp') },
    lighting: { path: 'technology/smart-lighting.webp', src: mediaUrl('technology/smart-lighting.webp') },
    liveInterface: { path: 'live/interface.webp', src: mediaUrl('live/interface.webp') }
  },
  events: {
    arellys10: { path: 'events/arellys-10/trailer.mp4', src: mediaUrl('events/arellys-10/trailer.mp4'), posterPath: 'events/arellys-10/cover.webp', poster: mediaUrl('events/arellys-10/cover.webp') }
  }
} as const
