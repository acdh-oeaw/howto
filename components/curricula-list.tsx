import type { ReactNode } from "react";

import { CurriculumCard } from "@/components/curriculum-card";
import type { Curriculum, WithId } from "@/lib/content/types";

interface CurriculaListProps {
	curricula: Array<WithId<Curriculum>>;
}

export function CurriculaList(props: CurriculaListProps): ReactNode {
	const { curricula } = props;

	return (
		<ul className="grid w-full gap-y-8" role="list">
			{curricula.map((curriculum) => {
				return (
					<li key={curriculum.id}>
						<CurriculumCard curriculum={curriculum} />
					</li>
				);
			})}
		</ul>
	);
}
