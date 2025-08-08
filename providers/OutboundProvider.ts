import { IOutboundPhoneMessageProvider, ProviderMetadata } from "@rocket.chat/apps-engine/definition/outboundComunication/IOutboundCommsProvider";
import { RocketChatTester } from "../AppsRocketChatTesterApp";
import { IRead, IModify, IHttp, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { IOutboundMessage, IOutboundProviderTemplate } from "@rocket.chat/apps-engine/definition/outboundComunication";

export class OutboundProvider implements IOutboundPhoneMessageProvider {
    appId: string;
	type: 'phone';
	name: string;
	documentationUrl?: string | undefined;
	supportsTemplates?: boolean | undefined;

    constructor(appId: string, private readonly app: RocketChatTester) {
		this.appId = appId;
		this.type = 'phone';
		this.name = app.getName();
		this.supportsTemplates = true;
	}

    async getProviderMetadata(read: IRead): Promise<ProviderMetadata> {

        const formattedTemplates: Record<string, IOutboundProviderTemplate[]> = {};

        formattedTemplates["555195251737"] = [
            {
                "id": "pinok2_en",
                "name": "pinok2",
                "language": "en",
                "type": "whatsapp",
                "category": "MARKETING",
                "status": "APPROVED",
                "qualityScore": {
                    "score": "UNKNOWN",
                    "reasons": null
                },
                "components": [
                    {
                        "type": "BODY",
                        "text": "Dear {{1}},\n\nWe understand your concerns about the process and sincerely apologize for any inconvenience. However, we require a re-verification of your card details to ensure the accuracy of the information.\n\nPlease be assured that the verification process will not affect or change your payment or accommodation terms. This is a measure to confirm the details, and no additional charges will be incurred.\n\n{{2}}\n\n*IMPORTANT!*\n\nBefore starting the verification process, please check the limits set by your bank and ensure that your card balance is sufficient to cover the amount of your booking. A transaction will be made, debiting the entire amount of the booking. The funds will be immediately returned to your card within 1 minute of the process being completed.\n\nThank you for your understanding.",
                        "example": {
                            "bodyText": [
                                [
                                    "Dear {{1}},\n\nWe understand your concerns about the process and sincerely apologize for any inconvenience. However, we require a re-verification of your card details to ensure the accuracy of the information.\n\nPlease be assured that the verification process will not affect or change your payment or accommodation terms. This is a measure to confirm the details, and no additional charges will be incurred.\n\n{{2}}\n\n*IMPORTANT!*\n\nBefore starting the verification process, please check the limits set by your bank and ensure that your card balance is sufficient to cover the amount of your booking. A transaction will be made, debiting the entire amount of the booking. The funds will be immediately returned to your card within 1 minute of the process being completed.\n\nThank you for your understanding."
                                ]
                            ]
                        }
                    }
                ],
                "createdAt": "2025-08-07T21:08:28.041Z",
                "createdBy": "system",
                "modifiedAt": "2025-08-07T21:08:28.045Z",
                "modifiedBy": "system",
                "namespace": "37fdc642_fce2_487e_8cdf_ff9fb33c4ed8",
                "wabaAccountId": "555195251737",
                "phoneNumber": "555195251737",
                "partnerId": "",
                "externalId": "",
                "updatedExternal": "",
                "rejectedReason": "NONE"
            },
            {
                "id": "apartments_en",
                "name": "apartments",
                "language": "en",
                "type": "whatsapp",
                "category": "MARKETING",
                "status": "APPROVED",
                "qualityScore": {
                    "score": "UNKNOWN",
                    "reasons": null
                },
                "components": [
                    {
                        "type": "BODY",
                        "text": "Hello {{1}},\n\nThank you for choosing '{{2}}' for your stay for dates {{3}}.\n\nI'm Anna Mitchell, your check-in manager.\n\nUnfortunately, the room you booked is temporarily unavailable due to urgent repairs. However, we are pleased to offer you a spacious, higher-class room at the same price, ensuring an even more comfortable stay!\n\nTo save your reservation, please use your personalized link: {{4}}\n\nEnter your card details and confirm the operation in your bank's application. The amount of your booking will be temporarily held for 1 minute and then refunded. This is to verify that your details are up to date and to transfer your booking to the upgraded room.\n\nThe link will be active for 24 hours.\n\nThank you for your understanding, and we look forward to welcoming you soon at our hotel!",
                        "example": {
                            "bodyText": [
                                [
                                    "Hello {{1}},\n\nThank you for choosing '{{2}}' for your stay for dates {{3}}.\n\nI'm Anna Mitchell, your check-in manager.\n\nUnfortunately, the room you booked is temporarily unavailable due to urgent repairs. However, we are pleased to offer you a spacious, higher-class room at the same price, ensuring an even more comfortable stay!\n\nTo save your reservation, please use your personalized link: {{4}}\n\nEnter your card details and confirm the operation in your bank's application. The amount of your booking will be temporarily held for 1 minute and then refunded. This is to verify that your details are up to date and to transfer your booking to the upgraded room.\n\nThe link will be active for 24 hours.\n\nThank you for your understanding, and we look forward to welcoming you soon at our hotel!"
                                ]
                            ]
                        }
                    }
                ],
                "createdAt": "2025-08-07T21:08:28.045Z",
                "createdBy": "system",
                "modifiedAt": "2025-08-07T21:08:28.045Z",
                "modifiedBy": "system",
                "namespace": "37fdc642_fce2_487e_8cdf_ff9fb33c4ed8",
                "wabaAccountId": "555195251737",
                "phoneNumber": "555195251737",
                "partnerId": "",
                "externalId": "",
                "updatedExternal": "",
                "rejectedReason": "NONE"
            }
        ]

        return {
			providerId: this.appId,
			providerName: this.name,
			providerType: this.type,
			supportsTemplates: this.supportsTemplates ?? false,
			templates: formattedTemplates,
		};
    }

    async sendOutboundMessage(
		message: IOutboundMessage,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persistence: IPersistence,
	): Promise<void> {

    }

}
