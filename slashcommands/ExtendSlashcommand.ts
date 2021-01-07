import { IHttp, IModify, IPersistence, IRead, IMessageExtender } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { ImageAttachment } from '../ImageAttachment';
import { Message } from '../Message'

export class ExtendMessageCommand implements ISlashCommand{
    public command = 'extend-message';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        var messageId = await this.sendMessage(context, modify, 'Sending a message!');
    }

    private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<string> {
        const messageStructure = modify.getCreator().startMessage();
        const sender = context.getSender();
        const room = context.getRoom();
        const value = 1;
        const img = new ImageAttachment('https://open.rocket.chat/images/logo/logo.svg');

        const msg = new Message(sender, room, message);
        messageStructure.setData(msg);

        msg.addCustomField('key', value);
        msg.addAttachment(img);

        return (await modify.getCreator().finish(messageStructure));
    }
}
