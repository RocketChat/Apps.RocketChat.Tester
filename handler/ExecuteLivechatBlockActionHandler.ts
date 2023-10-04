import {
	IModify,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { ILivechatRoom } from '@rocket.chat/apps-engine/definition/livechat';
import {
	IUIKitResponse,
	UIKitLivechatBlockInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import { UIKitIncomingInteractionContainerType } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionContainer';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { createLivechatMessage, deleteAllActionBlocks } from '../lib/Message';

export class ExecuteLivechatBlockActionHandler {
	constructor(
		private readonly app: IApp,
		private context: UIKitLivechatBlockInteractionContext,
		private read: IRead,
		private modify: IModify,
	) {}

	public async run(): Promise<IUIKitResponse> {
		try {
			const interactionData = this.context.getInteractionData();
			const {
				visitor,
				room,
				container: { id, type },
				value,
                message,
			} = interactionData;

            console.log('interactionData', message?.sender?.username);

			if (!value || !room) {
				// most likely, this button has a url to open. So we don't need to do anything here.
				return this.context.getInteractionResponder().successResponse();
			}

			if (type !== UIKitIncomingInteractionContainerType.MESSAGE) {
				return this.context.getInteractionResponder().successResponse();
			}

			const { servedBy: { username = null } = {}, id: rid } =
				room as ILivechatRoom;

			if (!username) {
				return this.context.getInteractionResponder().successResponse();
			}

			const appUser = (await this.read
				.getUserReader()
				.getAppUser()) as IUser;

            await createLivechatMessage(
                room,
                this.modify,
                { text: value },
                visitor,
            );

            const result = await deleteAllActionBlocks(this.modify, appUser, id);

			return this.context.getInteractionResponder().successResponse();
		} catch (error) {
			this.app.getLogger().error(error);
			return this.context.getInteractionResponder().errorResponse();
		}
	}
}
