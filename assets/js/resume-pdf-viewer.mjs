import {
  AnnotationLayer,
  GlobalWorkerOptions,
  RenderingCancelledException,
  TextLayer,
  getDocument
} from '../vendor/pdfjs/6.2.108/pdf.mjs';

GlobalWorkerOptions.workerSrc = new URL(
  '../vendor/pdfjs/6.2.108/pdf.worker.mjs',
  import.meta.url
).href;

const renderStates = new WeakMap();
let renderSequence = 0;

const linkLabels = new Map([
  ['linkedin.com', 'Open Anthony Wohlfeil on LinkedIn'],
  ['github.com', 'Open Anthony Wohlfeil on GitHub'],
  ['anthonywohlfeil.com', 'Open Anthony Wohlfeil’s website']
]);

const linkService = {
  addLinkAttributes(link, url) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  },
  getAnchorUrl() {
    return '#';
  },
  getDestinationHash() {
    return '#';
  },
  goToDestination() {},
  executeNamedAction() {},
  executeSetOCGState() {}
};

const isCurrent = (container, state) => renderStates.get(container) === state;

const cancelState = (state) => {
  state.resizeObserver?.disconnect();
  window.clearTimeout(state.resizeTimer);
  state.renderTask?.cancel();
  state.textLayer?.cancel();
  state.loadingTask?.destroy();
};

const labelAnnotationLinks = (annotationLayer) => {
  annotationLayer.querySelectorAll('a[href]').forEach((link) => {
    let label = 'Open profile link';
    try {
      const hostname = new URL(link.href).hostname.replace(/^www\./, '');
      label = linkLabels.get(hostname) || label;
    } catch (error) {
      // Keep the generic accessible label for malformed or internal links.
    }
    link.setAttribute('aria-label', label);
    link.setAttribute('title', label);
  });
};

const buildPage = async (container, state) => {
  if (!isCurrent(container, state)) {
    return;
  }

  const width = Math.max(1, container.getBoundingClientRect().width);
  if (Math.abs(width - state.renderedWidth) < 1 && state.pageElement) {
    return;
  }

  state.renderTask?.cancel();
  state.textLayer?.cancel();
  const renderId = ++state.renderId;
  const unscaledViewport = state.page.getViewport({ scale: 1 });
  const scale = width / unscaledViewport.width;
  const viewport = state.page.getViewport({ scale });
  const outputScale = window.devicePixelRatio || 1;

  const pageElement = document.createElement('div');
  pageElement.className = 'resume-pdf-page';
  pageElement.style.width = `${viewport.width}px`;
  pageElement.style.height = `${viewport.height}px`;
  pageElement.style.setProperty('--total-scale-factor', scale);
  pageElement.style.setProperty('--scale-round-x', '1px');
  pageElement.style.setProperty('--scale-round-y', '1px');

  const canvas = document.createElement('canvas');
  canvas.className = 'resume-pdf-canvas';
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;
  canvas.setAttribute('aria-hidden', 'true');
  pageElement.append(canvas);

  const textLayerElement = document.createElement('div');
  textLayerElement.className = 'textLayer resume-pdf-text-layer';
  textLayerElement.tabIndex = 0;
  pageElement.append(textLayerElement);

  const annotationLayerElement = document.createElement('div');
  annotationLayerElement.className = 'annotationLayer resume-pdf-annotation-layer';
  pageElement.append(annotationLayerElement);

  const canvasContext = canvas.getContext('2d', { alpha: false });
  const transform = outputScale === 1
    ? null
    : [outputScale, 0, 0, outputScale, 0, 0];

  state.renderTask = state.page.render({
    canvasContext,
    transform,
    viewport
  });

  state.textLayer = new TextLayer({
    textContentSource: state.page.streamTextContent({
      includeMarkedContent: true,
      disableNormalization: true
    }),
    container: textLayerElement,
    viewport
  });

  const annotationLayer = new AnnotationLayer({
    div: annotationLayerElement,
    page: state.page,
    viewport: viewport.clone({ dontFlip: true }),
    linkService
  });

  const textPromise = state.textLayer.render().then(() => {
    const endOfContent = document.createElement('div');
    endOfContent.className = 'endOfContent';
    textLayerElement.append(endOfContent);
  });

  const annotationPromise = annotationLayer.render({
    annotations: state.annotations,
    optionalContentConfig: state.optionalContentConfig,
    renderForms: false,
    enableScripting: false
  }).then(() => labelAnnotationLinks(annotationLayerElement));

  try {
    await Promise.all([state.renderTask.promise, textPromise, annotationPromise]);
  } catch (error) {
    if (error instanceof RenderingCancelledException || !isCurrent(container, state)) {
      return;
    }
    throw error;
  }

  if (!isCurrent(container, state) || state.renderId !== renderId) {
    return;
  }

  container.replaceChildren(pageElement);
  state.pageElement = pageElement;
  state.renderedWidth = width;
};

export const clearResumePdf = (container) => {
  const state = renderStates.get(container);
  if (!state) {
    return;
  }
  renderStates.delete(container);
  cancelState(state);
  container.replaceChildren();
  container.removeAttribute('aria-busy');
};

export const renderResumePdf = async ({ container, url, label }) => {
  clearResumePdf(container);

  const state = {
    id: ++renderSequence,
    renderId: 0,
    renderedWidth: 0,
    pageElement: null,
    renderTask: null,
    textLayer: null,
    resizeObserver: null,
    resizeTimer: null,
    loadingTask: null,
    pdf: null,
    page: null,
    annotations: null,
    optionalContentConfig: null
  };
  renderStates.set(container, state);
  container.setAttribute('aria-busy', 'true');
  container.setAttribute('aria-label', `${label} resume preview for Anthony Wohlfeil`);

  state.loadingTask = getDocument({ url });
  state.pdf = await state.loadingTask.promise;
  if (!isCurrent(container, state)) {
    return;
  }

  state.page = await state.pdf.getPage(1);
  [state.annotations, state.optionalContentConfig] = await Promise.all([
    state.page.getAnnotations({ intent: 'display' }),
    state.pdf.getOptionalContentConfig({ intent: 'display' })
  ]);
  if (!isCurrent(container, state)) {
    return;
  }

  await buildPage(container, state);
  if (!isCurrent(container, state)) {
    return;
  }
  container.removeAttribute('aria-busy');

  state.resizeObserver = new ResizeObserver(() => {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(() => {
      buildPage(container, state).catch((error) => {
        console.error('Unable to resize resume preview.', error);
      });
    }, 120);
  });
  state.resizeObserver.observe(container);
};
