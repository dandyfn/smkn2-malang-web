// lib/googleReviews.ts
// Hanya dipanggil dari server (server component / route handler).

export type GoogleReview = {
  name?: string;
  rating: number;
  relativePublishTimeDescription?: string;
  text?: { text: string; languageCode?: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

export type GooglePlaceData = {
  displayName?: { text: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: GoogleReview[];
};

export async function getGoogleReviews(): Promise<GooglePlaceData | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  console.log("[ulasan] key ada:", !!key, "| placeId ada:", !!placeId);
  if (!key || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=id`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask":
            "displayName,rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: 3600 }, // cache 1 jam
      }
    );
  console.log("[ulasan] status dari Google:", res.status);
    if (!res.ok) {
      console.error("Places API error:", res.status, await res.text());
      return null;
    }
    return (await res.json()) as GooglePlaceData;
  } catch (err) {
    console.error("Places API gagal dipanggil:", err);
    return null;
  }
}