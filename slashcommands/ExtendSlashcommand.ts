import { IHttp, IModify, IPersistence, IRead, IMessageExtender } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { ImageAttachment } from '../ImageAttachment';

export class ExtendMessageCommand implements ISlashCommand{
    public command = 'extend-message';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        await this.sendMessage(context, modify, 'Sending one message!');
    }

    private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<string> {
        const messageStructure = modify.getCreator().startMessage();
        const sender = context.getSender();
        const room = context.getRoom();
        const value = 2;
        const img = new ImageAttachment('https://open.rocket.chat/images/logo/logo.svg');
        
        messageStructure
            .setSender(sender)
            .setRoom(room)
            .setText(message)
            .addAttachment(img);
        
        messageStructure.addCustomField('key', value);

        return (await modify.getCreator().finish(messageStructure));
    }
}
