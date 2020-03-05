import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class TestSlashcommand implements ISlashCommand {
    public command = 'test-simple';
    public i18nParamsExample = 'test_command_example';
    public i18nDescription = 'test_command_description';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const room = context.getRoom();

        const messageBuilder = modify.getCreator().startMessage()
            .setText(`Slashcommand 'test-simple' successfully executed`)
            .setRoom(room);

        await modify.getCreator().finish(messageBuilder);
    }
}
