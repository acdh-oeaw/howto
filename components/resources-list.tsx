import type { ReactNode } from "react";

import { ResourceCard } from "@/components/resource-card";
import type { Resource, WithId } from "@/lib/content/types";

interface ResourcesListProps {
	resources: Array<WithId<Resource>>;
}

export function ResourcesList(props: ResourcesListProps): ReactNode {
	const { resources } = props;

	return (
		<ul className="grid w-full gap-y-8" role="list">
			{resources.map((resource) => {
				return (
					<li key={resource.id}>
						<ResourceCard resource={resource} />
					</li>
				);
			})}
		</ul>
	);
}
