import { assert } from "@acdh-oeaw/lib";
import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AppLink } from "@/components/app-link";
import { Link } from "@/components/link";
import { Card } from "@/components/ui/blocks/card";
import { reader } from "@/lib/content/reader";
import type { Curriculum, WithId } from "@/lib/content/types";
import { createHref } from "@/lib/create-href";

interface CurriculumCardProps {
	curriculum: WithId<Curriculum>;
}

// @ts-expect-error Upstream type issue.
export async function CurriculumCard(props: CurriculumCardProps): Promise<ReactNode> {
	const { curriculum } = props;

	const t = await getTranslations("CurriculumCard");
	const { dateTime, list } = await getFormatter();

	const href = createHref({ pathname: `/curricula/${curriculum.id}` });

	const editors = await Promise.all(
		curriculum.editors.map((id) => {
			return reader().collections.people.read(id);
		}),
	);

	const tags = await Promise.all(
		curriculum.tags.map((id) => {
			return reader().collections.tags.read(id);
		}),
	);

	return (
		<Card
			description={
				<dl className="grid leading-normal">
					{editors.length > 0 ? (
						<div className="inline">
							<dt className="inline">{t("edited-by")} </dt>
							<dd className="inline">
								{list(
									editors.map((editor) => {
										assert(editor, "Missing editor.");
										return [editor.firstName, editor.lastName].join(" ");
									}),
								)}
							</dd>
						</div>
					) : null}
					<div className="inline">
						<dt className="inline">{t("published-on")} </dt>
						<dd className="inline">
							{dateTime(new Date(curriculum.publicationDate), { dateStyle: "long" })}
						</dd>
					</div>
					<div className="inline">
						<dt className="inline">{t("tagged-with")} </dt>
						<dd className="inline">
							{list(
								tags.map((tag) => {
									assert(tag, "Missing tag.");
									return tag.name;
								}),
							)}
						</dd>
					</div>
				</dl>
			}
			title={<Link href={href}>{curriculum.title}</Link>}
		>
			<div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
				{curriculum.summary}
			</div>
			<div className="justify-self-end">
				<AppLink
					className="text-sm underline underline-offset-4 hover:no-underline focus-visible:no-underline"
					href={href}
				>
					{t("read-more")}
				</AppLink>
			</div>
		</Card>
	);
}
