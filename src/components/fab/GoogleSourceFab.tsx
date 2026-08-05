import { createSignal, onCleanup, onMount } from 'solid-js';

export function GoogleSourceFab() {
  const [isOpen, setIsOpen] = createSignal(true);
  const [hasClosed, setHasClosed] = createSignal(false);
  let closeTimer: ReturnType<typeof setTimeout>;

  const handleClose = () => {
    if (!hasClosed()) {
      setIsOpen(false);
      setHasClosed(true);
    }
  };

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    clearTimeout(closeTimer);
    window.open('https://google.com/preferences/source?q=modweeb.com', '_blank');
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const container = document.getElementById('modweebFabContainer');
    if (container && !container.contains(e.target as Node) && isOpen()) {
      clearTimeout(closeTimer);
      handleClose();
    }
  };

  onMount(() => {
    closeTimer = setTimeout(handleClose, 5000);
    document.addEventListener('click', handleOutsideClick);
  });

  onCleanup(() => {
    clearTimeout(closeTimer);
    document.removeEventListener('click', handleOutsideClick);
  });

  return (
    <div
      id="modweebFabContainer"
      class={`modtawrapper ${isOpen() ? 'is-open' : ''} ${hasClosed() && !isOpen() ? 'has-closed' : ''}`}
    >
      <button
        id="modweebFabToggle"
        type="button"
        class="modtabtn"
        aria-label="أضفنا كمصدر مفضل في جوجل"
        title="أضف كمصدر مفضل"
        onClick={handleClick}
      >
        <div class="modtaicwr">
          <svg
            class="modtasvgai"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g fill="currentColor">
              <path d="M314.262,288.662c-12.359,82.097-74.152,126.234-153.6,126.234C71.503,414.897,0,345.159,0,256 S71.503,97.103,160.662,97.103c43.255,0,81.214,12.359,108.579,38.841l-46.786,46.786c-15.007-15.89-37.076-23.834-61.793-23.834 c-52.966,0-98.869,44.138-98.869,97.103s45.903,97.103,98.869,97.103c44.138,0,77.683-28.248,87.393-70.621h-89.159V220.69h155.366 c1.766,10.593,2.648,23.834,2.648,35.31C316.91,267.476,316.028,278.069,314.262,288.662" />
              <polygon class="modtaplus" points="512,264.828 459.034,264.828 459.034,317.793 414.897,317.793 414.897,264.828 361.931,264.828 361.931,220.69 414.897,220.69 414.897,167.724 459.034,167.724 459.034,220.69 512,220.69" />
            </g>
          </svg>
        </div>
        <div class="modtafaco">
          <span class="modtaftwxt">أضفنا كمصدر مفضل في جوجل</span>
        </div>
      </button>
    </div>
  );
}
