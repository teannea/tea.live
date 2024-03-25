import { useEffect, useState, useRef } from "react"
import clsx from "clsx"
import LiteYouTubeEmbed from "react-lite-youtube-embed"
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css"

function useElementHeight(elementRef) {
  const [height, setHeight] = useState(() =>
    elementRef.current ? elementRef.current.offsetHeight : 0
  )

  useEffect(() => {
    if (!elementRef.current) return
    const element = elementRef.current

    const updateHeight = (entries) => {
      for (const entry of entries) {
        // Assumes horizontal writing-mode:
        const height = entry.borderBoxSize[0]?.blockSize
        if (typeof height === "number") setHeight(height)
      }
    }

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(element, { box: "border-box" })
    return () => resizeObserver.unobserve(element)
  }, [elementRef, setHeight])

  return height
}

function useElementWidth(elementRef) {
  const [width, setWidth] = useState(() =>
    elementRef.current ? elementRef.current.offsetWidth : 0
  )

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    const updateWidth = (entries) => {
      for (const entry of entries) {
        // Assumes horizontal writing-mode:
        const width = entry.borderBoxSize[0]?.inlineSize
        if (typeof width === "number") setWidth(width)
      }
    }

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(element, { box: "border-box" })

    return () => resizeObserver.unobserve(element)
  }, [elementRef, setWidth])

  return width
}

function Stream({ stream }) {
  const playerRef = useRef(null)
  const videoContainerRef = useRef(null)
  const playerHeight = useElementHeight(videoContainerRef)
  console.log("hi", playerHeight)

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  }

  function playerReady(event) {
    console.log("we are ready")
  }

  const timestamps = [
    { time: "0:00", title: "Intro" },
    { time: "0:30", title: "First Section" },
    { time: "1:00", title: "Second Section" },
    { time: "1:30", title: "Third Section" },
    { time: "2:00", title: "Fourth Section" },
    { time: "2:30", title: "Fifth Section" },
    { time: "3:00", title: "在亲密关系中碰到对方monkey rush（猴急）怎么办？" },
    { time: "3:30", title: "Seventh Section" },
    { time: "4:00", title: "Eighth Section" },
    { time: "4:30", title: "Ninth Section" },
    { time: "5:00", title: "Tenth Section" },
    { time: "5:30", title: "Eleventh Section" },
    { time: "6:00", title: "Twelfth Section" },
    { time: "6:30", title: "Thirteenth Section" },
    { time: "7:00", title: "Fourteenth Section" },
    { time: "7:30", title: "Fifteenth Section" },
    { time: "8:00", title: "Sixteenth Section" },
    { time: "8:30", title: "Seventeenth Section" },
    { time: "9:00", title: "Eighteenth Section" },
    { time: "9:30", title: "Nineteenth Section" },
    { time: "10:00", title: "Twentieth Section" },
    { time: "10:30", title: "Twenty-First Section" },
    { time: "11:00", title: "Twenty-Second Section" },
    { time: "11:30", title: "Twenty-Third Section" },
  ]

  return (
    <div className="w-full h-screen flex flex-items-center">
      <div className="flex w-full">
        <div ref={videoContainerRef} className="flex-1">
          <LiteYouTubeEmbed
            id={stream.youtube_id}
            title={stream.title}
            ref={playerRef}
            poster="maxresdefault"
          />
        </div>
        <ol
          className="flex flex-col h-full w-xs overflow-y-scroll"
          style={{ height: playerHeight }}
        >
          {timestamps.map((timestamp) => (
            <li
              key={timestamp.title}
              className="flex border-solid b-t last:b-b border-pink py-1 hover:bg-pink-100 transition-200
                hover:cursor-pointer"
            >
              <div className="font-100 timestamp-portion text-right px-2">
                {timestamp.time}
              </div>
              <div className="description-portion">{timestamp.title}</div>
            </li>
          ))}
        </ol>
        {/* <pre>{JSON.stringify(stream, null, 2)}</pre> */}
      </div>
    </div>
  )
}

export default Stream
