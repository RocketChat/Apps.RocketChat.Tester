import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

export class SendMessageAsAppUserEndpoint extends ApiEndpoint {
    public path = 'send-message-as-app-user';

    // tslint:disable-next-line:max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const room = await read.getRoomReader().getById('GENERAL');

        if (!room) {
            return {
                status: 404,
                content: `Room '#general' hasn't been found`,
            };
        }

        const messageBuilder = modify.getCreator().startMessage()
            .setText('Executing send-message-as-app-user test endpoint')
            .setRoom(room);

        await modify.getCreator().finish(messageBuilder);

        return this.success();
    }
}
