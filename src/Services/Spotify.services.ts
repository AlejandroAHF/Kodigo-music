import { Itrack } from "@/Interfaces/Tracks.interface";

import type { NextApiRequest, NextApiResponse } from 'next';

let cachedToken: string | null = null;
let tokenExpirationTime: number | null = null; //Marca de tiempo de cuando expira el token

const client_id = '3cbf054faab94b56b8ab537cca3f8f49';
const client_secret = '425d0e97cb1e4647ba95052e57379a72';

export async function getSpotifyToken(): Promise<string | null> {
  // Comprueba si hay un token en caché válido
  const currentTime = Date.now();
  if (cachedToken && tokenExpirationTime && currentTime < tokenExpirationTime) {
    console.log('Using cached token');
    return cachedToken;
  }

  // Obtener un nuevo token si no existe ningún token válido
  const authOptions = new URLSearchParams();
  authOptions.append('grant_type', 'client_credentials');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: authOptions.toString(),
  });

  if (!response.ok) {
    console.error('Failed to fetch Spotify token:', response.statusText);
    return null;
  }

  const data = await response.json();
  cachedToken = data.access_token;
  
  // Set the expiration time (current time + expires_in from the response, which is in seconds)
  tokenExpirationTime = currentTime + data.expires_in * 1000;

  console.log('Fetched new token');
  return cachedToken;
}

export const getTracks = async() => {
  try {
    // Obtener el token de acceso
    const token = await getSpotifyToken();

    // Hacer la petición a la API de Spotify para obtener los álbumes
    const spotifyResponse = await fetch(`https://api.spotify.com/v1/tracks?ids=7ouMYWpwJ422jRcDASZB7P%2C4VqPOruhp5EdPBeR92t6lQ%2C2takcwOaAZWiXQijPHIx7B`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Incluir el token de autorización
        'Content-Type': 'application/json',
      },
    });

    // Parsear y retornar la respuesta JSON de Spotify
    const data:Itrack = await spotifyResponse.json();
    return data.tracks
  } catch (error) {
    console.error('Error fetching albums:', error);
  }
}
