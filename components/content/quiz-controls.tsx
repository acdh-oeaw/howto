"use client";

import type { ReactNode } from "react";
import { useQuizContext } from "./quiz";

interface QuizControlsProps {
	buttonLabel?: ReactNode;
	errorMessages?: Array<ReactNode>;
	successMessages?: Array<ReactNode>;
}

export function QuizControls(props: QuizControlsProps): ReactNode {
	const { buttonLabel, errorMessages, successMessages } = props;

	const context = useQuizContext();

	return <footer></footer>;
}
