import { IAppAccessors, IHttp, ILogger, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IMessage, IPostMessageSent } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo, RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

export class AppsRocketChatTesterApp extends App implements IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executePostMessageSent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<void> {
        const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'message-count');
        const persis = read.getPersistenceReader();
        try {
            let count = 0;
            const record = await persis.readByAssociation(association);
            console.log(record);

            await persistence.createWithAssociation({ count: 0 }, association);

            console.log(`Message Sent Count: ${ count }`)
        } catch (err) {
            return this.getLogger().error(err);
        }
    }
}
