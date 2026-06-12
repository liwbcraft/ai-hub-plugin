const { Plugin, ItemView, PluginSettingTab, Setting, Notice, Modal } = require('obsidian');

const VIEW_TYPE_AI_HUB = "ai-hub-view";

// ========== 国际化语言包 ==========
const LOCALES = {
    'zh-cn': {
        view_display_text: "AI 聚合",
        plugin_name: "AI 助手聚合",
        tab_refresh_current: "本页",
        tab_refresh_all: "全部",
        tab_stats_icon_tooltip: (total, popupCount) => `共 ${total} 个模型，其中 ${popupCount} 个需要弹窗打开`,
        popup_placeholder_text: (name) => `${name} 不允许被嵌入\n点击下方按钮在新窗口打开`,
        popup_placeholder_button: (name) => `🔗 打开 ${name}`,
        settings_title: "AI Hub Manager 设置",
        settings_default_tab: "默认 AI",
        settings_default_tab_desc: "打开插件时默认显示的 AI 助手",
        settings_show_tab_bar: "显示 Tab 栏",
        settings_show_tab_bar_desc: "是否显示顶部的 AI 切换栏",
        settings_model_management: "AI 模型管理",
        settings_drag_hint: "拖拽左侧的 ⋮⋮ 图标可以调整顺序，点击编辑按钮修改模型。",
        settings_add_model: "添加新模型",
        settings_model_name: "名称",
        settings_model_name_placeholder: "如: MiniMax",
        settings_model_icon: "图标",
        settings_model_icon_placeholder: "🎵",
        settings_model_url: "URL",
        settings_model_url_placeholder: "https://...",
        settings_model_popup: "需弹窗",
        settings_add_button: "➕ 添加",
        settings_model_list_title: "现有模型（拖拽调整顺序）",
        settings_edit: "编辑",
        settings_delete: "删除",
        settings_popup_status_popup: "🔗 需弹窗",
        settings_popup_status_embed: "✅ 可嵌入",
        settings_language: "语言",
        settings_language_desc: "选择界面语言",
        settings_language_zh: "中文",
        settings_language_en: "English",
        notice_fill_name_url: "请填写名称和 URL",
        notice_model_added: (name) => `已添加 ${name}`,
        notice_order_updated: "顺序已更新",
        notice_model_updated: (name) => `已更新 ${name}`,
        notice_model_deleted: (name) => `已删除 ${name}`,
        notice_delete_confirm: (name) => `确定要删除 ${name} 吗？`,
        modal_edit_title: "编辑模型",
        modal_name: "名称",
        modal_icon: "图标 (Emoji)",
        modal_url: "URL",
        modal_popup_label: "需要弹窗打开（网站禁止嵌入时勾选）",
        modal_save: "保存",
        modal_cancel: "取消",
        btn_refresh_current_title: "刷新当前 AI",
        btn_refresh_all_title: "刷新全部 AI",
    },
    'en': {
        view_display_text: "AI Hub Manager",
        plugin_name: "AI Assistant Hub",
        tab_refresh_current: "Current",
        tab_refresh_all: "All",
        tab_stats_icon_tooltip: (total, popupCount) => `${total} models total, ${popupCount} require popup`,
        popup_placeholder_text: (name) => `${name} cannot be embedded\nClick the button below to open in new window`,
        popup_placeholder_button: (name) => `🔗 Open ${name}`,
        settings_title: "AI Hub Manager Settings",
        settings_default_tab: "Default AI",
        settings_default_tab_desc: "Default AI assistant when opening the plugin",
        settings_show_tab_bar: "Show Tab Bar",
        settings_show_tab_bar_desc: "Whether to show the top AI switching bar",
        settings_model_management: "AI Model Management",
        settings_drag_hint: "Drag the ⋮⋮ icon to reorder, click edit button to modify.",
        settings_add_model: "Add New Model",
        settings_model_name: "Name",
        settings_model_name_placeholder: "e.g., MiniMax",
        settings_model_icon: "Icon",
        settings_model_icon_placeholder: "🎵",
        settings_model_url: "URL",
        settings_model_url_placeholder: "https://...",
        settings_model_popup: "Popup Required",
        settings_add_button: "➕ Add",
        settings_model_list_title: "Existing Models (Drag to reorder)",
        settings_edit: "Edit",
        settings_delete: "Delete",
        settings_popup_status_popup: "🔗 Popup",
        settings_popup_status_embed: "✅ Embed",
        settings_language: "Language",
        settings_language_desc: "Select interface language",
        settings_language_zh: "中文",
        settings_language_en: "English",
        notice_fill_name_url: "Please fill in name and URL",
        notice_model_added: (name) => `Added ${name}`,
        notice_order_updated: "Order updated",
        notice_model_updated: (name) => `Updated ${name}`,
        notice_model_deleted: (name) => `Deleted ${name}`,
        notice_delete_confirm: (name) => `Are you sure to delete ${name}?`,
        modal_edit_title: "Edit Model",
        modal_name: "Name",
        modal_icon: "Icon (Emoji)",
        modal_url: "URL",
        modal_popup_label: "Open in popup (check if website blocks embedding)",
        modal_save: "Save",
        modal_cancel: "Cancel",
        btn_refresh_current_title: "Refresh current AI",
        btn_refresh_all_title: "Refresh all AI",
    }
};

const DEFAULT_LOCALE = 'zh-cn';

function getLocale(lang) {
    return LOCALES[lang] || LOCALES[DEFAULT_LOCALE];
}

const DEFAULT_MODELS = [
    { id: 'chatgpt', name: 'ChatGPT', icon: '💬', url: 'https://chatgpt.com', popup: true },
    { id: 'deepseek', name: 'DeepSeek', icon: '🤖', url: 'https://chat.deepseek.com', popup: false },
    { id: 'tongyi', name: '通义千问', icon: '☁️', url: 'https://www.qianwen.com/?source=tongyigw', popup: false },
    { id: "yuanbao", name: "元宝", icon: "💰", url: "https://yuanbao.tencent.com", popup: false},
    { id: 'doubao', name: '豆包', icon: '🍡', url: 'https://www.doubao.com/chat', popup: false },
    { id: 'kimi', name: 'Kimi', icon: '🌙', url: 'https://kimi.moonshot.cn', popup: false },
	{ id: 'metaso', name: '秘塔搜索', icon: '🔍', url: 'https://metaso.cn', popup: false },
	{ id: 'xunfei', name: '讯飞星火', icon: '🔥', url: 'https://xinghuo.xfyun.cn/desk', popup: true },
    { id: 'gemini', name: 'Gemini', icon: '✨', url: 'https://gemini.google.com', popup: false },
    { id: 'baidu', name: '文心一言', icon: '🐻',url: 'https://yiyan.baidu.com', popup: false },
    { id: 'zhipu', name: '智谱清言', icon: '🔵', url: 'https://chatglm.cn/', popup: false },
    { id: 'sensechat', name: '商量SenseChat', icon: '🗣️', url: 'https://chat.sensetime.com', popup: false },
    { id: 'baichuan', name: '百小应', icon: '🐦', url: 'https://ying.baichuan-ai.com', popup: true },
    { id: 'step', name: '阶跃AI', icon: '⚡', url: 'https://stepfun.com', popup: false },
    { id: 'tiangong', name: '天工AI', icon: '🏔️', url: 'https://tiangong.cn', popup: true },
    { id: 'minimax', name: 'MiniMax', icon: '🪄', url: 'https://agent.minimaxi.com', popup: false },
    { id: 'copilot', name: 'Copilot', icon: '🪟', url: 'https://copilot.microsoft.com', popup: true },
    { id: 'lechat', name: 'Le Chat', icon: '🐓', url: 'https://chat.mistral.ai', popup: false },
    { id: 'huggingchat', name: 'HuggingChat', icon: '🤗', url: 'https://huggingface.co/chat', popup: false },
    { id: 'grok', name: 'Grok', icon: '🚀', url: 'https://grok.com', popup: false }
];

const DEFAULT_SETTINGS = {
    defaultTab: 'deepseek',
    showTabBar: true,
    models: DEFAULT_MODELS,
    locale: DEFAULT_LOCALE
};

class EditModelModal extends Modal {
    constructor(app, model, onSave, locale) {
        super(app);
        this.model = model;
        this.onSave = onSave;
        this.locale = locale;
        this.lang = getLocale(locale);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h3', { text: this.lang.modal_edit_title });

        contentEl.createEl('label', { text: this.lang.modal_name });
        const nameInput = contentEl.createEl('input', { value: this.model.name });
        nameInput.style.cssText = 'width: 100%; margin-bottom: 12px; margin-top: 4px; padding: 8px; border: 1px solid var(--background-modifier-border); border-radius: 6px; background: var(--background-primary);';

        contentEl.createEl('label', { text: this.lang.modal_icon });
        const iconInput = contentEl.createEl('input', { value: this.model.icon });
        iconInput.style.cssText = 'width: 100%; margin-bottom: 12px; margin-top: 4px; padding: 8px; border: 1px solid var(--background-modifier-border); border-radius: 6px; background: var(--background-primary);';

        contentEl.createEl('label', { text: this.lang.modal_url });
        const urlInput = contentEl.createEl('input', { value: this.model.url });
        urlInput.style.cssText = 'width: 100%; margin-bottom: 12px; margin-top: 4px; padding: 8px; border: 1px solid var(--background-modifier-border); border-radius: 6px; background: var(--background-primary);';

        const popupDiv = contentEl.createDiv();
        popupDiv.style.cssText = 'margin-bottom: 16px; display: flex; align-items: center; gap: 8px;';
        const popupCheckbox = popupDiv.createEl('input', { type: 'checkbox' });
        popupCheckbox.checked = this.model.popup;
        popupDiv.createEl('span', { text: this.lang.modal_popup_label });

        const buttonDiv = contentEl.createDiv();
        buttonDiv.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;';
        
        const saveBtn = buttonDiv.createEl('button', { text: this.lang.modal_save });
        saveBtn.style.cssText = 'padding: 6px 16px; background: var(--interactive-accent); color: white; border: none; border-radius: 6px; cursor: pointer;';
        saveBtn.addEventListener('click', async () => {
            this.model.name = nameInput.value;
            this.model.icon = iconInput.value || '🤖';
            this.model.url = urlInput.value;
            this.model.popup = popupCheckbox.checked;
            await this.onSave(this.model);
            this.close();
        });

        const cancelBtn = buttonDiv.createEl('button', { text: this.lang.modal_cancel });
        cancelBtn.style.cssText = 'padding: 6px 16px; background: var(--background-secondary); border: 1px solid var(--background-modifier-border); border-radius: 6px; cursor: pointer;';
        cancelBtn.addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class AIHubView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.currentTabId = '';
        this.models = [];
        this.loadModels();
        this.isDraggingScroll = false;
        this.startX = 0;
        this.scrollLeft = 0;
    }

    getViewType() {
        return VIEW_TYPE_AI_HUB;
    }

    getDisplayText() {
        const lang = getLocale(this.plugin.settings.locale);
        return lang.view_display_text;
    }

    getIcon() {
        return "bot";
    }

    loadModels() {
        this.models = this.plugin.settings.models || DEFAULT_MODELS;
        let lastTab = localStorage.getItem('ai-hub-last-tab');
        const lastTabExists = this.models.some(m => m.id === lastTab);
        if (lastTabExists) {
            this.currentTabId = lastTab;
        } else {
            const defaultTabExists = this.models.some(m => m.id === this.plugin.settings.defaultTab);
            this.currentTabId = defaultTabExists ? this.plugin.settings.defaultTab : (this.models[0]?.id || '');
        }
    }

    async onOpen() {
        this.containerEl_dom = this.containerEl.children[1];
        this.containerEl_dom.empty();
        this.containerEl_dom.style.display = 'flex';
        this.containerEl_dom.style.flexDirection = 'column';
        this.containerEl_dom.style.height = '100%';
        this.containerEl_dom.style.overflow = 'hidden';
        this.loadModels();
        this.render();
    }

    async onClose() {}

    render() {
        if (!this.containerEl_dom) return;
        
        while (this.containerEl_dom.firstChild) {
            this.containerEl_dom.removeChild(this.containerEl_dom.firstChild);
        }
        
        if (this.plugin.settings.showTabBar) {
            this.renderTabBar();
        }
        this.renderIframeContainer();
        this.renderIframes();
    }

    renderTabBar() {
        const lang = getLocale(this.plugin.settings.locale);
        
        this.tabBar = this.containerEl_dom.createDiv('ai-hub-tab-bar');
        this.tabBar.style.cssText = `
            display: flex;
            align-items: stretch;
            background: var(--background-secondary);
            border-bottom: 1px solid var(--background-modifier-border);
            min-height: 36px;
            flex-shrink: 0;
        `;

        // 左侧：可滑动的 Tab 区域（隐藏滚动条）
        const leftSection = this.tabBar.createDiv();
        leftSection.style.cssText = `
            flex: 1;
            display: flex;
            align-items: center;
            overflow-x: auto;
            overflow-y: hidden;
            gap: 2px;
            padding: 4px 0;
            scrollbar-width: none;
            -ms-overflow-style: none;
            cursor: grab;
        `;
        leftSection.classList.add('ai-hub-tab-scroll-area');
        
        // 隐藏 WebKit 滚动条
        const style = document.createElement('style');
        style.textContent = `
            .ai-hub-tab-scroll-area::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
        // 鼠标拖拽滚动功能
        leftSection.addEventListener('mousedown', (e) => {
            if (e.target !== leftSection && !e.target.classList.contains('ai-hub-tab-scroll-area')) {
                return;
            }
            this.isDraggingScroll = true;
            this.startX = e.pageX - leftSection.offsetLeft;
            this.scrollLeft = leftSection.scrollLeft;
            leftSection.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!this.isDraggingScroll) return;
            const x = e.pageX - leftSection.offsetLeft;
            const walk = (x - this.startX) * 1.5;
            leftSection.scrollLeft = this.scrollLeft - walk;
        });
        
        window.addEventListener('mouseup', () => {
            if (this.isDraggingScroll) {
                this.isDraggingScroll = false;
                leftSection.style.cursor = 'grab';
            }
        });
        
        // 鼠标滚轮横向滚动
        leftSection.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                leftSection.scrollLeft += e.deltaY;
            }
        });

        this.models.forEach((model) => {
            const btn = leftSection.createEl('button', {
                text: `${model.icon} ${model.name} ${model.popup ? '🔗' : ''}`,
                cls: 'ai-hub-tab-btn'
            });
            btn.style.cssText = `
                padding: 5px 10px;
                font-size: 11px;
                font-weight: 500;
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                color: var(--text-muted);
                border-radius: 4px 4px 0 0;
                transition: all 0.15s ease;
                white-space: nowrap;
                flex-shrink: 0;
                height: 28px;
                line-height: 1;
            `;
            if (model.id === this.currentTabId) {
                btn.style.color = 'var(--text-accent)';
                btn.style.borderBottomColor = 'var(--text-accent)';
            }
            if (model.popup && model.id !== this.currentTabId) {
                btn.style.background = 'rgba(100, 108, 255, 0.1)';
            }
            btn.addEventListener('mouseenter', () => {
                if (model.id !== this.currentTabId) {
                    btn.style.background = 'var(--background-modifier-hover)';
                }
            });
            btn.addEventListener('mouseleave', () => {
                if (model.id !== this.currentTabId) {
                    if (model.popup) {
                        btn.style.background = 'rgba(100, 108, 255, 0.1)';
                    } else {
                        btn.style.background = 'none';
                    }
                }
            });
            btn.addEventListener('click', () => this.switchTab(model.id));
        });

        // 右侧：按钮组 - 贴着右边框
        const rightSection = this.tabBar.createDiv();
        rightSection.style.cssText = `
            display: flex;
            align-items: center;
            gap: 2px;
            flex-shrink: 0;
            background: var(--background-secondary);
            padding: 0 0 0 8px;
            margin-right: 0;
            height: 100%;
        `;
        rightSection.classList.add('ai-hub-tab-bar-right');

        const popupCount = this.models.filter(m => m.popup).length;
        const statsBtn = rightSection.createEl('button');
        statsBtn.innerHTML = `📊`;
        statsBtn.style.cssText = `
            padding: 5px 10px;
            font-size: 11px;
            font-weight: 500;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            color: var(--text-muted);
            border-radius: 4px 4px 0 0;
            transition: all 0.15s ease;
            white-space: nowrap;
            height: 28px;
            line-height: 1;
            display: flex;
            align-items: center;
        `;
        statsBtn.setAttribute('aria-label', lang.tab_stats_icon_tooltip(this.models.length, popupCount));
        statsBtn.setAttribute('aria-label-position', 'bottom');
        statsBtn.addEventListener('mouseenter', () => {
            statsBtn.style.background = 'var(--background-modifier-hover)';
            statsBtn.style.borderBottomColor = 'var(--text-accent)';
        });
        statsBtn.addEventListener('mouseleave', () => {
            statsBtn.style.background = '';
            statsBtn.style.borderBottomColor = 'transparent';
        });

        const refreshCurrentBtn = rightSection.createEl('button');
        refreshCurrentBtn.innerHTML = `🔄 ${lang.tab_refresh_current}`;
        refreshCurrentBtn.style.cssText = `
            padding: 5px 10px;
            font-size: 11px;
            font-weight: 500;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            color: var(--text-muted);
            border-radius: 4px 4px 0 0;
            transition: all 0.15s ease;
            white-space: nowrap;
            height: 28px;
            line-height: 1;
            display: flex;
            align-items: center;
        `;
        refreshCurrentBtn.setAttribute('aria-label', lang.btn_refresh_current_title);
        refreshCurrentBtn.addEventListener('mouseenter', () => {
            refreshCurrentBtn.style.background = 'var(--background-modifier-hover)';
            refreshCurrentBtn.style.borderBottomColor = 'var(--text-accent)';
        });
        refreshCurrentBtn.addEventListener('mouseleave', () => {
            refreshCurrentBtn.style.background = '';
            refreshCurrentBtn.style.borderBottomColor = 'transparent';
        });
        refreshCurrentBtn.addEventListener('click', () => this.reloadCurrent());

        const refreshAllBtn = rightSection.createEl('button');
        refreshAllBtn.innerHTML = `🔁 ${lang.tab_refresh_all}`;
        refreshAllBtn.style.cssText = `
            padding: 5px 10px;
            font-size: 11px;
            font-weight: 500;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            color: var(--text-muted);
            border-radius: 4px 4px 0 0;
            transition: all 0.15s ease;
            white-space: nowrap;
            height: 28px;
            line-height: 1;
            display: flex;
            align-items: center;
        `;
        refreshAllBtn.setAttribute('aria-label', lang.btn_refresh_all_title);
        refreshAllBtn.addEventListener('mouseenter', () => {
            refreshAllBtn.style.background = 'var(--background-modifier-hover)';
            refreshAllBtn.style.borderBottomColor = 'var(--text-accent)';
        });
        refreshAllBtn.addEventListener('mouseleave', () => {
            refreshAllBtn.style.background = '';
            refreshAllBtn.style.borderBottomColor = 'transparent';
        });
        refreshAllBtn.addEventListener('click', () => this.reloadAll());
    }

    renderIframeContainer() {
        this.iframeContainer = this.containerEl_dom.createDiv('ai-hub-iframe-container');
        this.iframeContainer.style.cssText = `
            flex: 1;
            position: relative;
            background: var(--background-primary);
        `;
    }

    renderIframes() {
        const lang = getLocale(this.plugin.settings.locale);
        
        if (!this.iframeContainer) return;

        this.models.forEach((model) => {
            const wrapper = this.iframeContainer.createDiv('ai-hub-iframe-wrapper');
            wrapper.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: none;
                background: var(--background-primary);
            `;
            if (model.id === this.currentTabId) wrapper.style.display = 'block';

            if (model.popup) {
                const placeholder = wrapper.createDiv();
                placeholder.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                    padding: 40px;
                `;
                const iconEl = placeholder.createDiv({ text: model.icon });
                iconEl.style.fontSize = '48px';
                iconEl.style.marginBottom = '16px';
                const text = placeholder.createEl('p', { text: lang.popup_placeholder_text(model.name) });
                text.style.cssText = 'margin: 16px 0; color: var(--text-muted); font-size: 14px; white-space: pre-line;';
                const openBtn = placeholder.createEl('button', { text: lang.popup_placeholder_button(model.name) });
                openBtn.style.cssText = 'padding: 8px 24px; background: var(--interactive-accent); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;';
                openBtn.addEventListener('click', () => {
                    window.open(model.url, '_blank');
                });
            } else {
                const iframe = wrapper.createEl('iframe');
                iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: #fff;';
                if (model.id === this.currentTabId) {
                    iframe.src = model.url;
                } else {
                    wrapper.setAttribute('data-url', model.url);
                }
            }
        });
    }

    switchTab(tabId) {
        this.currentTabId = tabId;
        localStorage.setItem('ai-hub-last-tab', tabId);

        const leftSection = this.tabBar?.querySelector('.ai-hub-tab-scroll-area');
        const btns = leftSection?.querySelectorAll('button');
        btns?.forEach((btn, idx) => {
            const model = this.models[idx];
            if (model && model.id === tabId) {
                btn.style.color = 'var(--text-accent)';
                btn.style.borderBottomColor = 'var(--text-accent)';
            } else {
                btn.style.color = 'var(--text-muted)';
                btn.style.borderBottomColor = 'transparent';
                if (model && model.popup) {
                    btn.style.background = 'rgba(100, 108, 255, 0.1)';
                } else {
                    btn.style.background = 'none';
                }
            }
        });

        const wrappers = this.iframeContainer?.querySelectorAll('.ai-hub-iframe-wrapper');
        wrappers?.forEach((wrapper, idx) => {
            const model = this.models[idx];
            if (model && model.id === tabId) {
                wrapper.style.display = 'block';
                if (!model.popup) {
                    const iframe = wrapper.querySelector('iframe');
                    if (iframe && !iframe.src) {
                        iframe.src = model.url;
                    }
                }
            } else {
                wrapper.style.display = 'none';
            }
        });
    }

    reloadCurrent() {
        const wrappers = this.iframeContainer?.querySelectorAll('.ai-hub-iframe-wrapper');
        if (!wrappers) return;
        for (const wrapper of wrappers) {
            if (wrapper.style.display === 'block') {
                const iframe = wrapper.querySelector('iframe');
                if (iframe && iframe.src && iframe.src !== 'about:blank') {
                    const src = iframe.src;
                    iframe.src = 'about:blank';
                    setTimeout(() => { iframe.src = src; }, 100);
                }
                break;
            }
        }
    }

    reloadAll() {
        const iframes = this.iframeContainer?.querySelectorAll('iframe');
        if (!iframes) return;
        iframes.forEach((iframe) => {
            if (iframe.src && iframe.src !== 'about:blank') {
                const src = iframe.src;
                iframe.src = 'about:blank';
                setTimeout(() => { iframe.src = src; }, 100);
            }
        });
    }

    refresh() {
        this.loadModels();
        const tabExists = this.models.some(m => m.id === this.currentTabId);
        if (!tabExists && this.models.length > 0) {
            const defaultTabExists = this.models.some(m => m.id === this.plugin.settings.defaultTab);
            this.currentTabId = defaultTabExists ? this.plugin.settings.defaultTab : this.models[0].id;
            localStorage.setItem('ai-hub-last-tab', this.currentTabId);
        }
        this.render();
    }
}

class AIHubSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        
        const lang = getLocale(this.plugin.settings.locale);

        containerEl.createEl('h3', { text: lang.settings_title });

        new Setting(containerEl)
            .setName(lang.settings_language)
            .setDesc(lang.settings_language_desc)
            .addDropdown(dropdown => {
                dropdown.addOption('zh-cn', '中文');
                dropdown.addOption('en', 'English');
                dropdown.setValue(this.plugin.settings.locale);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.locale = value;
                    await this.plugin.saveSettings();
                    this.display();
                    this.plugin.refreshViews();
                });
            });

        containerEl.createEl('hr');

        new Setting(containerEl)
            .setName(lang.settings_default_tab)
            .setDesc(lang.settings_default_tab_desc)
            .addDropdown(dropdown => {
                this.plugin.settings.models.forEach(model => {
                    dropdown.addOption(model.id, `${model.icon} ${model.name}`);
                });
                dropdown.setValue(this.plugin.settings.defaultTab);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.defaultTab = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName(lang.settings_show_tab_bar)
            .setDesc(lang.settings_show_tab_bar_desc)
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.showTabBar);
                toggle.onChange(async (value) => {
                    this.plugin.settings.showTabBar = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshViews();
                });
            });

        containerEl.createEl('hr');
        containerEl.createEl('h4', { text: lang.settings_model_management });
        containerEl.createEl('p', { text: lang.settings_drag_hint, cls: 'setting-item-description' });

        containerEl.createEl('h5', { text: lang.settings_add_model });
        
        const addForm = containerEl.createDiv();
        addForm.style.cssText = 'display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; align-items: flex-end;';
        
        const nameWrapper = addForm.createDiv();
        nameWrapper.style.cssText = 'flex: 1; min-width: 120px;';
        nameWrapper.createEl('label', { text: lang.settings_model_name }).style.cssText = 'font-size: 11px; display: block; margin-bottom: 4px; color: var(--text-muted);';
        const nameInput = nameWrapper.createEl('input', { placeholder: lang.settings_model_name_placeholder });
        nameInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid var(--background-modifier-border); border-radius: 6px; background: var(--background-primary);';
        
        const iconWrapper = addForm.createDiv();
        iconWrapper.style.cssText = 'width: 80px;';
        iconWrapper.createEl('label', { text: lang.settings_model_icon }).style.cssText = 'font-size: 11px; display: block; margin-bottom: 4px; color: var(--text-muted);';
        const iconInput = iconWrapper.createEl('input', { placeholder: lang.settings_model_icon_placeholder });
        iconInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid var(--background-modifier-border); border-radius: 6px; background: var(--background-primary); text-align: center;';
        
        const urlWrapper = addForm.createDiv();
        urlWrapper.style.cssText = 'flex: 2; min-width: 250px;';
        urlWrapper.createEl('label', { text: lang.settings_model_url }).style.cssText = 'font-size: 11px; display: block; margin-bottom: 4px; color: var(--text-muted);';
        const urlInput = urlWrapper.createEl('input', { placeholder: lang.settings_model_url_placeholder });
        urlInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid var(--background-modifier-border); border-radius: 6px; background: var(--background-primary);';
        
        const popupWrapper = addForm.createDiv();
        popupWrapper.style.cssText = 'display: flex; align-items: center; gap: 8px; padding-bottom: 8px;';
        const popupCheckbox = popupWrapper.createEl('input', { type: 'checkbox' });
        const popupLabel = popupWrapper.createEl('span', { text: lang.settings_model_popup });
        popupLabel.style.cssText = 'font-size: 12px;';
        
        const addBtn = addForm.createEl('button', { text: lang.settings_add_button });
        addBtn.style.cssText = 'padding: 8px 16px; background: var(--interactive-accent); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; height: 38px;';
        
        addBtn.addEventListener('click', async () => {
            const currentLang = getLocale(this.plugin.settings.locale);
            const name = nameInput.value.trim();
            const icon = iconInput.value.trim();
            const url = urlInput.value.trim();
            const popup = popupCheckbox.checked;
            
            if (!name || !url) {
                new Notice(currentLang.notice_fill_name_url);
                return;
            }
            
            const id = name.toLowerCase().replace(/\s/g, '-') + '-' + Date.now();
            
            const newModel = { id, name, icon: icon || '🤖', url, popup };
            this.plugin.settings.models.push(newModel);
            await this.plugin.saveSettings();
            
            nameInput.value = '';
            iconInput.value = '';
            urlInput.value = '';
            popupCheckbox.checked = false;
            
            new Notice(currentLang.notice_model_added(name));
            this.display();
        });

        containerEl.createEl('hr');

        containerEl.createEl('h5', { text: lang.settings_model_list_title });
        
        const modelList = containerEl.createDiv();
        modelList.style.cssText = 'max-height: 500px; overflow-y: auto; border: 1px solid var(--background-modifier-border); border-radius: 8px; background: var(--background-primary);';
        
        this.renderModelList(modelList);
    }

    renderModelList(container) {
        container.empty();
        const lang = getLocale(this.plugin.settings.locale);
        
        this.plugin.settings.models.forEach((model, index) => {
            const item = container.createDiv();
            item.setAttribute('data-index', index);
            item.setAttribute('data-id', model.id);
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                border-bottom: 1px solid var(--background-modifier-border);
                background: var(--background-primary);
            `;
            if (index === this.plugin.settings.models.length - 1) {
                item.style.borderBottom = 'none';
            }
            
            const dragHandle = item.createDiv();
            dragHandle.innerHTML = '⋮⋮';
            dragHandle.style.cssText = `
                font-size: 18px;
                color: var(--text-muted);
                cursor: grab;
                user-select: none;
                width: 24px;
                text-align: center;
            `;
            dragHandle.setAttribute('aria-label', '拖拽调整顺序');
            
            let isDragging = false;
            dragHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isDragging = true;
                dragHandle.style.cursor = 'grabbing';
                item.style.opacity = '0.5';
                
                const handleMouseMove = (moveEvent) => {
                    if (!isDragging) return;
                    const targetElement = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
                    const targetItem = targetElement?.closest('[data-index]');
                    if (targetItem && targetItem !== item) {
                        const targetIndex = parseInt(targetItem.getAttribute('data-index'));
                        const currentIndex = parseInt(item.getAttribute('data-index'));
                        
                        if (currentIndex < targetIndex) {
                            targetItem.parentNode.insertBefore(item, targetItem.nextSibling);
                        } else {
                            targetItem.parentNode.insertBefore(item, targetItem);
                        }
                        
                        const items = container.querySelectorAll('[data-index]');
                        items.forEach((it, idx) => {
                            it.setAttribute('data-index', idx);
                        });
                    }
                };
                
                const handleMouseUp = async () => {
                    isDragging = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    dragHandle.style.cursor = '';
                    item.style.opacity = '';
                    
                    const newOrder = [];
                    const items = container.querySelectorAll('[data-id]');
                    items.forEach(it => {
                        const id = it.getAttribute('data-id');
                        const foundModel = this.plugin.settings.models.find(m => m.id === id);
                        if (foundModel) newOrder.push(foundModel);
                    });
                    
                    if (newOrder.length === this.plugin.settings.models.length) {
                        this.plugin.settings.models = newOrder;
                        await this.plugin.saveSettings();
                        new Notice(getLocale(this.plugin.settings.locale).notice_order_updated);
                    }
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });
            
            const info = item.createDiv();
            info.style.cssText = 'flex: 1;';
            info.innerHTML = `<span style="font-size: 1.2rem;">${model.icon}</span> <strong>${model.name}</strong><br><span style="font-size: 10px; color: var(--text-muted);">${model.url.substring(0, 60)}${model.url.length > 60 ? '...' : ''}</span>`;
            
            const status = item.createDiv();
            status.style.cssText = 'font-size: 11px; width: 80px;';
            status.innerHTML = model.popup ? lang.settings_popup_status_popup : lang.settings_popup_status_embed;
            
            const editBtn = item.createEl('button', { text: `✏️ ${lang.settings_edit}` });
            editBtn.style.cssText = 'padding: 4px 10px; font-size: 11px; cursor: pointer; background: var(--interactive-normal); border: 1px solid var(--background-modifier-border); border-radius: 6px;';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                new EditModelModal(this.app, { ...model }, async (updatedModel) => {
                    this.plugin.settings.models[index] = updatedModel;
                    await this.plugin.saveSettings();
                    new Notice(getLocale(this.plugin.settings.locale).notice_model_updated(updatedModel.name));
                    this.display();
                }, this.plugin.settings.locale).open();
            });
            
            const deleteBtn = item.createEl('button', { text: `🗑️ ${lang.settings_delete}` });
            deleteBtn.style.cssText = 'padding: 4px 8px; font-size: 11px; cursor: pointer; background: var(--interactive-normal); border: 1px solid var(--background-modifier-border); border-radius: 6px;';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const currentLang = getLocale(this.plugin.settings.locale);
                if (confirm(currentLang.notice_delete_confirm(model.name))) {
                    this.plugin.settings.models.splice(index, 1);
                    if (this.plugin.settings.defaultTab === model.id && this.plugin.settings.models.length > 0) {
                        this.plugin.settings.defaultTab = this.plugin.settings.models[0].id;
                    }
                    await this.plugin.saveSettings();
                    new Notice(currentLang.notice_model_deleted(model.name));
                    this.display();
                }
            });
        });
    }
}

class AIHubPlugin extends Plugin {
    async onload() {
        await this.loadSettings();

        this.registerView(VIEW_TYPE_AI_HUB, (leaf) => new AIHubView(leaf, this));

        this.addRibbonIcon('bot', this.getPluginName(), () => {
            this.activateView();
        });

        this.addCommand({
            id: 'open-ai-hub',
            name: '打开 AI Hub Manager',
            callback: () => {
                this.activateView();
            }
        });

        this.addSettingTab(new AIHubSettingTab(this.app, this));
    }
    
    getPluginName() {
        const lang = getLocale(this.settings.locale);
        return lang.plugin_name;
    }
    
    updateRibbonTooltip() {
        const ribbonIcons = document.querySelectorAll('.workspace-ribbon .side-dock-actions .clickable-icon');
        ribbonIcons.forEach(icon => {
            const svg = icon.querySelector('svg');
            if (svg && svg.innerHTML.includes('bot')) {
                icon.setAttribute('aria-label', this.getPluginName());
            }
        });
    }
    
    async activateView() {
        const { workspace } = this.app;
        
        let leaf = workspace.getLeavesOfType(VIEW_TYPE_AI_HUB)[0];
        
        if (!leaf) {
            leaf = workspace.getLeaf('tab');
            await leaf.setViewState({ type: VIEW_TYPE_AI_HUB, active: true });
        }
        
        workspace.revealLeaf(leaf);
    }
    
    refreshViews() {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_AI_HUB);
        leaves.forEach(leaf => {
            if (leaf.view instanceof AIHubView) {
                leaf.view.refresh();
            }
        });
        this.updateRibbonTooltip();
    }

    async loadSettings() {
        const loadedData = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
        if (!this.settings.models || this.settings.models.length === 0) {
            this.settings.models = DEFAULT_MODELS;
        }
        if (!this.settings.locale) {
            this.settings.locale = DEFAULT_LOCALE;
        }
        const defaultTabExists = this.settings.models.some(m => m.id === this.settings.defaultTab);
        if (!defaultTabExists && this.settings.models.length > 0) {
            this.settings.defaultTab = this.settings.models[0].id;
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.refreshViews();
    }
}

module.exports = AIHubPlugin;