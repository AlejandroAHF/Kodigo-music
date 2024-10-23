import { getTracks,getSpotifyToken } from "@/Services/Spotify.services";

export default async function Home() {

  /* //de esta manera podemos llamar a una funcion asincronica desde la pagina que nesecitamos
  const token = await getSpotifyToken();
  console.log(token); //Ahora puedes ver el token */

  const tracks = await getTracks();

  return (
    <>
      <div className="bg-black text-gray-300 min-h-screen p-10">
  
        {/* header */}
        <div className="flex">
          <div className="flex flex-col justify-center">
            {/* content */}
            <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">Playlist</h4>
            <h1 className="mt-0 mb-2 text-white text-4xl">Spotify Album</h1>
          </div>
        </div>
        
        {/* song list */}
        <div className="mt-10">
          {/* song list header */}
          <div className="flex text-gray-600">
            <div className="p-2 w-8 flex-shrink-0"></div>
            <div className="p-2 w-8 flex-shrink-0"></div>
            <div className="p-2 w-full">Title</div>
            <div className="p-2 w-full">Artist</div>
            <div className="p-2 w-12 flex-shrink-0 text-right">⏱</div>
          </div>
          
          {tracks?.map((track) => (
            <div key={track.id} className="flex border-b border-gray-800 hover:bg-gray-800">
              <div className="p-3 w-full">{track.name}</div>
              <div className="p-3 w-full">{track.artists.map((artist) => (artist.name))}</div>
              <div className="p-3 w-12 flex-shrink-0 text-right">{track.duration_ms}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
