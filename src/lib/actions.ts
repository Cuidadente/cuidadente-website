import type { Action } from 'svelte/action';

/**
 * `use:reveal` — adds a scroll-triggered fade/rise-in.
 *
 * On mount this progressively enhances the element: it is hidden and animated
 * (via the `.reveal` / `.reveal-visible` classes) only in the client, so the
 * class is never present in the SSR'd HTML and content stays visible without
 * JS. The element fades/rises the first time it scrolls into view.
 *
 * Pass options via `use:reveal={{ delay: 120 }}` to stagger siblings.
 */
export const reveal: Action<HTMLElement, { delay?: number } | undefined> = (node, options = {}) => {
	node.classList.add('reveal');
	if (options.delay) node.style.transitionDelay = `${options.delay}ms`;

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('reveal-visible');
					// Clear the stagger delay once the entrance finishes.
					window.setTimeout(() => {
						node.style.transitionDelay = '';
					}, 900);
					io.disconnect();
				}
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -48px 0px' }
	);

	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
};
