import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

type QueryParams = {
    token?: string;
    phone?: string;
    id?: string;
    email?: string;
}

export class QueryVisitorEndpoint extends ApiEndpoint {
    public path = 'query-visitor';

    // tslint:disable-next-line: max-line-length
    public async get(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const { token, phone, id, email } = request.query as QueryParams;


        if (token) {
            const visitor = await read.getLivechatReader().getLivechatVisitorByToken(token);
            if (visitor) {
                return this.json({
                    status: HttpStatusCode.OK,
                    content: {
                        visitor: visitor,
                    },
                })
            }
        } else if (phone) {
            const visitor = await read.getLivechatReader().getLivechatVisitorByPhoneNumber(phone);
            if (visitor) {
                return this.json({
                    status: HttpStatusCode.OK,
                    content: {
                        visitor: visitor,
                    },
                })
            }
        } else if (id) {
            const visitor = await read.getLivechatReader().getLivechatVisitorById(id);
            if (visitor) {
                return this.json({
                    status: HttpStatusCode.OK,
                    content: {
                        visitor: visitor,
                    },
                })
            }
        } else if (email) {
            const visitor = await read.getLivechatReader().getLivechatVisitorByEmail(email);
            if (visitor) {
                return this.json({
                    status: HttpStatusCode.OK,
                    content: {
                        visitor: visitor,
                    },
                })
            }
        }

        return this.json({
            status: HttpStatusCode.NOT_FOUND,
        });
    }
}
