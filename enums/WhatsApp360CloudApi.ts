import { MessageType } from "@rocket.chat/apps-engine/definition/messages/MessageType";

export interface ID360Message {
	from?: string;
	id?: string;
	to: string;
	text?: {
		body: string;
	};
	messaging_product: 'whatsapp';
	// Apparently only using it when message is not a template message
	recipient_type?: 'individual';
	timestamp?: string;
	type?: MessageType;
	audio?: {
		id: string;
	};
	document?: {
		id: string;
		caption?: string;
		filename: string;
	};
	video?: {
		id: string;
		provider?: {
			name: string;
		};
		caption: string;
	};
	image?: {
		id: string;
		caption: string;
	};
	attachment?: {
		type: string;
		size: number;
		content: Buffer;
		name: string;
		caption?: string;
	};
	interactive?: IInteractiveMessage;
	template?: IRequestTemplate;
	location?: IRequestLocation;
}

export interface IInteractiveMessage {
	type: InteractiveMessageType;
	header?: IMessageHeader;
	body: IMessageBody;
	footer?: IMessageFooter;
	action: IMessageActionReplyButtons | IMessageActionList;
}

export enum InteractiveMessageType {
	BUTTON = 'button',
	LIST = 'list',
}

export enum LanguagePolicy {
	DETERMINISTIC = 'deterministic',
	FALLBACK = 'fallback',
}

export enum IRequestInteractiveType {
	BUTTON_REPLY = 'button_reply',
	LIST_REPLY = 'list_reply',
}

export interface IMessageHeader {
	type: 'text' | 'video' | 'image' | 'document';
	text?: string; // max 60 chars
	video?: never; // For future reference, this contains media object - https://developers.facebook.com/docs/whatsapp/api/messages#media-object
	image?: never;
	document?: never;
}

export interface IMessageBody {
	text: string; // max 1024 chars
}

export interface IMessageFooter {
	text: string; // max 60 chars
}

export interface IMessageActionReplyButtons {
	buttons: IMessageActionReplyButton[]; // max length 3
}

export interface IMessageActionList {
	button: string; // max 20 chars
	sections: Array<IMessageActionListSection>; // max length 10, min length 1 - note, this restriction applies across entire IMessageActionListSectionRow object
	// so you can max 10 row items in this section
}

export interface IMessageActionReplyButton {
	type: 'reply';
	reply: {
		title: string; // max 20 chars
		id: string; // max 256 chars
	};
}

export interface IMessageActionListSection {
	title?: string; // max 24 chars - Required if the message has more than one section
	rows: Array<IMessageActionListSectionRow>;
}

export interface IMessageActionListSectionRow {
	id: string; // max 200 chars
	title: string; // max 24 chars
	description?: string; // max 72 chars
}

export interface IRequestTemplate {
	namespace: string;
	name: string;
	language: {
		code: string;
		policy: LanguagePolicy;
	};
	components?: Array<IRequestTemplateComponent>;
}

export interface IRequestTemplateComponent {
	type: string;
	parameters?: Array<{ type: string; text: string }>;
}

export interface IRequestLocation {
	latitude: number;
	longitude: number;
	address?: string;
	name?: string;
	url?: string;
}

export interface IResponseContact {
	input: string;
	status: IContactStatus;
	wa_id?: string;
}

export enum IContactStatus {
	VALID = 'valid',
	INVALID = 'invalid',
	PROCESSING = 'processing',
	FAILED = 'failed',
}

export type TemplateMetadataInfo = {
	name: string;
	namespace: string;
	templateInfo: ISavedTemplateInfo;
};

// Persistence simulation
export interface ISavedTemplate {
	category?: string;
	senderWaId: string;
	senderPhoneNumber: string;
	name: string;
	namespace: string;
	templateInfo: Array<ISavedTemplateInfo>;
	rejectedReason: string | undefined;
}

export interface ISavedTemplateInfo {
	header?: ISavedTemplateMessage;
	body?: ISavedTemplateMessage;
	footer?: ISavedTemplateMessage;
	language: string;
}

export interface ISavedTemplateMessage {
	format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | string;
	text: string;
	totalPlaceholders: number;
}

export interface ISavedPhoneNumberData {
	waId: string;
	phoneNumber: string;
	apiURL: string;
	apiKey: string;
	targetDepartment?: string;
	welcomeMessage?: string;
	conversationClosedMessage?: string;
	offlineServiceMessage?: string;
}


