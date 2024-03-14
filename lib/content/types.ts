import type { Entry } from "@keystatic/core/reader";

import type config from "@/keystatic.config";

export type Curriculum = Entry<(typeof config)["collections"]["curricula"]>;

export type DocumentationPage = Entry<(typeof config)["collections"]["documentation"]>;

// export type HomePage = Entry<(typeof config)["collections"]["homePage"]>;

export type License = Entry<(typeof config)["collections"]["licenses"]>;

export type Person = Entry<(typeof config)["collections"]["people"]>;

export type Resource = Entry<(typeof config)["collections"]["resources"]>;

export type Tag = Entry<(typeof config)["collections"]["tags"]>;

export type WithId<T> = T & { id: string };
