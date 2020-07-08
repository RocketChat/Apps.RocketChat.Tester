import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

export class PhoneCommand implements ISlashCommand {
    public command = 'phone'; // [1]
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const [subcommand] = context.getArguments(); // [2]

        if (!subcommand) { // [3]
            throw new Error('Error!');
        }

        switch (subcommand) { // [4]
            case 'text': // [5]
                console.log('Texting!');
                break;

            case 'call': // [6]
                console.log('Calling!');
                break;

            default: // [7]
                throw new Error('Error!');
        }
    }
}
