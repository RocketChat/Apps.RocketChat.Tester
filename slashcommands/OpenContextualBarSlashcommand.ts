import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { openContextualBar } from '../ui/ContextualBar';

export class OpenContextualBarSlashcommand implements ISlashCommand {
    public command = 'contextualbar';
    public i18nParamsExample = 'open-contextual-bar';
    public i18nDescription = 'open-contextual-bar';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const user = context.getSender();
        const triggerId = context.getTriggerId() as string;
        const view = openContextualBar(modify);
        modify.getUiController().openContextualBarView(view, { triggerId }, user);
    }
}
