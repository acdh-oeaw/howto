"use client";

import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { type ReactNode, useOptimistic, useState } from "react";
import { ListBox, ListBoxItem, type Selection } from "react-aria-components";
import { useFormState } from "react-dom";
import { z } from "zod";

import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Form } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { locales } from "@/config/i18n.config";
import type { Tag, WithId } from "@/lib/content/types";
import { getFormData } from "@/lib/get-form-data";
import { useRouter } from "@/lib/navigation";
import { cn } from "@/lib/styles";

const formSchema = z.object({
	locale: z.enum([...locales, "all"]).optional(),
	q: z.string().optional(),
	tag: z.array(z.string()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface CurriculaFilterFormProps {
	filters: FormSchema;
	localeItems: Array<{ id: string; label: string }>;
	localeLabel: string;
	searchTermLabel: string;
	submitLabel: string;
	tags: Array<WithId<Tag>>;
	tagsLabel: string;
}

export function CurriculaFilterForm(props: CurriculaFilterFormProps): ReactNode {
	const { filters, localeItems, localeLabel, searchTermLabel, submitLabel, tags, tagsLabel } =
		props;

	const router = useRouter();

	const [optimisticFilters, updateOptimisticFilters] = useOptimistic(
		filters,
		(_state, filters: FormSchema) => {
			return filters;
		},
	);

	function action(prevState: undefined, formData: FormData) {
		const input = getFormData(formData);
		const filters = formSchema.parse(input);

		updateOptimisticFilters(filters);
		router.push("?" + String(createUrlSearchParams(filters)));

		return undefined;
	}

	const [_formState, formAction] = useFormState(action, undefined);

	/** FIXME: `react-aria-components` `<ListBox>` cannot currently be used inside a form. */
	const [selectedTags, setSelectedTags] = useState<Selection>(() => {
		return new Set(optimisticFilters.tag);
	});

	return (
		<Form
			action={formAction}
			className="grid w-full items-end gap-x-4 gap-y-6 xs:grid-cols-[1fr_minmax(160px,auto)_auto]"
			role="search"
		>
			<TextInputField
				defaultValue={optimisticFilters.q}
				label={searchTermLabel}
				name="q"
				type="search"
			/>

			<SelectField defaultSelectedKey={optimisticFilters.locale} label={localeLabel} name="locale">
				{localeItems.map((item) => {
					return (
						<SelectItem key={item.id} id={item.id} textValue={item.label}>
							{item.label}
						</SelectItem>
					);
				})}
			</SelectField>

			<div className="my-2 grid xs:my-0 xs:block">
				<SubmitButton>{submitLabel}</SubmitButton>
			</div>

			<ListBox
				aria-label={tagsLabel}
				className="col-span-full flex flex-wrap gap-x-3 gap-y-2 text-xs font-medium"
				// defaultSelectedKeys={optimisticFilters.tag}
				onSelectionChange={setSelectedTags}
				orientation="horizontal"
				selectedKeys={selectedTags}
				selectionMode="multiple"
			>
				{tags.map((tag) => {
					return (
						<ListBoxItem
							key={tag.id}
							className={cn([
								"inline-flex cursor-default select-none rounded-full px-3 py-1 transition",
								"bg-neutral-100 text-neutral-700 hover:bg-neutral-100/90",
								"selected:bg-neutral-900 selected:text-neutral-0 selected:hover:bg-neutral-900/90",
								"dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700/90",
								"dark:selected:bg-neutral-0 dark:selected:text-neutral-950 dark:selected:hover:bg-neutral-0/90",
							])}
							id={tag.id}
							textValue={tag.name}
						>
							{tag.name}
						</ListBoxItem>
					);
				})}
			</ListBox>
			{Array.from(selectedTags).map((tag, index) => {
				return <input key={tag} name={`tag.${index}`} type="hidden" value={tag} />;
			})}
		</Form>
	);
}
