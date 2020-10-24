import { IAppAccessors, IConfigurationExtend, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { StartJob } from './slashcommand/startJob';
import { CancelJob } from './slashcommand/cancelJob';
import { CancelAllJobs } from './slashcommand/cancelAllJobs';

export class RocketChatTester extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        configuration.scheduler.registerProcessors([
            {
                id: 'first',
                processor: async (job) => console.log(`[${ Date() }] this is the first task`, job.attrs.data)
            },
            {
                id: 'second',
                processor: async (job) => console.log(`[${ Date() }] second task here`, job.attrs.data)
            },
            {
                id: 'third',
                processor: async (job) => console.log(`[${ Date() }] here's third`, job.attrs.data)
            },
            {
                id: 'fourth',
                processor: async (job) => console.log(`[${ Date() }] and now the fourth`, job.attrs.data)
            },
            {
                id: 'fifth',
                processor: async (job) => console.log(`[${ Date() }] and the fifth`, job.attrs.data)
            },
        ]);

        await configuration.slashCommands.provideSlashCommand(new StartJob(this));
        await configuration.slashCommands.provideSlashCommand(new CancelJob(this));
        await configuration.slashCommands.provideSlashCommand(new CancelAllJobs(this));
    }
}
