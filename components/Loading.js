// import { Circle } from 'better-react-spinkit'

import Image from "next/image"


function Loading() {
  return (
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div className="flex flex-col justify-center items-center gap-12 text-gray-600">

        <Image
          src='/messenger.png'
          alt="logo"
          width={150}
          height={150}
          style={{ marginBottom: 20 }}
        />
        Loading...
      </div>
    </center>
  )
}

export default Loading