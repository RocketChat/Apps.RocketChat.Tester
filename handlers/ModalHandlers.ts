import { UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { IUIKitViewSubmitIncomingInteraction } from "@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes";

const validation = (data: IUIKitViewSubmitIncomingInteraction) => {
    const state = data.view.state as { default?: { modal_input: string } };

    if (!state?.default?.modal_input) {
        return false;
    }

    return true;
};

export const ModalViewSubmitHandler = (
    interactionContext: UIKitViewSubmitInteractionContext
) => {
    if (validation(interactionContext.getInteractionData())) {
        return interactionContext.getInteractionResponder().successResponse();
    } else {
        return interactionContext.getInteractionResponder().viewErrorResponse({
            viewId: interactionContext.getInteractionData().view.id,
            errors: { modal_input: "Validation failed" },
        });
    }
};
