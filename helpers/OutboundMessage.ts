import { ILogger, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { MessageType } from "@rocket.chat/apps-engine/definition/messages";
import { IOutboundMessage, TemplateComponent } from "@rocket.chat/apps-engine/definition/outboundComunication/IOutboundMessage";
import { IRequestTemplateComponent, ID360Message, LanguagePolicy, TemplateMetadataInfo, IResponseContact, ISavedPhoneNumberData } from "../enums/WhatsApp360CloudApi";

export async function validateOutboundMessage(message: IOutboundMessage): Promise<void> {
	if (!message.template.name) {
		throw new Error('Template name is required for WhatsApp messages');
	}
}

export function filterTemplateComponents(
	components: TemplateComponent[],
	savedTemplate: TemplateMetadataInfo,
	templateName: string,
	logger: ILogger,
): TemplateComponent[] {
	const validComponents: TemplateComponent[] = [];

	if (!components) return validComponents;

	for (const component of components) {
		switch (component.type) {
			case 'header':
				if (savedTemplate.templateInfo.header) {
					validComponents.push(component);
				} else {
					logger.warn(`Skipping header component - template ${templateName} has no header`);
				}
				break;
			case 'body':
				if (savedTemplate.templateInfo.body) {
					validComponents.push(component);
				} else {
					logger.warn(`Skipping body component - template ${templateName} has no body`);
				}
				break;
			case 'footer':
				if (savedTemplate.templateInfo.footer) {
					validComponents.push(component);
				} else {
					logger.warn(`Skipping footer component - template ${templateName} has no footer`);
				}
				break;
			default:
				validComponents.push(component);
				break;
		}
	}

	return validComponents;
}

export function createWhatsAppPayload(
	contact: IResponseContact,
	message: IOutboundMessage,
	savedTemplate: TemplateMetadataInfo,
	validComponents: IRequestTemplateComponent[],
): ID360Message {
	return {
		to: contact.wa_id as string,
		type: message.type as MessageType,
		template: {
			name: message.template.name,
			namespace: message.template.namespace || savedTemplate.namespace,
			language: {
				code: message.template.language.code || 'en',
				policy: message.template.language?.policy as LanguagePolicy,
			},
			...(validComponents.length > 0 && { components: validComponents }),
		},
		messaging_product: 'whatsapp',
		recipient_type: 'individual',
	};
}

export function validateTemplateParameters(
	components: TemplateComponent[],
	savedTemplate: TemplateMetadataInfo,
	templateName: string,
	logger: ILogger,
): void {
	if (!components) return;

	const templateInfo = savedTemplate.templateInfo;

	for (const component of components) {
		switch (component.type) {
			case 'body':
				validateBodyParameters(component, templateInfo.body?.text || '', templateName, logger);
				break;
			case 'header':
				validateHeaderParameters(component, templateInfo.header?.text || '', templateName, logger);
				break;
			case 'footer':
				validateFooterParameters(component, templateInfo.footer?.text || '', templateName, logger);
				break;
		}
	}
}

function validateBodyParameters(
	component: TemplateComponent,
	bodyText: string,
	templateName: string,
	logger: ILogger,
): void {
	if (!bodyText) {
		logger.warn(`Template ${templateName} has no body text to validate parameters`);
		return;
	}

	const expectedParams = countTemplatePlaceholders(bodyText);
	const actualParams = component.parameters?.length || 0;

	if (actualParams !== expectedParams) {
		throw new Error(
			`Body parameter count mismatch for template ${templateName}: ` +
				`expected ${expectedParams} parameters, but received ${actualParams}.`,
		);
	}

	logger.debug(`Body parameters validated: ${actualParams}/${expectedParams} for template ${templateName}`);
}

function validateHeaderParameters(
	component: TemplateComponent,
	headerText: string,
	templateName: string,
	logger: ILogger,
): void {
	if (!headerText) {
		logger.warn(`Template ${templateName} has no header text to validate parameters`);
		return;
	}

	const expectedParams = countTemplatePlaceholders(headerText);
	const actualParams = component.parameters?.length || 0;

	if (actualParams !== expectedParams) {
		throw new Error(
			`Header parameter count mismatch for template ${templateName}: ` +
				`expected ${expectedParams} parameters, but received ${actualParams}.`,
		);
	}

	logger.debug(`Header parameters validated: ${actualParams}/${expectedParams} for template ${templateName}`);
}

function validateFooterParameters(
	component: TemplateComponent,
	footerText: string,
	templateName: string,
	logger: ILogger,
): void {
	if (!footerText) {
		logger.warn(`Template ${templateName} has no footer text to validate parameters`);
		return;
	}

	const expectedParams = countTemplatePlaceholders(footerText);
	const actualParams = component.parameters?.length || 0;

	if (actualParams !== expectedParams) {
		throw new Error(
			`Footer parameter count mismatch for template ${templateName}: ` +
				`expected ${expectedParams} parameters, but received ${actualParams}.`,
		);
	}

	logger.debug(`Footer parameters validated: ${actualParams}/${expectedParams} for template ${templateName}`);
}

function countTemplatePlaceholders(text: string): number {
	// Regex to search for placeholders. Format: {{1}}, {{2}}, etc.
	const placeholderRegex = /\{\{\d+\}\}/g;
	const matches = text.match(placeholderRegex);
	return matches ? matches.length : 0;
}
