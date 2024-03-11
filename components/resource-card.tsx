import { assert } from "@acdh-oeaw/lib";
import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AppLink } from "@/components/app-link";
import { Link } from "@/components/link";
import { Card } from "@/components/ui/blocks/card";
import { reader } from "@/lib/content/reader";
import type { Resource, WithId } from "@/lib/content/types";
import { createHref } from "@/lib/create-href";

interface ResourceCardProps {
	resource: WithId<Resource>;
}

// @ts-expect-error Upstream type issue.
export async function ResourceCard(props: ResourceCardProps): Promise<ReactNode> {
	const { resource } = props;

	const t = await getTranslations("ResourceCard");
	const { dateTime, list } = await getFormatter();

	const href = createHref({ pathname: `/resources/${resource.id}` });

	const authors = await Promise.all(
		resource.authors.map((id) => {
			return reader().collections.people.read(id);
		}),
	);

	const tags = await Promise.all(
		resource.tags.map((id) => {
			return reader().collections.tags.read(id);
		}),
	);

	return (
		<Card
			description={
				<dl className="grid leading-normal">
					<div className="inline">
						<dt className="inline">{t("written-by")} </dt>
						<dd className="inline">
							{list(
								authors.map((author) => {
									assert(author, "Missing author.");
									return [author.firstName, author.lastName].join(" ");
								}),
							)}
						</dd>
					</div>
					<div className="inline">
						<dt className="inline">{t("published-on")} </dt>
						<dd className="inline">
							{dateTime(new Date(resource.publicationDate), { dateStyle: "long" })}
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
			title={<Link href={href}>{resource.title}</Link>}
		>
			<div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
				{resource.summary}
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
