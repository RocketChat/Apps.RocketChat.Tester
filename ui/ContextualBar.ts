import { IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

export function openContextualBar(modify: IModify) {
    const blocks = modify.getCreator().getBlockBuilder();

    const input = blocks.newPlainTextInputElement({
        placeholder: { text: 'Example Input', type: TextObjectType.PLAINTEXT },
    });
    const button = blocks.newButtonElement({
        text: { text: 'Example Button', type: TextObjectType.PLAINTEXT },
    });
    const select = blocks.newMultiStaticElement({
        placeholder: { text: 'Example Select', type: TextObjectType.PLAINTEXT },
        options: [
            { text: { text: 'Example 1', type: TextObjectType.PLAINTEXT }, value: 'Example 1' },
            { text: { text: 'Example 2', type: TextObjectType.PLAINTEXT }, value: 'Example 2' },
            { text: { text: 'Example 3', type: TextObjectType.PLAINTEXT }, value: 'Example 3' },
        ],
    });

    blocks.addActionsBlock({
        elements: [ input, button, select ],
    });

    const contextualBar: IUIKitContextualBarViewParam = {
        id: 'example-contextual-bar',
        blocks: blocks.getBlocks(),
        title: { text: 'Contextual Bar Example', type: TextObjectType.PLAINTEXT },
    };

    return contextualBar;
}
