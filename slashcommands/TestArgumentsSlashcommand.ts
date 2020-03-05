import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class TestArgumentsSlashcommand implements ISlashCommand {
    public command = 'test-with-arguments';
    public i18nParamsExample = 'test_arguments_command_example';
    public i18nDescription = 'test_arguments_command_description';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const room = context.getRoom();
        const args = context.getArguments();

        const messageBuilder = modify.getCreator().startMessage()
            .setText(`Slashcommand 'test-with-arguments' successfully executed with arguments: ${ args.map((arg) => `"${arg}"`) }`)
            .setRoom(room);

        await modify.getCreator().finish(messageBuilder);
    }
}
