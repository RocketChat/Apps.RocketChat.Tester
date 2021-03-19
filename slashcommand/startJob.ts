import {
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

export class StartJob  implements ISlashCommand {
    public command = 'job';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify): Promise<void> {
        const id = this.getJobIdFromContext(context);
        const cron = `${ this.randomNumber(5, 11) } seconds`;
        console.log('I will schedule a new task.🤞', id, cron);
        await modify.getScheduler().scheduleRecurring({ id, interval: cron, data: { cron }});
    }

    private getJobIdFromContext(context: SlashCommandContext): string {
        return context.getArguments().join(' ');
    }

    private randomNumber(min, max) {
        return Math.trunc(Math.random() * (max - min) + min);
    }
}
