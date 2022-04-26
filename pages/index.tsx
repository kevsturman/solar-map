import type { NextPage } from 'next'
import { useLoadScript } from '@react-google-maps/api'
import Map from '../components/map'
const Home: NextPage = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  })
  if (!isLoaded) {
    return <div>Loading...</div>
  }
  return (
    <div >
      <Map />
    </div>
  )
}

export default Home
