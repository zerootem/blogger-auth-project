import { render } from 'solid-js/web';
import { GoogleSourceFab } from '@/components/fab/GoogleSourceFab';
import '@/styles/fab.css';

function initFab() {
  let container = document.getElementById('modweeb-fab-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modweeb-fab-root';
    document.body.appendChild(container);
  }
  render(() => <GoogleSourceFab />, container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFab);
} else {
  initFab();
}
