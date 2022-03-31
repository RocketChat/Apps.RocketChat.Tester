import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';
import { IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { safeJsonParse } from '../lib/safeJsonParse';

export class CreateVisitorEndpoint extends ApiEndpoint {
    public path = 'get-omnichannel-room-for-visitor';

    // tslint:disable-next-line: max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const { visitor, departmentId } = safeJsonParse(request.content) as { visitor: IVisitor, departmentId?: string };

        const rooms = await read.getLivechatReader().getLivechatRooms(visitor, departmentId);

        return this.json({
            status: HttpStatusCode.OK,
            content: {
                rooms,
            },
        });
    }
}
