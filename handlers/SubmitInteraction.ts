import {
    IRead,
    IHttp,
    IPersistence,
    IModify,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    UIKitViewSubmitInteractionContext,
    IUIKitResponse,
} from "@rocket.chat/apps-engine/definition/uikit";
import { modal } from "../ui/Modal";

export const executeViewSubmitHandler = async (
    context: UIKitViewSubmitInteractionContext,
    modify: IModify
): Promise<IUIKitResponse> => {
    const data = context.getInteractionData();

    const {
        view: { id: viewId, submit },
    } = data;

    const action = submit?.actionId;

    switch (action) {
        case "error": {
            return context.getInteractionResponder().viewErrorResponse({
                viewId,
                errors: {
                    "errors-test": "error value",
                },
            });
        }

        case "timeout": {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(
                        context.getInteractionResponder().successResponse()
                    );
                }, 60000);
            });
        }

        case "update": {
            return context
                .getInteractionResponder()
                .updateModalViewResponse(modal(action, modify));
        }

        default: {
            return context.getInteractionResponder().successResponse();
        }
    }
};
