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
    public command = 'get';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const [url] = context.getArguments();

        if (!url) {
            throw new Error('Error!');
        }

        const response = await http.get(url);
        const message = JSON.stringify(response.data, null, 2);
        await this.sendMessage(context, modify, message);
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
