import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';
import { IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { safeJsonParse } from '../lib/safeJsonParse';

export class CreateVisitorEndpoint extends ApiEndpoint {
    public path = 'create-visitor';

    // tslint:disable-next-line: max-line-length
    public async post(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const { visitor } = safeJsonParse(request.content) as { visitor: IVisitor };

        const visitorId = await modify.getCreator().getLivechatCreator().createVisitor(visitor);
        const createdVisitor = await read.getLivechatReader().getLivechatVisitorById(visitorId);

        return this.json({
            status: HttpStatusCode.OK,
            content: {
                visitor: createdVisitor,
            },
        });
    }
}
