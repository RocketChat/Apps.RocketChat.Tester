import { IAppAccessors, IConfigurationExtend, IHttp, ILogger, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SendMessageAsAppUserEndpoint } from './endpoints/SendMessageAsAppUser';
import { SendMessageAsUserEndpoint } from './endpoints/SendMessageAsUser';
import { SendQRBtnMsgEndpoint } from './endpoints/SendQRBtnMsg';

import { OpenContextualBarSlashcommand } from './slashcommands/OpenContextualBarSlashcommand';
import { TestArgumentsSlashcommand } from './slashcommands/TestArgumentsSlashcommand';
import { TestSlashcommand } from './slashcommands/TestSlashcommand';
import { TestVideoConfProvider } from './videoConfProviders/TestVideoConfProvider';
import { UnconfiguredVideoConfProvider } from './videoConfProviders/UnconfiguredVideoConfProvider';
import { UIKitLivechatBlockInteractionContext, IUIKitResponse, IUIKitLivechatInteractionHandler } from '@rocket.chat/apps-engine/definition/uikit';
import { ExecuteLivechatBlockActionHandler } from './handler/ExecuteLivechatBlockActionHandler';

export class RocketChatTester extends App implements IUIKitLivechatInteractionHandler {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executeLivechatBlockActionHandler(
		context: UIKitLivechatBlockInteractionContext,
		read: IRead,
		_http: IHttp,
		_persistence: IPersistence,
		modify: IModify,
	): Promise<IUIKitResponse> {
		const handler = new ExecuteLivechatBlockActionHandler(
			this,
			context,
			read,
			modify,
		);
		return await handler.run();
	}

    public async extendConfiguration(configuration: IConfigurationExtend) {
        configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [
                new SendMessageAsAppUserEndpoint(this),
                new SendMessageAsUserEndpoint(this),
                new SendQRBtnMsgEndpoint(this),
            ],
        });

        configuration.slashCommands.provideSlashCommand(new TestSlashcommand());
        configuration.slashCommands.provideSlashCommand(new TestArgumentsSlashcommand());
        configuration.slashCommands.provideSlashCommand(new OpenContextualBarSlashcommand());

        configuration.videoConfProviders.provideVideoConfProvider(new TestVideoConfProvider());
        configuration.videoConfProviders.provideVideoConfProvider(new UnconfiguredVideoConfProvider());
    }
}
