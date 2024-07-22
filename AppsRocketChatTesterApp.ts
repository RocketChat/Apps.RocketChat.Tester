import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ApiSecurity,
    ApiVisibility,
} from "@rocket.chat/apps-engine/definition/api";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { SendMessageAsAppUserEndpoint } from "./endpoints/SendMessageAsAppUser";
import { SendMessageAsUserEndpoint } from "./endpoints/SendMessageAsUser";
import { OpenContextualBarSlashcommand } from "./slashcommands/OpenContextualBarSlashcommand";
import { TestArgumentsSlashcommand } from "./slashcommands/TestArgumentsSlashcommand";
import { TestSlashcommand } from "./slashcommands/TestSlashcommand";
import { TestVideoConfProvider } from "./videoConfProviders/TestVideoConfProvider";
import { PersistentChatVideoConfProvider } from "./videoConfProviders/PersistentChatVideoConfProvider";
import { UnconfiguredVideoConfProvider } from "./videoConfProviders/UnconfiguredVideoConfProvider";
import { OpenModalSlashcommand } from "./slashcommands/OpenModalSlashcommand";
import { ModalViewSubmitHandler } from "./handlers/ModalHandlers";
import {
    IUIKitResponse,
    UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";

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
        configuration.slashCommands.provideSlashCommand(
            new TestArgumentsSlashcommand()
        );
        configuration.slashCommands.provideSlashCommand(
            new OpenContextualBarSlashcommand()
        );
        configuration.slashCommands.provideSlashCommand(
            new OpenModalSlashcommand()
        );

        configuration.videoConfProviders.provideVideoConfProvider(
            new TestVideoConfProvider()
        );
        configuration.videoConfProviders.provideVideoConfProvider(
            new PersistentChatVideoConfProvider()
        );
        configuration.videoConfProviders.provideVideoConfProvider(
            new UnconfiguredVideoConfProvider()
        );
    }

    public async executeViewSubmitHandler(
        interactionContext: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        const data = interactionContext.getInteractionData();
        const viewId = data.view.id;

        if (viewId === "modal_example") {
            return ModalViewSubmitHandler(interactionContext);
        }

        return { success: false };
    }
}
