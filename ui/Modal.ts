import { IModify } from "@rocket.chat/apps-engine/definition/accessors";
import {
    ButtonElement,
    InputBlock,
    PlainTextInputElement,
} from "@rocket.chat/ui-kit";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";

export function openModal(modify: IModify) {
    const inputBlock: InputBlock = {
        type: "input",
        label: { type: "plain_text", text: "Modal Input" },
        optional: false,
        element: {
            type: "plain_text_input",
            actionId: "modal_input",
        } as PlainTextInputElement,
    };

    const submitButton = {
        actionId: "submit",
        type: "button",
        text: {
            type: "plain_text",
            text: "Submit",
        },
    } as ButtonElement;

    const modal: IUIKitModalViewParam = {
        id: "modal_example",
        blocks: [inputBlock],
        title: {
            type: "plain_text",
            text: "Modal Example",
        },
        submit: submitButton,
    };

    return modal;
}
