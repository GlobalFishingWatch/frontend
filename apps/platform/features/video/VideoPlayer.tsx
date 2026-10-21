import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components/icon-button'

import LanguageToggle from 'features/i18n/LanguageToggle'

import styles from './VideoPlayer.module.css'

export type VideoSource = { src: string; poster?: string }

type VideoPlayerProps = {
  sources: Record<string, VideoSource>
  language?: string
  autoPlay?: boolean
  startMuted?: boolean
  className?: string
  onEnded?: () => void
}

function VideoPlayer({
  sources,
  language,
  autoPlay = false,
  startMuted = true,
  className,
  onEnded,
}: VideoPlayerProps) {
  const { t } = useTranslation()
  const languages = Object.keys(sources)
  const videoRef = useRef<HTMLVideoElement>(null)
  const resumeRef = useRef<{ time: number; playing: boolean } | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState(
    language && sources[language] ? language : languages[0]
  )
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(startMuted)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const source = sources[currentLanguage]

  useEffect(() => {
    const video = videoRef.current
    if (!autoPlay || !video) return
    video.play().catch(() => {
      video.muted = true
      setMuted(true)
      video.play()
    })
  }, [autoPlay])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }

  const changeLanguage = (lang: string) => {
    const video = videoRef.current
    resumeRef.current = video ? { time: video.currentTime, playing: !video.paused } : null
    setCurrentLanguage(lang)
  }

  return (
    <div className={cx(styles.player, className)}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        className={styles.video}
        muted={muted}
        playsInline
        preload="metadata"
        src={source.src}
        poster={source.poster}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onEnded}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime)
          setDuration(e.currentTarget.duration || 0)
        }}
        onLoadedMetadata={(e) => {
          const resume = resumeRef.current
          if (!resume) return
          resumeRef.current = null
          e.currentTarget.currentTime = resume.time
          if (resume.playing) e.currentTarget.play()
        }}
      />
      <div className={styles.controls}>
        <IconButton
          icon={playing ? 'pause' : 'play'}
          type="invert"
          tooltip={playing ? t((t) => t.videoPlayer.pause) : t((t) => t.videoPlayer.play)}
          onClick={togglePlay}
        />
        <input
          type="range"
          className={styles.progress}
          min={0}
          max={duration}
          step="any"
          value={currentTime}
          style={
            { '--progress': `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties
          }
          aria-label={t((t) => t.videoPlayer.progress)}
          onChange={(e) => {
            if (videoRef.current) videoRef.current.currentTime = Number(e.target.value)
          }}
        />
        <IconButton
          icon={muted ? 'sound-off' : 'sound-on'}
          type="invert"
          tooltip={muted ? t((t) => t.videoPlayer.unmute) : t((t) => t.videoPlayer.mute)}
          onClick={() => setMuted(!muted)}
        />
        {languages.length > 1 && (
          <LanguageToggle
            className={styles.language}
            position="rightUp"
            buttonType="invert"
            languages={languages}
            value={currentLanguage}
            onChange={changeLanguage}
          />
        )}
      </div>
    </div>
  )
}

export default VideoPlayer
