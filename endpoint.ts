import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

export class Endpoint extends ApiEndpoint {
    public path = 'api';

    public async post(
        request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence,
    ): Promise<IApiResponse> {
        const body = Object.entries(request.content)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        const room = await read.getRoomReader().getByName('general');

        if (!room) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                content: `Room "#general" could not be found`,
            };
        }

        const messageBuilder = modify.getCreator().startMessage()
            .setText(body)
            .setRoom(room);
        const messageId = await modify.getCreator().finish(messageBuilder);

        return this.success(JSON.stringify({ messageId }));
    }
}
