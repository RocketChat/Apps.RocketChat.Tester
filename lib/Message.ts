import { IRead, IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { IVisitor } from "@rocket.chat/apps-engine/definition/livechat";
import { IMessageAttachment } from "@rocket.chat/apps-engine/definition/messages";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { BlockElementType, BlockType, IActionsBlock, IBlock } from "@rocket.chat/apps-engine/definition/uikit";
import { IUser } from "@rocket.chat/apps-engine/definition/users";


interface IMessageParam {
	text?: string;
	blocks?: IBlock[];
	attachment?: IMessageAttachment;
}

export const createLivechatMessage = async (
	room: IRoom,
	modify: IModify,
	message: IMessageParam,
	visitor: IVisitor,
): Promise<string | void> => {
	if (!message) {
		return;
	}

	const msg = modify
		.getCreator()
		.startLivechatMessage()
		.setRoom(room)
		.setVisitor(visitor);

	const { text, attachment } = message;

	if (text) {
		msg.setText(text);
	}

	if (attachment) {
		msg.addAttachment(attachment);
	}

	return modify.getCreator().finish(msg);
};


export const deleteAllActionBlocks = async (
	modify: IModify,
	appUser: IUser,
	msgId: string,
): Promise<void> => {
	const msgBuilder = await modify.getUpdater().message(msgId, appUser);

	const withoutActionBlocks: Array<IBlock> = msgBuilder
		.getBlocks()
		.filter(
			(block) =>
				!(
					block.type === BlockType.ACTIONS &&
					(block as IActionsBlock).elements.some(
						(element) => element.type === BlockElementType.BUTTON,
					)
				),
		);

	msgBuilder.setEditor(appUser).setBlocks(withoutActionBlocks);
	return modify.getUpdater().finish(msgBuilder);
};
