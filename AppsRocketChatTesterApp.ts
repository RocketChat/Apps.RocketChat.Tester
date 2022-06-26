import { IAppAccessors, IConfigurationExtend, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SendMessageAsAppUserEndpoint } from './endpoints/SendMessageAsAppUser';
import { SendMessageAsUserEndpoint } from './endpoints/SendMessageAsUser';
import { TestArgumentsSlashcommand } from './slashcommands/TestArgumentsSlashcommand';
import { TestSlashcommand } from './slashcommands/TestSlashcommand';
import { TestVideoConfProvider } from './videoConfProviders/TestVideoConfProvider';
import { UnconfiguredVideoConfProvider } from './videoConfProviders/UnconfiguredVideoConfProvider';

export class RocketChatTester extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [
                new SendMessageAsAppUserEndpoint(this),
                new SendMessageAsUserEndpoint(this),
            ],
        });

        configuration.slashCommands.provideSlashCommand(new TestSlashcommand());
        configuration.slashCommands.provideSlashCommand(new TestArgumentsSlashcommand());

        configuration.videoConfProviders.provideVideoConfProvider(new TestVideoConfProvider());
        configuration.videoConfProviders.provideVideoConfProvider(new UnconfiguredVideoConfProvider());
    }
}
