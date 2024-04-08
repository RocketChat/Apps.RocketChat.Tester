import { UIKitActionButtonInteractionContext } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionContext";
import { modal } from "../ui/Modal";
import { IModify } from "@rocket.chat/apps-engine/definition/accessors";

export const executeActionButtonHandler = async (
    context: UIKitActionButtonInteractionContext,
    modify: IModify
) => {
    const data = context.getInteractionData();
    const { actionId, user, triggerId } = data;

    await modify
        .getUiController()
        .openSurfaceView(modal(actionId, modify), { triggerId }, user);

    return context.getInteractionResponder().successResponse();
};
