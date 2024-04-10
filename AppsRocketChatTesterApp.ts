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
import { UnconfiguredVideoConfProvider } from "./videoConfProviders/UnconfiguredVideoConfProvider";
import {
    UIKitActionButtonInteractionContext,
    IUIKitResponse,
    IUIKitInteractionHandler,
    UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { executeActionButtonHandler } from "./handlers/ActionHandler";
import { executeViewSubmitHandler } from "./handlers/SubmitInteraction";
import { UIActionButtonContext } from "@rocket.chat/apps-engine/definition/ui";

export class RocketChatTester extends App implements IUIKitInteractionHandler {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        await Promise.all([
            configuration.api.provideApi({
                visibility: ApiVisibility.PUBLIC,
                security: ApiSecurity.UNSECURE,
                endpoints: [
                    new SendMessageAsAppUserEndpoint(this),
                    new SendMessageAsUserEndpoint(this),
                ],
            }),

            configuration.slashCommands.provideSlashCommand(
                new TestSlashcommand()
            ),
            configuration.slashCommands.provideSlashCommand(
                new TestArgumentsSlashcommand()
            ),
            configuration.slashCommands.provideSlashCommand(
                new OpenContextualBarSlashcommand()
            ),

            configuration.videoConfProviders.provideVideoConfProvider(
                new TestVideoConfProvider()
            ),
            configuration.videoConfProviders.provideVideoConfProvider(
                new UnconfiguredVideoConfProvider()
            ),
            configuration.ui.registerButton({
                actionId: "error",
                labelI18n: "error",
                context: UIActionButtonContext.ROOM_ACTION,
            }),
            configuration.ui.registerButton({
                actionId: "timeout",
                labelI18n: "timeout",
                context: UIActionButtonContext.ROOM_ACTION,
            }),
            configuration.ui.registerButton({
                actionId: "update",
                labelI18n: "update",
                context: UIActionButtonContext.ROOM_ACTION,
            }),
            configuration.ui.registerButton({
                actionId: "success",
                labelI18n: "success",
                context: UIActionButtonContext.ROOM_ACTION,
            }),
        ]);
    }

    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        _read: IRead,
        _http: IHttp,
        _persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        return executeActionButtonHandler(context, modify);
    }

    public async executeViewSubmitHandler(
        context: UIKitViewSubmitInteractionContext,
        _read: IRead,
        _http: IHttp,
        _persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        return executeViewSubmitHandler(context, modify);
    }
}
