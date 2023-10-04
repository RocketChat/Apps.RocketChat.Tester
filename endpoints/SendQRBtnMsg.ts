import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

export class SendQRBtnMsgEndpoint extends ApiEndpoint {
    public path = 'send-quick-reply-button-message';

    public async get(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
        const { userId, roomId } = request.query;

        const room = await read.getRoomReader().getById(roomId);

        if (!room) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                content: `Room "${ roomId }" could not be found`,
            };
        }


        const user = await read.getUserReader().getById(userId);
        if (!user) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                content: `User with id "${userId}" could not be found`,
            };
        }

        const text = 'This is a main message within Quick Reply Button Message';

        const blocks = modify.getCreator().getBlockBuilder();
        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(text),
        });
        blocks.addActionsBlock({
            elements: Array.from({ length: 5 }, (_, i) => blocks.newButtonElement({
                actionId: `button-${i}`,
                text: blocks.newPlainTextObject(`Button ${i}`),
                value: `button-${i}`,
            })),
        });

        const messageBuilder = modify.getCreator().startMessage()
            .setRoom(room)
            .setSender(user)
            .setBlocks(blocks);

        const messageId = await modify.getCreator().finish(messageBuilder);
        return this.success(JSON.stringify({ messageId }));
    }
}
