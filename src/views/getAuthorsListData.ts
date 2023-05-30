import { type Person } from "@/cms/api/people.api";

export type AuthorsListItem = Pick<Person, "firstName" | "id" | "lastName">;

export type AuthorsListData = Array<AuthorsListItem>;

/**
 * Returns minimal data necessary for authors list view.
 */
export function getAuthorsListData(people: Array<Person>): AuthorsListData {
	return people.map((person) => {
		const authorData = {
			id: person.id,
			firstName: person.firstName,
			lastName: person.lastName,
		};
		return authorData;
	});
}
