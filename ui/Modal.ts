import { IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { IUIKitSurfaceViewParam } from "@rocket.chat/apps-engine/definition/accessors/IUIController";
import {
    BlockElementType,
    TextObjectType,
    UIKitSurfaceType,
} from "@rocket.chat/apps-engine/definition/uikit";

export function modal(
    actionId: string,
    modify: IModify
): IUIKitSurfaceViewParam {
    const block = modify.getCreator().getBlockBuilder();
    block.addInputBlock({
        blockId: "BLOCK_INPUT",
        element: block.newPlainTextInputElement({
            placeholder: block.newPlainTextObject(""),
            initialValue: "wrongInput",
        }),
        label: block.newPlainTextObject("Input"),
        optional: false,
    });

    return {
        type: UIKitSurfaceType.MODAL,
        title: {
            type: TextObjectType.PLAINTEXT,
            text: "title " + actionId + "d",
        },
        submit: {
            type: BlockElementType.BUTTON,
            text: {
                type: TextObjectType.PLAINTEXT,
                text: actionId,
            },
            actionId,
        },
        blocks: block.getBlocks(),
    };
}
