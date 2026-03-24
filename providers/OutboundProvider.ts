import { IOutboundPhoneMessageProvider, ProviderMetadata } from "@rocket.chat/apps-engine/definition/outboundCommunication/IOutboundCommsProvider";
import { RocketChatTester } from "../AppsRocketChatTesterApp";
import { IRead, IModify, IHttp, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { IOutboundMessage, IOutboundProviderTemplate, TemplateComponent } from "@rocket.chat/apps-engine/definition/outboundCommunication";
import { createWhatsAppPayload, filterTemplateComponents, validateOutboundMessage, validateTemplateParameters } from "../helpers/OutboundMessage";
import { IContactStatus, IRequestTemplateComponent, IResponseContact, ISavedTemplate, TemplateMetadataInfo } from "../enums/WhatsApp360CloudApi";

export class OutboundProvider implements IOutboundPhoneMessageProvider {
    appId: string;
	type: 'phone';
	name: string;
	documentationUrl?: string | undefined;
	supportsTemplates?: boolean | undefined;

    private credentialsStore: Map<string, {
        phoneNumber: string;
        accessToken: string;
        wabaId: string;
        phoneNumberId: string;
        businessAccountId: string;
        webhookVerifyToken: string;
        createdAt: Date;
        updatedAt: Date;
    }> = new Map();

    private contactStore: Map<string, IResponseContact> = new Map();

    private templateStore: Map<string, TemplateMetadataInfo> = new Map();


    constructor(appId: string, private readonly app: RocketChatTester) {
		this.appId = appId;
		this.type = 'phone';
		this.name = app.getName();
		this.supportsTemplates = true;
        this.initializeMockCredentials();
        this.initializeMockContacts();
        this.initializeMockTemplates();
	}

    async getProviderMetadata(read: IRead): Promise<ProviderMetadata> {

        const formattedTemplates: Record<string, IOutboundProviderTemplate[]> = {};

        formattedTemplates['555599999999'] = [
			{
				id: 'apartments_en',
				name: 'apartments',
				language: 'en',
				type: 'whatsapp',
				category: 'MARKETING',
				status: 'APPROVED',
				qualityScore: {
					score: 'UNKNOWN',
					reasons: null,
				},
				components: [
					{
						type: 'body',
						text: "Hello {{1}},\n\nThank you for choosing '{{2}}' for your stay for dates {{3}}.\n\nI'm Anna Mitchell, your check-in manager.\n\nUnfortunately, the room you booked is temporarily unavailable due to urgent repairs. However, we are pleased to offer you a spacious, higher-class room at the same price, ensuring an even more comfortable stay!\n\nTo save your reservation, please use your personalized link: {{4}}\n\nEnter your card details and confirm the operation in your bank's application. The amount of your booking will be temporarily held for 1 minute and then refunded. This is to verify that your details are up to date and to transfer your booking to the upgraded room.\n\nThe link will be active for 24 hours.\n\nThank you for your understanding, and we look forward to welcoming you soon at our hotel!",
						example: {
							bodyText: [
								[
									"Hello {{1}},\n\nThank you for choosing '{{2}}' for your stay for dates {{3}}.\n\nI'm Anna Mitchell, your check-in manager.\n\nUnfortunately, the room you booked is temporarily unavailable due to urgent repairs. However, we are pleased to offer you a spacious, higher-class room at the same price, ensuring an even more comfortable stay!\n\nTo save your reservation, please use your personalized link: {{4}}\n\nEnter your card details and confirm the operation in your bank's application. The amount of your booking will be temporarily held for 1 minute and then refunded. This is to verify that your details are up to date and to transfer your booking to the upgraded room.\n\nThe link will be active for 24 hours.\n\nThank you for your understanding, and we look forward to welcoming you soon at our hotel!",
								],
							],
						},
					},
				],
				createdAt: '2025-08-07T21:08:28.045Z',
				createdBy: 'system',
				modifiedAt: '2025-08-07T21:08:28.045Z',
				modifiedBy: 'system',
				namespace: 'namespace_name',
				wabaAccountId: '555599999999',
				phoneNumber: '555599999999',
				partnerId: '',
				externalId: '',
				updatedExternal: '',
				rejectedReason: 'NONE',
			},
		];

        return {
			providerId: this.appId,
			providerName: this.name,
			providerType: this.type,
			supportsTemplates: this.supportsTemplates ?? false,
			templates: formattedTemplates,
		};
    }

    async sendOutboundMessage(
		message: IOutboundMessage
	): Promise<void> {
        await validateOutboundMessage(message);

        const mockSavedTemplate: TemplateMetadataInfo = this.templateStore.get(message.template.name) as TemplateMetadataInfo;

        if (!mockSavedTemplate) {
		    throw new Error(`Template not found: ${message.template.name}`);
	    }

        const mockCredentials = this.credentialsStore.get(message.templateProviderPhoneNumber);

        if (!mockCredentials) {
            throw new Error(`No credentials found for sender number: ${message.templateProviderPhoneNumber}`);
        }

        const mockContact = this.contactStore.get(message.to);

        if (!mockContact) {
            throw new Error(`No contact found for phone number: ${message.to}`);
        }

        const validComponents: TemplateComponent[] = filterTemplateComponents(
            message.template.components as TemplateComponent[],
            mockSavedTemplate,
            message.template.name,
            this.app.getLogger(),
        );

        validateTemplateParameters(validComponents, mockSavedTemplate, message.template.name, this.app.getLogger());

        const payload = createWhatsAppPayload(
            mockContact,
            message,
            mockSavedTemplate,
            validComponents as IRequestTemplateComponent[],
        );

        // Then send the payload using the 360Cloud API service
        // which we will not implement here
    }

    private initializeMockTemplates(): void {
        this.templateStore.set('apartments_en', {
            name: 'apartments',
            namespace: 'namespace_name',
            templateInfo: {
                language: 'en',
                header: {
                    text: 'Apartment Search Results',
                    totalPlaceholders: 0
                },
                body: {
                    text: 'Your apartment search for {{1}} in {{2}} is ready! View results here.',
                    totalPlaceholders: 2
                },
                footer: {
                    text: 'Thank you for using our service!',
                    totalPlaceholders: 0
                }
            }
        });
    }

    private initializeMockCredentials(): void {
        this.credentialsStore.set('555599999999', {
            phoneNumber: '555599999999',
            accessToken: 'mock_access_token_12345',
            wabaId: 'mock_waba_id',
            phoneNumberId: 'mock_phone_number_id',
            businessAccountId: 'mock_business_account_id',
            webhookVerifyToken: 'mock_webhook_token',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    private initializeMockContacts(): void {
        this.contactStore.set('5555912345678', {
            input: '5555912345678',
            wa_id: '5555912345678',
            status: IContactStatus.VALID
        });
    }
}
