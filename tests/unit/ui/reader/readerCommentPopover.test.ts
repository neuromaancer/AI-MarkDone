import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReaderCommentPopover } from '@/ui/content/reader/ReaderCommentPopover';
import { createAppearanceSnapshot } from '@/style/appearance';
import { annotationDraftsClient } from '@/drivers/shared/clients/annotationDraftsClient';
import type { AnnotationDraft, AnnotationDraftIdentity } from '@/contracts/annotationDrafts';

function createHost(): { host: HTMLElement; shadow: ShadowRoot; container: HTMLElement } {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    container.className = 'panel-window--reader';
    shadow.appendChild(container);
    Object.assign(container, {
        getBoundingClientRect: () => ({
            left: 20,
            top: 20,
            right: 620,
            bottom: 420,
            width: 600,
            height: 400,
            x: 20,
            y: 20,
            toJSON: () => ({}),
        }),
    });
    return { host, shadow, container };
}

describe('ReaderCommentPopover', () => {
    it('locks input and Save while Close waits for recovery acknowledgement and unlocks on failure', async () => {
        vi.spyOn(annotationDraftsClient, 'read').mockResolvedValue({ ok: true, data: { draft: null, revision: 0 } });
        let rejectWrite: (value: Awaited<ReturnType<typeof annotationDraftsClient.write>>) => void = () => undefined;
        vi.spyOn(annotationDraftsClient, 'write').mockImplementation(() => new Promise(resolve => { rejectWrite = resolve; }));
        const { shadow, container } = createHost(); const popover = new ReaderCommentPopover(); const onSave = vi.fn();
        popover.open({ shadow, container, appearance: createAppearanceSnapshot('light'), mode: 'create', selectedSource: 'Quote',
            draftIdentity: { documentKey: 'chatgpt:conversation:close-pending', assistantMessageId: 'assistant', selectionKey: 'selection' },
            anchorRect: { left: 180, top: 320, width: 120, height: 22, right: 300, bottom: 342 }, onSave });
        await Promise.resolve(); await Promise.resolve();
        const input = shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')!;
        input.value = 'Wait until this is retained'; input.dispatchEvent(new Event('input', { bubbles: true }));
        shadow.querySelector<HTMLButtonElement>('[data-action="close"]')!.click();
        await vi.waitFor(() => expect(annotationDraftsClient.write).toHaveBeenCalledOnce());
        expect(input.disabled).toBe(true);
        const save = shadow.querySelector<HTMLButtonElement>('[data-action="save"]')!;
        expect(save.disabled).toBe(true); save.click(); expect(onSave).not.toHaveBeenCalled();
        rejectWrite({ ok: false, errorCode: 'QUOTA_EXCEEDED', message: 'Full', failure: { kind: 'protocol', code: 'QUOTA_EXCEEDED', message: 'Full' } });
        await vi.waitFor(() => expect(input.disabled).toBe(false));
        expect(popover.isOpen()).toBe(true); expect(input.value).toBe('Wait until this is retained'); expect(save.disabled).toBe(false);
        popover.destroy();
    });
    it('does not hide a newer input version when only the older Close snapshot was acknowledged', async () => {
        vi.spyOn(annotationDraftsClient, 'read').mockResolvedValue({ ok: true, data: { draft: null, revision: 0 } });
        const acknowledge: Array<(value: Awaited<ReturnType<typeof annotationDraftsClient.write>>) => void> = [];
        vi.spyOn(annotationDraftsClient, 'write').mockImplementation(() => new Promise(resolve => { acknowledge.push(resolve); }));
        const { shadow, container } = createHost(); const popover = new ReaderCommentPopover();
        popover.open({ shadow, container, appearance: createAppearanceSnapshot('light'), mode: 'create', selectedSource: 'Quote',
            draftIdentity: { documentKey: 'chatgpt:conversation:close-latest-version', assistantMessageId: 'assistant', selectionKey: 'selection' },
            anchorRect: { left: 180, top: 320, width: 120, height: 22, right: 300, bottom: 342 }, onSave: vi.fn() });
        await Promise.resolve(); await Promise.resolve();
        const input = shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')!;
        input.value = 'Version A'; input.dispatchEvent(new Event('input', { bubbles: true })); shadow.querySelector<HTMLButtonElement>('[data-action="close"]')!.click();
        await vi.waitFor(() => expect(acknowledge).toHaveLength(1));
        // Simulate a late input source despite the disabled native input.
        input.value = 'Version B'; input.dispatchEvent(new Event('input', { bubbles: true }));
        acknowledge[0]!({ ok: true, data: { revision: 1 } });
        await vi.waitFor(() => expect(acknowledge).toHaveLength(2));
        expect(popover.isOpen()).toBe(true);
        acknowledge[1]!({ ok: false, errorCode: 'QUOTA_EXCEEDED', message: 'Full', failure: { kind: 'protocol', code: 'QUOTA_EXCEEDED', message: 'Full' } });
        await vi.waitFor(() => expect(input.disabled).toBe(false));
        expect(popover.isOpen()).toBe(true); expect(input.value).toBe('Version B'); popover.destroy();
    });
    it('restores an acknowledged local draft in a fresh editor instance', async () => {
        let stored: AnnotationDraft | null = null;
        const identity: AnnotationDraftIdentity = { documentKey: 'chatgpt:conversation:popover-reload', assistantMessageId: 'assistant', selectionKey: 'source/context/position' };
        vi.spyOn(annotationDraftsClient, 'read').mockImplementation(async () => ({ ok: true, data: { draft: stored, revision: stored?.revision ?? 0 } }));
        vi.spyOn(annotationDraftsClient, 'write').mockImplementation(async (_identity, text) => {
            stored = { identity, text, revision: 1, updatedAt: Date.now() }; return { ok: true, data: { revision: 1 } };
        });
        const { shadow, container } = createHost();
        const params = { shadow, container, appearance: createAppearanceSnapshot('light'), mode: 'create' as const, selectedSource: 'Quote', draftIdentity: identity,
            anchorRect: { left: 180, top: 320, width: 120, height: 22, right: 300, bottom: 342 }, onSave: vi.fn() };
        const first = new ReaderCommentPopover(); first.open(params); await Promise.resolve();
        const input = shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')!;
        input.value = 'Recover after refresh'; input.dispatchEvent(new Event('input', { bubbles: true }));
        shadow.querySelector<HTMLButtonElement>('[data-action="close"]')!.click(); await vi.waitFor(() => expect(first.isOpen()).toBe(false)); first.destroy();
        const next = new ReaderCommentPopover(); next.open(params);
        await vi.waitFor(() => expect(shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')!.value).toBe('Recover after refresh'));
        expect(params.onSave).not.toHaveBeenCalled(); next.destroy();
    });
    it('keeps the complete input open if local draft saving fails', async () => {
        vi.spyOn(annotationDraftsClient, 'read').mockResolvedValue({ ok: true, data: { draft: null, revision: 0 } });
        vi.spyOn(annotationDraftsClient, 'write').mockResolvedValue({ ok: false, errorCode: 'QUOTA_EXCEEDED', message: 'Full', failure: { kind: 'protocol', code: 'QUOTA_EXCEEDED', message: 'Full' } });
        const { shadow, container } = createHost(); const popover = new ReaderCommentPopover();
        popover.open({ shadow, container, appearance: createAppearanceSnapshot('light'), mode: 'create', selectedSource: 'Quote',
            draftIdentity: { documentKey: 'chatgpt:conversation:quota-popover', assistantMessageId: 'assistant', selectionKey: 'selection' },
            anchorRect: { left: 180, top: 320, width: 120, height: 22, right: 300, bottom: 342 }, onSave: vi.fn() });
        await Promise.resolve(); const input = shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')!;
        const text = 'Never trim this '.repeat(2000); input.value = text; input.dispatchEvent(new Event('input', { bubbles: true }));
        shadow.querySelector<HTMLButtonElement>('[data-action="close"]')!.click();
        await vi.waitFor(() => expect(shadow.querySelector<HTMLElement>('[data-role="draft-status"]')!.dataset.state).toBe('limit'));
        expect(popover.isOpen()).toBe(true); expect(input.value).toBe(text); expect(shadow.querySelector<HTMLButtonElement>('[data-action="retry-draft"]')!.hidden).toBe(false); popover.destroy();
    });
    it('keeps one input mounted through minimize and expand and clamps below a scrolled container top', () => {
        const { shadow, container } = createHost();
        container.getBoundingClientRect = () => new DOMRect(20, -300, 600, 900);
        const popover = new ReaderCommentPopover(); popover.open({ shadow, container, appearance: createAppearanceSnapshot('light'), mode: 'create', selectedSource: 'Quote', initialText: 'Keep text and caret',
            anchorRect: { left: 180, top: 50, width: 120, height: 22, right: 300, bottom: 72 }, onSave: vi.fn() });
        const input = shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')!; const surface = shadow.querySelector<HTMLElement>('.reader-comment-popover')!;
        expect(Number.parseFloat(surface.style.top)).toBeGreaterThanOrEqual(316);
        shadow.querySelector<HTMLButtonElement>('[data-action="minimize"]')!.click(); expect(surface.dataset.minimized).toBe('true');
        shadow.querySelector<HTMLButtonElement>('[data-action="expand"]')!.click(); expect(surface.dataset.expanded).toBe('true'); expect(surface.dataset.minimized).toBe('false');
        expect(shadow.querySelector('[data-role="input"]')).toBe(input); expect(input.value).toBe('Keep text and caret'); popover.destroy();
    });
    it('keeps unsaved annotation text when the reader is clicked outside the editor', () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        const onCancel = vi.fn();
        popover.open({
            shadow, container, appearance: createAppearanceSnapshot('light'),
            mode: 'create', selectedSource: 'Selected quote',
            anchorRect: { left: 180, top: 320, width: 120, height: 22, right: 300, bottom: 342 },
            onSave: vi.fn(), onCancel,
        });
        const input = shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')!;
        input.value = 'An unfinished thought';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        expect(popover.isOpen()).toBe(true);
        expect(input.value).toBe('An unfinished thought');
        expect(onCancel).not.toHaveBeenCalled();
        popover.destroy();
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('anchors above the supplied selection rect instead of centering in the reader shell', () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();

        popover.open({
            shadow,
            container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'create',
            initialText: '',
            selectedSource: 'Before `code` and $x+y$ after',
            anchorRect: {
                left: 180,
                top: 320,
                width: 120,
                height: 22,
                right: 300,
                bottom: 342,
            },
            labels: {},
            onSave: vi.fn(),
        } as any);

        const root = shadow.querySelector<HTMLElement>('.reader-comment-popover');
        expect(root).toBeTruthy();
        expect(root?.style.left).not.toBe('');
        expect(root?.dataset.side).toBe('top');
        expect(shadow.querySelector('.reader-comment-popover__close')?.className).toContain('icon-btn');
        expect(shadow.querySelector('[data-action="discard"]')?.className).toContain('secondary-btn');
        expect(shadow.querySelector('[data-action="save"]')?.className).toContain('secondary-btn--primary');
        expect(shadow.querySelector<HTMLElement>('.reader-comment-popover__shortcut')?.textContent)
            .toBe('Ctrl/Cmd + Enter to save');
        expect(shadow.querySelector<HTMLElement>('.reader-comment-popover__selection-value')?.textContent).toContain('Before `code` and $x+y$ after');
    });

    it('keeps Enter as newline and submits on Ctrl/Cmd+Enter without saving during composition', async () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        const onSave = vi.fn();

        popover.open({
            shadow,
            container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'create',
            initialText: 'seed',
            selectedSource: 'seed source',
            anchorRect: {
                left: 180,
                top: 320,
                width: 120,
                height: 22,
                right: 300,
                bottom: 342,
            },
            labels: {},
            onSave,
        } as any);

        const input = shadow.querySelector<HTMLTextAreaElement>('.reader-comment-popover__input');
        expect(input).toBeTruthy();
        expect(input!.getAttribute('aria-label')).toBe(input!.placeholder);

        input!.value = 'line 1';
        input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        expect(onSave).not.toHaveBeenCalled();
        input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true, cancelable: true }));
        expect(onSave).not.toHaveBeenCalled();

        input!.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true, cancelable: true }));
        expect(onSave).not.toHaveBeenCalled();
        input!.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));

        input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        expect(onSave).not.toHaveBeenCalled();

        input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', metaKey: true, bubbles: true, cancelable: true }));
        expect(onSave).toHaveBeenCalledWith('line 1');
        await Promise.resolve();
    });

    it('does not submit the same annotation twice while the first save is pending', async () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        let acknowledge: () => void = () => undefined;
        const onSave = vi.fn(() => new Promise<void>((resolve) => { acknowledge = resolve; }));
        popover.open({
            shadow, container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'create', initialText: 'One note', selectedSource: 'Selected quote',
            anchorRect: { left: 180, top: 320, width: 120, height: 22, right: 300, bottom: 342 },
            labels: {}, onSave,
        });

        shadow.querySelector<HTMLButtonElement>('[data-action="save"]')!.click();
        shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')!
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', metaKey: true, bubbles: true, cancelable: true }));
        expect(onSave).toHaveBeenCalledOnce();
        acknowledge();
        await vi.waitFor(() => expect(popover.isOpen()).toBe(false));
    });

    it('keeps deletion separate from discarding edits and requires explicit confirmation', async () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        const onDelete = vi.fn();
        const onCancel = vi.fn();

        popover.open({
            shadow,
            container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'edit',
            initialText: 'seed',
            selectedSource: 'seed source',
            anchorRect: {
                left: 180,
                top: 320,
                width: 120,
                height: 22,
                right: 300,
                bottom: 342,
            },
            labels: {},
            onSave: vi.fn(),
            onDelete,
            onCancel,
        } as any);

        const secondaryAction = shadow.querySelector<HTMLButtonElement>('[data-action="delete"]');
        expect(secondaryAction?.textContent).toBe('Delete');

        secondaryAction?.click();
        expect(onDelete).not.toHaveBeenCalled();
        shadow.querySelector<HTMLButtonElement>('[data-action="confirm-delete"]')!.click();
        expect(onDelete).toHaveBeenCalledTimes(1);
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('keeps the edit popover open until deletion is acknowledged', async () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        let acknowledge: () => void = () => undefined;
        const onDelete = vi.fn(() => new Promise<void>((resolve) => { acknowledge = resolve; }));
        popover.open({
            shadow, container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'edit', initialText: 'Keep this note', selectedSource: 'Selected quote',
            anchorRect: { left: 180, top: 320, width: 120, height: 22, right: 300, bottom: 342 },
            labels: {}, onSave: vi.fn(), onDelete,
        });

        shadow.querySelector<HTMLButtonElement>('[data-action="delete"]')!.click();
        shadow.querySelector<HTMLButtonElement>('[data-action="confirm-delete"]')!.click();
        expect(onDelete).toHaveBeenCalledOnce();
        expect(popover.isOpen()).toBe(true);
        expect(shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')!.disabled).toBe(true);
        expect(shadow.querySelector<HTMLButtonElement>('[data-action="save"]')!.disabled).toBe(true);
        expect(shadow.querySelector<HTMLButtonElement>('[data-action="discard"]')!.disabled).toBe(true);
        acknowledge();
        await vi.waitFor(() => expect(popover.isOpen()).toBe(false));
    });

    it('keeps the annotation and allows retry when deletion fails', async () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        const onDelete = vi.fn()
            .mockRejectedValueOnce(new Error('Storage unavailable'))
            .mockResolvedValueOnce(undefined);
        popover.open({
            shadow, container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'edit', initialText: 'Keep this note', selectedSource: 'Selected quote',
            anchorRect: { left: 180, top: 320, width: 120, height: 22, right: 300, bottom: 342 },
            labels: {}, onSave: vi.fn(), onDelete,
        });

        shadow.querySelector<HTMLButtonElement>('[data-action="delete"]')!.click();
        const deleteButton = shadow.querySelector<HTMLButtonElement>('[data-action="confirm-delete"]')!;
        deleteButton.click();
        await vi.waitFor(() => expect(deleteButton.disabled).toBe(false));
        expect(popover.isOpen()).toBe(true);
        expect(shadow.querySelector<HTMLTextAreaElement>('[data-role="input"]')?.value).toBe('Keep this note');
        deleteButton.click();
        await vi.waitFor(() => expect(popover.isOpen()).toBe(false));
        expect(onDelete).toHaveBeenCalledTimes(2);
    });

    it('allows outside reading and returns focus only after explicit close keeps the draft', async () => {
        const opener = document.createElement('button');
        document.body.appendChild(opener);
        opener.focus();
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        const onCancel = vi.fn();

        popover.open({
            shadow,
            container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'create',
            initialText: 'seed',
            selectedSource: 'seed source',
            anchorRect: {
                left: 180,
                top: 320,
                width: 120,
                height: 22,
                right: 300,
                bottom: 342,
            },
            labels: {},
            onSave: vi.fn(),
            onCancel,
        } as any);

        const surface = shadow.querySelector<HTMLElement>('.reader-comment-popover');
        expect(surface?.dataset.aimdSurfaceProfile).toBe('anchored');
        expect(surface?.dataset.aimdRole).toBe('reader-comment-popover');

        document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }));
        expect(popover.isOpen()).toBe(true);
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

        expect(onCancel).not.toHaveBeenCalled();
        expect(popover.isOpen()).toBe(true);
        shadow.querySelector<HTMLButtonElement>('[data-action="close"]')!.click();
        await vi.waitFor(() => expect(popover.isOpen()).toBe(false));
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(surface?.dataset.motionState).toBe('closing');

        surface?.dispatchEvent(new Event('animationend', { bubbles: true }));
        expect(document.activeElement).toBe(opener);
        expect(shadow.querySelector('.reader-comment-popover')).toBeNull();
    });

    it('keeps Escape inside an active IME composition and closes after composition ends', async () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        const onCancel = vi.fn();

        popover.open({
            shadow,
            container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'create',
            initialText: 'seed',
            selectedSource: 'seed source',
            anchorRect: {
                left: 180,
                top: 320,
                width: 120,
                height: 22,
                right: 300,
                bottom: 342,
            },
            labels: {},
            onSave: vi.fn(),
            onCancel,
        });

        const input = shadow.querySelector<HTMLTextAreaElement>('.reader-comment-popover__input')!;
        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        const composingEscape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        Object.defineProperty(composingEscape, 'isComposing', { value: false });
        input.dispatchEvent(composingEscape);
        expect(popover.isOpen()).toBe(true);
        expect(onCancel).not.toHaveBeenCalled();

        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
        const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        Object.defineProperty(escape, 'isComposing', { value: false });
        input.dispatchEvent(escape);
        await vi.waitFor(() => expect(popover.isOpen()).toBe(false));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('resets IME state between annotation sessions', async () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        const open = (onCancel: () => void) => popover.open({
            shadow,
            container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'create',
            initialText: 'seed',
            selectedSource: 'seed source',
            anchorRect: {
                left: 180,
                top: 320,
                width: 120,
                height: 22,
                right: 300,
                bottom: 342,
            },
            labels: {},
            onSave: vi.fn(),
            onCancel,
        });

        open(vi.fn());
        shadow.querySelector<HTMLTextAreaElement>('.reader-comment-popover__input')!
            .dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        popover.close(shadow, false);

        const onCancel = vi.fn();
        open(onCancel);
        const input = shadow.querySelector<HTMLTextAreaElement>('.reader-comment-popover__input')!;
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

        await vi.waitFor(() => expect(popover.isOpen()).toBe(false));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('updates active appearance and destroys all lifecycle work synchronously', () => {
        const { shadow, container } = createHost();
        const popover = new ReaderCommentPopover();
        const onCancel = vi.fn();

        popover.open({
            shadow,
            container,
            appearance: createAppearanceSnapshot('light'),
            mode: 'create',
            initialText: 'seed',
            selectedSource: 'seed source',
            anchorRect: {
                left: 180,
                top: 320,
                width: 120,
                height: 22,
                right: 300,
                bottom: 342,
            },
            labels: {},
            onSave: vi.fn(),
            onCancel,
        });

        popover.setAppearance(createAppearanceSnapshot('dark', { accentColor: '#2563eb' }));
        expect(shadow.querySelector('.reader-comment-popover')?.getAttribute('data-aimd-theme')).toBe('dark');

        popover.destroy();
        expect(popover.isOpen()).toBe(false);
        expect(shadow.querySelector('.reader-comment-popover')).toBeNull();

        document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }));
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        expect(onCancel).not.toHaveBeenCalled();
    });
});
