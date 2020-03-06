import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';
import { safeJsonParse } from '../lib/safeJsonParse';

export class SendMessageAsUserEndpoint extends ApiEndpoint {
    public path = 'send-message-as-user';

    // tslint:disable-next-line: max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const { roomId = 'GENERAL' } = safeJsonParse(request.content) || {};

        const room = await read.getRoomReader().getById(roomId);

        if (!room) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                content: `Room "${ roomId }" could not be found`,
            };
        }

        const { userId } = request.query;

        const user = await read.getUserReader().getById(userId);

        if (!user) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                content: `User with id "${userId}" could not be found`,
            };
        }

        const messageBuilder = modify.getCreator().startMessage()
            .setText('Executing send-message-as-user test endpoint')
            .setRoom(room)
            .setSender(user);

        const messageId = await modify.getCreator().finish(messageBuilder);

        return this.success(JSON.stringify({ messageId }));
    }
}
