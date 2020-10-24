import {ISlashCommand, SlashCommandContext} from '@rocket.chat/apps-engine/definition/slashcommands';
import {App} from '@rocket.chat/apps-engine/definition/App';
import {IRead, IModify} from '@rocket.chat/apps-engine/definition/accessors';

export class CancelJob implements ISlashCommand {
    public command = 'stop';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
        const jobId = this.getJobIdFromContext(context);
        console.log('I will cancel a scheduled task.️🔥', jobId);
        await modify.getScheduler().cancelJob(jobId);
    }

    private getJobIdFromContext(context: SlashCommandContext): string {
        return context.getArguments().join(' ');
    }

}
