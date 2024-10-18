import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_MY_CUSTOM = 'my-custom-view';

export class MyView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE_MY_CUSTOM;
  }

  getDisplayText(): string {
    return "My Custom View";
  }

  // Optional icon for the view tab
  getIcon(): string {
    return "document";  // You can use any Obsidian icon here
  }

  async onOpen() {
    // Add custom content here
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl('h1', { text: 'Hello, Obsidian!' });
    container.createEl('p', { text: 'This is a custom view in a new tab.' });
  }

  async onClose() {
    // Any cleanup when the view is closed
  }
}
