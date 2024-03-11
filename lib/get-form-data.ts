import { dset } from "dset";

export function getFormData(formData: FormData): unknown {
	const data = {};

	for (const [key, value] of formData.entries()) {
		/** Internally used by server actions. */
		if (key.startsWith("$ACTION_")) continue;

		dset(data, key, value);
	}

	return data;
}
