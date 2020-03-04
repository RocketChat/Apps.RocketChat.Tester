import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

const safeJsonParse = (json: any) => {
    if (typeof json !== 'string') { return json; }

    try { return JSON.parse(json); } catch { return undefined; }
};

/**
 * This is a test case as well as a showcase of how to do things with the Apps-Engine.
 *
 *
 */
export class SendMessageAsAppUserEndpoint extends ApiEndpoint {
    public path = 'send-message-as-app-user';

    // tslint:disable-next-line:max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const { roomId = 'GENERAL' } = safeJsonParse(request.content) || {};

        const room = await read.getRoomReader().getById(roomId);

        if (!room) {
            return {
                status: 404,
                content: `Room "${ roomId }" could not be found`,
            };
        }

        const messageBuilder = modify.getCreator().startMessage()
            .setText('Executing send-message-as-app-user test endpoint')
            .setRoom(room);

        const messageId = await modify.getCreator().finish(messageBuilder);

        return this.success(JSON.stringify({ messageId }));
    }
}
