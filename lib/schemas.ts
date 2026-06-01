import { z } from "zod";

const citySuggestionSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	structured_formatting: z.object({
		main_text: z.string().optional(),
		secondary_text: z.string(),
	}),
});

const citySuggestionsSchema = z.array(citySuggestionSchema);
export type CitySuggestion = z.infer<typeof citySuggestionSchema>;

const cityCuisineSchema = z.object({
	id: z.number().int(),
	name_it: z.string(),
	image_emoji: z.url(),
});
export type CityCuisine = z.infer<typeof cityCuisineSchema>;

const cityCuisineResponseSchema = z.object({
	length: z.number().int(),
	data: z.array(cityCuisineSchema),
});
export type CityCuisineResponse = z.infer<typeof cityCuisineResponseSchema>;

export { citySuggestionsSchema, cityCuisineResponseSchema };
