import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

export class HTTPRequestCommand implements ISlashCommand {
    public command = 'http';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const command = this.getCommandFromContextArguments(context);

        if (!command) {
            throw new Error('Error!');
        }

        switch (command) {
            case 'get':
                await this.getRemoteContent(context, modify, read, http);
                break;

            default:
                break;
        }
    }

    private async getRemoteContent(context: SlashCommandContext, modify: IModify, read: IRead, http: IHttp): Promise<void> {
        const url = this.getURLFromContextArguments(context);
        const response = await http.get(url);

        if (response.statusCode !== 200) {
            throw new Error('Error!');
        }

        const message = JSON.stringify(response.data, null, 2);

        await this.sendMessage(context, modify, message);
    }

    private getCommandFromContextArguments(context: SlashCommandContext): string {
        const [command] = context.getArguments();
        return command;
    }

    private getURLFromContextArguments(context: SlashCommandContext): string {
        const args = context.getArguments().slice(1);
        return args[0];
    }

    private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<void> {
        const messageStructure = modify.getCreator().startMessage();
        const sender = context.getSender();
        const room = context.getRoom();

        messageStructure
        .setSender(sender)
        .setRoom(room)
        .setText(message);

        await modify.getCreator().finish(messageStructure);
    }
}

