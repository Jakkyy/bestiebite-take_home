import { describe, expect, it } from "vitest";

import { cityCuisineResponseSchema, citySuggestionsSchema } from "./schemas";

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

describe("citySuggestionsSchema", () => {
	it("parses a valid city suggestion", () => {
		const result = citySuggestionsSchema.parse([validSuggestion]);
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Milano");
	});

	it("accepts city names with unicode characters", () => {
		const result = citySuggestionsSchema.parse([
			{ ...validSuggestion, name: "Milanówek" },
		]);
		expect(result[0].name).toBe("Milanówek");
	});

	it("parses an empty array (no results)", () => {
		expect(citySuggestionsSchema.parse([])).toEqual([]);
	});

	it("treats main_text as optional", () => {
		const { main_text, ...rest } = validSuggestion.structured_formatting;
		void main_text;
		const result = citySuggestionsSchema.parse([
			{ ...validSuggestion, structured_formatting: rest },
		]);
		expect(result[0].structured_formatting.main_text).toBeUndefined();
		expect(result[0].structured_formatting.secondary_text).toBe(
			"Lombardia, Italia",
		);
	});

	it("strips unknown keys instead of failing", () => {
		const result = citySuggestionsSchema.parse([
			{ ...validSuggestion, unexpectedField: "ignored" },
		]);
		expect(result[0]).not.toHaveProperty("unexpectedField");
		expect(result[0].name).toBe("Milano");
	});

	it("rejects a non-integer id", () => {
		expect(() =>
			citySuggestionsSchema.parse([{ ...validSuggestion, id: 1.5 }]),
		).toThrow();
	});

	it("rejects a non-numeric latitude", () => {
		expect(() =>
			citySuggestionsSchema.parse([
				{ ...validSuggestion, latitude: "45.46" },
			]),
		).toThrow();
	});

	it("rejects a missing secondary_text", () => {
		expect(() =>
			citySuggestionsSchema.parse([
				{
					...validSuggestion,
					structured_formatting: { main_text: "Milano" },
				},
			]),
		).toThrow();
	});

	it("rejects a suggestion missing required fields", () => {
		expect(() =>
			citySuggestionsSchema.parse([{ id: 1, name: "X" }]),
		).toThrow();
	});
});

describe("cityCuisineResponseSchema", () => {
	it("parses a valid cuisine response", () => {
		const input = {
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
		const result = cityCuisineResponseSchema.parse(input);
		expect(result.data).toHaveLength(1);
		expect(result.data[0].name_it).toBe("Cinese");
	});

	it("rejects an invalid image_emoji (not a URL)", () => {
		const input = {
			length: 1,
			data: [{ id: 1, name_it: "Test", image_emoji: "not-a-url" }],
		};
		expect(() => cityCuisineResponseSchema.parse(input)).toThrow();
	});

	it("rejects a response missing the data array", () => {
		expect(() => cityCuisineResponseSchema.parse({ length: 0 })).toThrow();
	});
});
