import { citySuggestionsSchema, cityCuisineResponseSchema } from "./schemas";
import { CitySuggestion, CityCuisineResponse } from "./schemas";

export async function fetchCities(
	term = "",
	signal?: AbortSignal,
): Promise<CitySuggestion[]> {
	const response = await fetch(
		`https://api.bestiebite.com/places/v2/autocomplete?term=${encodeURIComponent(
			term,
		)}&lang=it&limit=4`,
		{ signal },
	);

	if (!response.ok) {
		throw new Error("Impossibile caricare i suggerimenti città");
	}

	const payload = await response.json();
	return citySuggestionsSchema.parse(payload);
}

export async function fetchCitiesCuisine(
	latitude: number,
	longitude: number,
	signal?: AbortSignal,
): Promise<CityCuisineResponse> {
	const response = await fetch(
		`https://api.bestiebite.com/places/labels/by-location-and-type?lat=${latitude}&lng=${longitude}&type=cuisine`,
		{ signal },
	);

	if (!response.ok) {
		throw new Error("Impossibile caricare le cucine");
	}

	const payload = await response.json();
	return cityCuisineResponseSchema.parse(payload);
}
