"use client";

import { AlertCircleIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useFormState } from "react-dom";

import { useQuizContext } from "@/components/content/quiz";
import { Button } from "@/components/ui/button";

export interface QuizFormState {
	status: "correct" | "incorrect";
}

export interface QuizFormProps {
	children: ReactNode;
	errorMessages: Array<ReactNode>;
	nextButtonLabel: string;
	previousButtonLabel: string;
	successMessages: Array<ReactNode>;
	validate: (formState: QuizFormState | undefined, formData: FormData) => Promise<QuizFormState>;
	validateButtonLabel: string;
}

export function QuizForm(props: QuizFormProps) {
	const {
		children,
		errorMessages,
		nextButtonLabel,
		previousButtonLabel,
		successMessages,
		validate,
		validateButtonLabel,
	} = props;

	const { isCurrent, navigation } = useQuizContext();
	const [formState, formAction] = useFormState(validate, undefined);

	return (
		<section
			className="my-4 grid gap-y-4 rounded-md border border-neutral-950/10 bg-neutral-50 px-4 py-6 text-sm leading-relaxed text-neutral-950 shadow dark:border-neutral-0/10 dark:bg-neutral-800 dark:text-neutral-0"
			hidden={!isCurrent}
		>
			<form action={formAction}>
				{children}

				<footer>
					<div className="flex items-center justify-between gap-x-4">
						<Button variant="plain">
							<ChevronLeftIcon aria-hidden={true} className="size-4 shrink-0" />
							<span>{previousButtonLabel}</span>
						</Button>

						<Button type="submit" variant="plain">
							<span>{validateButtonLabel}</span>
						</Button>

						<Button isDisabled={!navigation.hasNext} onPress={navigation.next} variant="plain">
							<span>{nextButtonLabel}</span>
							<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0" />
						</Button>
					</div>

					<div
						aria-live="polite"
						className={
							formState == null
								? "sr-only"
								: formState.status === "correct"
									? "text-positive-600 dark:text-positive-400"
									: "text-negative-600 dark:text-negative-400"
						}
					>
						{formState?.status === "correct" ? (
							<div className="flex items-center gap-x-2">
								<CheckIcon aria-hidden={true} className="size-4 shrink-0" /> {successMessages}
							</div>
						) : formState?.status === "incorrect" ? (
							<div className="flex items-center gap-x-2">
								<AlertCircleIcon aria-hidden={true} className="size-4 shrink-0" />
								{errorMessages}
							</div>
						) : null}
					</div>
				</footer>
			</form>
		</section>
	);
}
