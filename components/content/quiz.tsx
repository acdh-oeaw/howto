"use client";

import { assert } from "@acdh-oeaw/lib";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { createContext, type ReactNode, useContext, useState } from "react";
import { Button, type ButtonProps } from "react-aria-components";
import { useFormState } from "react-dom";

import { getChildrenElements } from "@/lib/get-children-elements";
import { getFormData } from "@/lib/get-form-data";

interface QuizProps {
	children: ReactNode;
}

export function Quiz(props: QuizProps): ReactNode {
	const { children } = props;

	/** Note that we actually get back children wrapped with `React.lazy`. */
	const quizzes = getChildrenElements(children);

	const [currentIndex, setCurrentIndex] = useState(0);

	const value: Omit<QuizContextValue, "isCurrent"> = {
		labels: {
			next: "Next",
			previous: "Previous",
			validate: "Check answer",
		},
		navigation: {
			hasNext: currentIndex < quizzes.length - 1,
			hasPrevious: currentIndex > 0,
			next() {
				setCurrentIndex((currentIndex) => {
					return currentIndex + 1;
				});
			},
			previous() {
				setCurrentIndex((currentIndex) => {
					return currentIndex - 1;
				});
			},
		},
	};

	return (
		<aside>
			{quizzes.map((quiz, index) => {
				const isCurrent = index === currentIndex;

				return (
					<QuizContext.Provider key={index} value={{ ...value, isCurrent }}>
						{quiz}
					</QuizContext.Provider>
				);
			})}
		</aside>
	);
}

//

interface QuizContextValue {
	isCurrent: boolean;
	labels: {
		next: string;
		previous: string;
		validate: string;
	};
	navigation: {
		hasNext: boolean;
		hasPrevious: boolean;
		next: () => void;
		previous: () => void;
	};
}

const QuizContext = createContext<QuizContextValue | null>(null);

function useQuizContext(): QuizContextValue {
	const value = useContext(QuizContext);
	assert(value != null);
	return value;
}

//

interface QuizFormButtonProps
	extends Pick<ButtonProps, "children" | "isDisabled" | "onPress" | "type"> {}

function QuizFormButton(props: QuizFormButtonProps): ReactNode {
	return (
		<Button
			className="inline-flex cursor-default items-center gap-x-2 rounded-md px-3 py-1.5 text-neutral-700 transition current:font-medium current:text-neutral-950 hover:text-neutral-950 focus-visible:text-neutral-950 disabled:opacity-50 dark:text-neutral-300 dark:current:text-neutral-0 dark:hover:text-neutral-0 dark:focus-visible:text-neutral-0"
			{...props}
		/>
	);
}

//

type QuizFormState =
	| { status: "correct"; message: string }
	| { status: "incorrect"; message: string };

interface QuizFormProps {
	action: (
		previousState: QuizFormState | undefined,
		formData: FormData,
	) => Promise<QuizFormState | undefined>;
	buttonLabel?: string;
	children: ReactNode;
}

function QuizForm(props: QuizFormProps): ReactNode {
	const { action, buttonLabel, children } = props;

	const { isCurrent, labels, navigation } = useQuizContext();
	const [formState, formAction] = useFormState(action, undefined);

	return (
		<section
			className="my-4 grid gap-y-4 rounded-md border border-neutral-950/10 bg-neutral-50 px-4 py-6 text-sm leading-relaxed text-neutral-950 shadow dark:border-neutral-0/10 dark:bg-neutral-800 dark:text-neutral-0"
			hidden={!isCurrent}
		>
			<form action={formAction}>
				<div>{children}</div>

				<div className="-mx-3 grid grid-cols-[auto_1fr_auto] items-center gap-4">
					<QuizFormButton isDisabled={!navigation.hasPrevious} onPress={navigation.previous}>
						<ChevronLeftIcon aria-hidden={true} className="size-4 shrink-0" />
						{labels.previous}
					</QuizFormButton>
					<div className="text-center">
						<QuizFormButton type="submit">{buttonLabel ?? labels.validate}</QuizFormButton>
					</div>
					<QuizFormButton isDisabled={!navigation.hasNext} onPress={navigation.next}>
						{labels.next}
						<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0" />
					</QuizFormButton>
				</div>
			</form>

			<div aria-live="polite" className={formState == null ? "sr-only" : undefined}>
				{formState?.message}
			</div>
		</section>
	);
}

//

interface QuizQuestionProps {
	buttonLabel?: string;
	messages: { correct: string; incorrect: string };
	question: string;
}

//

interface QuizMultipleChoiceProps extends QuizQuestionProps {
	answers: Array<{ answer: string; kind: "correct" | "incorrect" }>;
}

export function QuizMultipleChoice(props: QuizMultipleChoiceProps): ReactNode {
	const { answers, buttonLabel, messages, question } = props;

	// eslint-disable-next-line @typescript-eslint/require-await
	async function validate(previousState: QuizFormState | undefined, formData: FormData) {
		const data = getFormData(formData) as { answers?: Array<"on" | undefined> };

		if (
			answers.every((answer, index) => {
				const guess = data.answers?.[index] === "on" ? "correct" : "incorrect";
				return guess === answer.kind;
			})
		) {
			return { status: "correct" as const, message: messages.correct };
		}

		return { status: "incorrect" as const, message: messages.incorrect };
	}

	return (
		<QuizForm action={validate} buttonLabel={buttonLabel}>
			<div>{question}</div>
			<ul className="list-none pl-0" role="list">
				{answers.map((answer, index) => {
					return (
						<li key={index}>
							<label className="flex items-center gap-4">
								<input name={`answers.${index}`} type="checkbox" />
								<span>{answer.answer}</span>
							</label>
						</li>
					);
				})}
			</ul>
		</QuizForm>
	);
}

//

interface QuizSingleChoiceProps extends QuizQuestionProps {
	answers: Array<{ answer: string; kind: "correct" | "incorrect" }>;
}

export function QuizSingleChoice(props: QuizSingleChoiceProps): ReactNode {
	const { answers, buttonLabel, messages, question } = props;

	// eslint-disable-next-line @typescript-eslint/require-await
	async function validate(previousState: QuizFormState | undefined, formData: FormData) {
		const data = getFormData(formData) as { answers?: Array<"on" | undefined> };

		if (
			answers.every((answer, index) => {
				const guess = data.answers?.[index] === "on" ? "correct" : "incorrect";
				return guess === answer.kind;
			})
		) {
			return { status: "correct" as const, message: messages.correct };
		}

		return { status: "incorrect" as const, message: messages.incorrect };
	}

	return (
		<QuizForm action={validate} buttonLabel={buttonLabel}>
			<div>{question}</div>
			<ul className="list-none pl-0" role="list">
				{answers.map((answer, index) => {
					return (
						<li key={index}>
							<label className="flex items-center gap-4">
								<input name={`answers.${index}`} type="radio" />
								<span>{answer.answer}</span>
							</label>
						</li>
					);
				})}
			</ul>
		</QuizForm>
	);
}
