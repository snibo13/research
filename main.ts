import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFolder, TFile, WorkspaceLeaf } from 'obsidian';
import { MyView } from './View';
// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	researchFolder: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	researchFolder: 'default'
}

interface PaperInterface {
	title: string;
	date: number;
	tags: string[];
	content: string;
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice("Check console!");
			console.log(this.settings.researchFolder);
			var contents: TFolder = this.app.vault.getFolderByPath(this.settings.researchFolder)!;
			var children: TFile[] = contents.children as TFile[];
			console.log(contents.children.length);
			let data: Map<Number, PaperInterface[]> = new Map();

			console.log(children[0]);

			children.forEach((child) => {

				let newPaper = {
					"title": child.basename,
					"date": child.stat.ctime,
					"tags": [],
					"content": child.basename
				}
				let key = Math.ceil(((child.stat.size) / 100_000 + 1) / 10) * 10;
				let value = data.get(key);
				if (value === undefined) {
					data.set(key, [newPaper]);
				}
				else {
					value.push(newPaper);
					data.set(key, value);
				}
			});
			console.log(data);

			// Perform additional things with the ribbon
			ribbonIconEl.addClass('my-plugin-ribbon-class');
		});

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();

			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

		// Register a new view type
		this.registerView(
			'my-custom-view',  // Unique view type identifier
			(leaf: WorkspaceLeaf) => new MyView(leaf)
		);

		// Command to open the new view in a tab
		this.addRibbonIcon('dice', 'Open My Custom View', () => {
			this.activateView();
		});
	}

	// Function to activate the view
	async activateView() {
		const leaf = this.app.workspace.getLeaf(true);
		await leaf.setViewState({
			type: 'my-custom-view', // Use the view type identifier
			active: true,
		});
		this.app.workspace.revealLeaf(leaf);
	}

	onunload() {
		this.app.workspace.detachLeavesOfType('my-custom-view');

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('folder')
			.setDesc('Research paper folder')
			.addText(text => text
				.setPlaceholder('/')
				.setValue(this.plugin.settings.researchFolder)
				.onChange(async (value) => {
					this.plugin.settings.researchFolder = value;
					await this.plugin.saveSettings();
				}));
	}
}
