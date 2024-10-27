'use client'
import { useEffect, useState } from 'react';
import { getTracks } from "@/Services/Spotify.services";

export default function Home() {
  const [tracks, setTracks] = useState([]);

  //obtenemos los datos de la api
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTracks();
      setTracks(data || []);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-black text-gray-300 min-h-screen p-10">
      {/* Header */}
      <div className="flex">
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">Playlist</h4>
          <h1 className="mt-0 mb-2 text-white text-4xl">Spotify Album</h1>
        </div>
      </div>

      {/* Song list */}
      <div className="mt-10">
        {/* Song list header */}
        <div className="flex text-gray-600">
          <div className="p-2 w-8 flex-shrink-0"></div>
          <div className="p-2 w-8 flex-shrink-0"></div>
          <div className="p-2 w-full">Title</div>
          <div className="p-2 w-full">Artist</div>
          <div className="p-2 w-12 flex-shrink-0 text-right">⏱</div>
        </div>

        {tracks.length > 0 ? (
          tracks.map((track) => (
            <div key={track.id} className="flex border-b border-gray-800 hover:bg-gray-800">
              <div className="p-3 w-full">{track.name}</div>
              <div className="p-3 w-full">{track.artists.map((artist) => artist.name).join(', ')}</div>
              <div className="p-3 w-12 flex-shrink-0 text-right">{(track.duration_ms / 60000).toFixed(2)} min</div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tracks available</p>
        )}
      </div>
    </div>
  );
}
