import type messages from "@/messages/en.json";

declare global {
	type Messages = typeof messages;

	declare interface IntlMessages extends Messages {}
}
