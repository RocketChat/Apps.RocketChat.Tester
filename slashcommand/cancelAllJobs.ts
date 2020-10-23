import {ISlashCommand, SlashCommandContext} from '@rocket.chat/apps-engine/definition/slashcommands';
import {App} from '@rocket.chat/apps-engine/definition/App';
import {IRead, IModify} from '@rocket.chat/apps-engine/definition/accessors';

export class CancelAllJobs implements ISlashCommand {
    public command = 'stopall';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
        await modify.getScheduler().cancelAllJobs();
    }
}
