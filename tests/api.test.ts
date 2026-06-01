import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchCities, fetchCitiesCuisine } from "../lib/api";

const validSuggestion = {
	id: 8047,
	name: "Milano",
	latitude: 45.4612939,
	longitude: 9.172356290785304,
	structured_formatting: {
		main_text: "Milano",
		secondary_text: "Lombardia, Italia",
	},
};

const validCuisineResponse = {
	length: 1,
	data: [
		{
			id: 52,
			name_it: "Cinese",
			image_emoji:
				"https://firebasestorage.googleapis.com/v0/b/test.appspot.com/o/cucina_cinese.png",
		},
	],
};

function mockFetch(payload: unknown, ok = true) {
	const fetchMock = vi.fn().mockResolvedValue({
		ok,
		json: async () => payload,
	} as Response);
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
}

beforeEach(() => {
	vi.restoreAllMocks();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("fetchCities", () => {
	it("returns the parsed suggestions on success", async () => {
		mockFetch([validSuggestion]);
		const result = await fetchCities("milano");
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Milano");
	});

	it("URL-encodes the search term", async () => {
		const fetchMock = mockFetch([]);
		await fetchCities("san donà");
		const calledUrl = fetchMock.mock.calls[0][0] as string;
		expect(calledUrl).toContain("term=san%20don%C3%A0");
	});

	it("forwards the abort signal to fetch", async () => {
		const fetchMock = mockFetch([]);
		const controller = new AbortController();
		await fetchCities("milano", controller.signal);
		expect(fetchMock.mock.calls[0][1]).toMatchObject({
			signal: controller.signal,
		});
	});

	it("throws when the response is not ok", async () => {
		mockFetch(null, false);
		await expect(fetchCities("milano")).rejects.toThrow(
			"Impossibile caricare i suggerimenti città",
		);
	});

	it("throws when the payload does not match the schema", async () => {
		mockFetch([{ id: 1, name: "X" }]);
		await expect(fetchCities("milano")).rejects.toThrow();
	});
});

describe("fetchCitiesCuisine", () => {
	it("returns the parsed cuisine response on success", async () => {
		mockFetch(validCuisineResponse);
		const result = await fetchCitiesCuisine(45.46, 9.19);
		expect(result.data).toHaveLength(1);
		expect(result.data[0].name_it).toBe("Cinese");
	});

	it("includes lat and lng in the request URL", async () => {
		const fetchMock = mockFetch(validCuisineResponse);
		await fetchCitiesCuisine(45.46, 9.19);
		const calledUrl = fetchMock.mock.calls[0][0] as string;
		expect(calledUrl).toContain("lat=45.46");
		expect(calledUrl).toContain("lng=9.19");
	});

	it("throws when the response is not ok", async () => {
		mockFetch(null, false);
		await expect(fetchCitiesCuisine(45.46, 9.19)).rejects.toThrow(
			"Impossibile caricare le cucine",
		);
	});
});
