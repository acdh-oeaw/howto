import type { ReactNode } from "react";

import { QuizControls } from "@/components/content/quiz-controls";
import { QuizErrorMessage } from "@/components/content/quiz-error-message";
import type { QuizForm } from "@/components/content/quiz-form";
import { QuizSuccessMessage } from "@/components/content/quiz-success-message";
import { getChildrenElements } from "@/lib/get-children-elements";
import { groupByToMap } from "@acdh-oeaw/lib";

interface QuizChoiceProps extends QuizForm {
	variant: "single" | "multiple";
}

export function QuizChoice(props: QuizChoiceProps): ReactNode {
	const { buttonLabel, children, variant } = props;

	const type = variant === "multiple" ? "checkbox" : "radio";

	const map = groupByToMap(getChildrenElements(children), (child) => child.type);
	const questions = map.get(QuizChoiceQuestion);
	const answers = map.get(QuizChoiceAnswer);
	const successMessages = map.get(QuizSuccessMessage);
	const errorMessages = map.get(QuizErrorMessage);

	return (
		<section>
			<header>{questions}</header>

			<ul className="pl-0 list-none" role="list">
				{answers?.map((answer, index) => {
					return (
						<li key={index}>
							<label className="grid grid-cols-[auto_1fr] items-center gap-x-2">
								<input name={`answer.${index}`} type={type} />
								<span>{answer}</span>
							</label>
						</li>
					);
				})}
			</ul>

			<QuizControls
				buttonLabel={buttonLabel}
				successMessages={successMessages}
				errorMessages={errorMessages}
			/>
		</section>
	);
}

interface QuizChoiceQuestionProps {
	children: ReactNode;
}

export function QuizChoiceQuestion(props: QuizChoiceQuestionProps): ReactNode {
	const { children } = props;

	return <div>{children}</div>;
}

interface QuizChoiceAnswerProps {
	children: ReactNode;
	kind: "correct" | "incorrect";
}

export function QuizChoiceAnswer(props: QuizChoiceAnswerProps): ReactNode {
	const { children } = props;

	return <div>{children}</div>;
}
