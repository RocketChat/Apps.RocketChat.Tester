import { IAppAccessors, IConfigurationExtend, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { CreateVisitorEndpoint } from './endpoints/CreateVisitor';
import { QueryVisitorEndpoint } from './endpoints/QueryVisitor';
import { SendMessageAsAppUserEndpoint } from './endpoints/SendMessageAsAppUser';
import { SendMessageAsUserEndpoint } from './endpoints/SendMessageAsUser';
import { TestArgumentsSlashcommand } from './slashcommands/TestArgumentsSlashcommand';
import { TestSlashcommand } from './slashcommands/TestSlashcommand';

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
                new QueryVisitorEndpoint(this),
                new CreateVisitorEndpoint(this),
            ],
        });

        configuration.slashCommands.provideSlashCommand(new TestSlashcommand());
        configuration.slashCommands.provideSlashCommand(new TestArgumentsSlashcommand());
    }
}
