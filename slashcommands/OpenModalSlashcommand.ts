import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { openModal } from "../ui/Modal";

export class OpenModalSlashcommand implements ISlashCommand {
    public command = "modal";
    public i18nParamsExample = "open-modal";
    public i18nDescription = "open-modal";
    public providesPreview = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const user = context.getSender();
        const triggerId = context.getTriggerId() as string;
        const view = openModal(modify);
        modify.getUiController().openModalView(view, { triggerId }, user);
    }
}
