if (!customElements.get('ak-product')) {
  customElements.define('ak-product', class extends HTMLElement {
    connectedCallback() {
      this.abort?.abort();
      this.abort = new AbortController();
      const options = { signal: this.abort.signal };
      this.classList.add('is-enhanced');
      const active = this.querySelector('[data-media][data-active]') || this.querySelector('[data-media]');
      if (active) this.showMedia(active.dataset.media);
      this.addEventListener('click', async (event) => {
        const quickAddButton = event.target.closest('[data-quick-add]');
        if (quickAddButton) {
          const status = quickAddButton.closest('.ak-bundle, .ak-related')?.querySelector('[role="status"]');
          const originalLabel = quickAddButton.getAttribute('aria-label');
          quickAddButton.disabled = true;
          quickAddButton.textContent = '…';
          if (status) status.textContent = '';
          try {
            const variantId = Number(quickAddButton.dataset.variantId);
            if (!Number.isSafeInteger(variantId) || variantId <= 0) {
              throw new Error('This product is not available right now.');
            }
            const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ id: variantId, quantity: 1 }),
            });
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.description || error.message || 'This product could not be added to your cart.');
            }
            if (status) status.textContent = `${originalLabel.replace(/^Add | to bag$/g, '')} added to your cart.`;
            quickAddButton.textContent = 'Added';
            quickAddButton.setAttribute('aria-label', originalLabel.replace(/^Add /, 'Added ').replace(/ to bag$/, ' to bag'));
          } catch (error) {
            if (status) status.textContent = error instanceof Error
              ? error.message
              : 'This product could not be added to your cart.';
            quickAddButton.disabled = false;
            quickAddButton.textContent = 'Add to bag';
            quickAddButton.setAttribute('aria-label', originalLabel);
          }
        }
        const thumbnail = event.target.closest('[data-show-media]');
        if (thumbnail) this.showMedia(thumbnail.dataset.showMedia);
        const stepper = event.target.closest('[data-quantity]');
        if (stepper) {
          const input = this.querySelector('[name="quantity"]');
          if (!Number.isFinite(input.valueAsNumber)) input.value = input.min || '1';
          if (Number(stepper.dataset.quantity) > 0) input.stepUp(); else input.stepDown();
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (event.target.closest('[data-copy-link]')) {
          const status = this.querySelector('.ak-feedback');
          try {
            await navigator.clipboard.writeText(window.location.href);
            status.textContent = 'Product link copied.';
          } catch { status.textContent = 'Copy the link from your browser address bar.'; }
        }
      }, options);
      this.querySelector('[data-variant-picker]')?.addEventListener('change', (event) => {
        if (!event.target.matches('[data-product-option]')) return;
        const picker = event.currentTarget;
        const optionValues = [...picker.querySelectorAll('.ak-option-selector')].map((group) => group.querySelector(':checked')?.value);
        const variants = JSON.parse(this.dataset.variants);
        const variant = variants.find((item) => item.options.length === optionValues.length && item.options.every((value, index) => value === optionValues[index]));
        const status = this.querySelector('.ak-feedback');
        if (!variant) {
          status.textContent = 'That combination is unavailable. Choose a different option.';
          const addButton = this.querySelector('.ak-buy-form [name="add"]');
          if (addButton) addButton.disabled = true;
          const expressButton = this.querySelector('.ak-express');
          if (expressButton) expressButton.hidden = true;
          return;
        }
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.location.assign(url.href);
      }, options);
    }
    disconnectedCallback() { this.abort?.abort(); }
    showMedia(id) {
      this.querySelectorAll('[data-media]').forEach((media) => {
        media.hidden = media.dataset.media !== id;
        if (media.hidden) {
          media.querySelectorAll('video').forEach((video) => video.pause());
          media.querySelectorAll('iframe').forEach((frame) => {
            // Reload embedded players when hidden so their audio stops.
            if (frame.dataset.wasVisible === 'true') frame.src = frame.src;
            frame.dataset.wasVisible = 'false';
          });
        } else media.querySelectorAll('iframe').forEach((frame) => { frame.dataset.wasVisible = 'true'; });
      });
      this.querySelectorAll('[data-show-media]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.showMedia === id)));
    }
  });
}
