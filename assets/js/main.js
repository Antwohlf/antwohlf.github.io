/*
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');
	var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var articleTrigger = null;
	var keyboardNavigationKeys = ['Tab', 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape'];

	document.addEventListener('keydown', function(event) {
		if (keyboardNavigationKeys.indexOf(event.key) !== -1)
			$body.addClass('is-keyboard-navigation');
	}, true);

	var clearKeyboardNavigation = function() {
		$body.removeClass('is-keyboard-navigation');
	};

	document.addEventListener('pointerdown', clearKeyboardNavigation, true);
	document.addEventListener('mousedown', clearKeyboardNavigation, true);
	document.addEventListener('touchstart', clearKeyboardNavigation, { capture: true, passive: true });

	var setBackgroundControlsAvailable = function(isAvailable) {
		var toggle = document.getElementById('bg-toggle');
		var menu = document.getElementById('bg-menu');
		if (toggle)
			toggle.toggleAttribute('inert', !isAvailable);
		if (menu)
			menu.toggleAttribute('inert', !isAvailable || !menu.classList.contains('is-visible'));
	};

	var focusArticle = function($article) {
		var target = $article.find('.close').get(0) || $article.find('h1, h2').get(0);
		if (target)
			target.focus({ preventScroll: true });
	};

	var restoreArticleTrigger = function() {
		if (articleTrigger && document.contains(articleTrigger))
			articleTrigger.focus({ preventScroll: true });
		articleTrigger = null;
	};

	// Keep hidden article imagery off the homepage request path. Images are
	// hydrated only when they approach the visible viewport inside an article.
	var deferredImages = document.querySelectorAll('#main img[data-src]');
	var loadDeferredImage = function(image) {
		if (!image || !image.dataset.src)
			return;
		image.src = image.dataset.src;
		image.removeAttribute('data-src');
	};
	if ('IntersectionObserver' in window) {
		var deferredImageObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (!entry.isIntersecting)
					return;
				loadDeferredImage(entry.target);
				deferredImageObserver.unobserve(entry.target);
			});
		}, { rootMargin: '500px 0px' });
		Array.prototype.forEach.call(deferredImages, function(image) {
			deferredImageObserver.observe(image);
		});
	}
	else {
		Array.prototype.forEach.call(deferredImages, loadDeferredImage);
	}

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('.header-nav-slot').children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = prefersReducedMotion ? 0 : 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);
				if (!$body.hasClass('is-article-visible') && !articleTrigger)
					articleTrigger = document.activeElement;

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.attr('hidden', '').hide();
								$footer.attr('hidden', '').hide();

							// Show main, article.
								$main.removeAttr('hidden').show();
								$article.removeAttr('hidden').show();

							// Activate article.
								$article.addClass('active');
								setBackgroundControlsAvailable(false);
								focusArticle($article);

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.attr('hidden', '').hide();

								// Show article.
									$article.removeAttr('hidden').show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');
										focusArticle($article);

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.attr('hidden', '').hide();
									$footer.attr('hidden', '').hide();

								// Show main, article.
									$main.removeAttr('hidden').show();
									$article.removeAttr('hidden').show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');
										setBackgroundControlsAvailable(false);
										focusArticle($article);

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.attr('hidden', '').hide();
								$main.attr('hidden', '').hide();

							// Show footer, header.
								$footer.removeAttr('hidden').show();
								$header.removeAttr('hidden').show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');
								setBackgroundControlsAvailable(true);
								restoreArticleTrigger();

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.attr('hidden', '').hide();
							$main.attr('hidden', '').hide();

						// Show footer, header.
							$footer.removeAttr('hidden').show();
							$header.removeAttr('hidden').show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');
								setBackgroundControlsAvailable(true);
								restoreArticleTrigger();

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

					var $heading = $this.find('h1, h2').first();
					var headingId = $heading.attr('id') || ($this.attr('id') + '-title');
					$heading.attr('id', headingId);
					$this.attr({
						'role': 'dialog',
						'aria-modal': 'true',
						'aria-labelledby': headingId
					});

					// Close.
						$('<button type="button" class="close">Close</button>')
							.attr('aria-label', 'Close ' + $heading.text())
							.appendTo($this)
						.on('click', function() {
							location.hash = '';
				});

					// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
				});

			});

			$header.find('a[href^="#"]').on('click', function() {
				articleTrigger = this;
			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keydown', function(event) {

				if (event.key === 'Tab' && $body.hasClass('is-article-visible')) {
					var $activeArticle = $main_articles.filter('.active');
					var focusable = $activeArticle.find('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])').filter(':visible').get();
					if (focusable.length) {
						var first = focusable[0];
						var last = focusable[focusable.length - 1];
						if (event.shiftKey && document.activeElement === first) {
							event.preventDefault();
							last.focus();
						} else if (!event.shiftKey && document.activeElement === last) {
							event.preventDefault();
							first.focus();
						}
					}
				}

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.attr('hidden', '').hide();
				$main_articles.attr('hidden', '').hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

	// Typing headline rotation.
	var typingTarget = document.querySelector('#header .typing-demo');
	if (typingTarget) {
		var typingPhrases = [
			'Software Engineer',
			'Michigan Engineering Alumnus',
			'Travel Enthusiast',
			'Airbnb Superhost'
		];
		var typingSpeed = 90;
		var backspaceSpeed = 60;
		var holdDuration = 2000;
		var typingIndex = 0;
		var charIndex = 0;
		var deleting = false;
		var typingTimer = null;
		var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		typingTarget.setAttribute('aria-live', 'polite');

		var scheduleNextStep = function(delay) {
			if (typingTimer !== null)
				clearTimeout(typingTimer);
			typingTimer = window.setTimeout(step, delay);
		};

		var step = function() {
			var phrase = typingPhrases[typingIndex];

			if (!deleting) {
				if (charIndex === 0)
					typingTarget.setAttribute('aria-label', phrase);

				if (charIndex < phrase.length) {
					charIndex++;
					typingTarget.textContent = phrase.substring(0, charIndex);
					scheduleNextStep(typingSpeed);
					return;
				}

				deleting = true;
				scheduleNextStep(holdDuration);
				return;
			}

			if (charIndex > 0) {
				charIndex--;
				typingTarget.textContent = phrase.substring(0, charIndex);
				scheduleNextStep(backspaceSpeed);
				return;
			}

			deleting = false;
			typingIndex = (typingIndex + 1) % typingPhrases.length;
			scheduleNextStep(typingSpeed);
		};

		if (prefersReducedMotion) {
			typingTarget.textContent = typingPhrases[0];
			typingTarget.setAttribute('aria-label', typingPhrases[0]);
		}
		else {
			typingTarget.textContent = '';
			scheduleNextStep(typingSpeed);
		}
	}


})(jQuery);
(() => {
  const frame = document.getElementById('resume-frame');
  const preview = document.getElementById('resume-preview');
  const placeholder = document.getElementById('resume-placeholder');
  const openFull = document.getElementById('resume-open');
  const download = document.getElementById('resume-download');
  const downloadWrap = download ? download.closest('.resume-link') : null;
  const resumeEmbed = frame?.closest('.resume-embed');
  const buttons = document.querySelectorAll('.resume-variant');
  if (!frame || !download || !buttons.length) {
    return;
  }

  const availabilityCache = new Map();
  const FADE_DURATION = 250;
  const FADE_OUT_DELAY = 120;
  const PDF_VIEW_OPTIONS = 'toolbar=0&navpanes=0&scrollbar=0&view=FitH';
  const resumeViews = [frame, preview].filter(Boolean);
  let rendererPromise = null;
  const brandColors = new Map([
    ['default', '#4fc3ff'],
    ['google', '#4285f4'],
    ['amazon', '#ff9900'],
    ['airbnb', '#ff5a5f'],
    ['facebook', '#1877f2'],
    ['netflix', '#e50914'],
    ['duolingo', '#58cc02'],
    ['spotify', '#1db954']
  ]);

  const setActive = (btn) => {
    buttons.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');
    const label = btn.getAttribute('data-resume-label') || 'Default';
    openFull?.setAttribute('aria-label', `Open ${label} resume at full size`);
    download.setAttribute('aria-label', `Download ${label} resume PDF`);
    resumeEmbed?.classList.toggle(
      'is-netflix-resume',
      btn.getAttribute('data-resume-label') === 'Netflix'
    );
  };

  const getResumeRenderer = () => {
    rendererPromise ||= import('./resume-pdf-viewer.mjs?v=20260810-accessible-viewer');
    return rendererPromise;
  };

  const clearInteractivePreview = () => {
    if (!preview || !rendererPromise) {
      return;
    }
    rendererPromise.then(({ clearResumePdf }) => {
      clearResumePdf(preview);
    }).catch(() => {});
  };

  const setNativeResume = (src, label = 'Anthony Wohlfeil') => {
    download.href = src;
    if (openFull) {
      openFull.href = src;
    }
    clearInteractivePreview();
    frame.src = `${src}#${PDF_VIEW_OPTIONS}`;
    frame.title = `${label} resume for Anthony Wohlfeil`;
    frame.hidden = false;
    if (preview) {
      preview.hidden = true;
      preview.removeAttribute('aria-label');
      preview.removeAttribute('aria-busy');
    }
    return frame;
  };

  const getDownloadFilename = (src) => {
    try {
      const url = new URL(src, window.location.href);
      const name = url.pathname.split('/').filter(Boolean).pop();
      return name || 'resume.pdf';
    } catch (error) {
      return 'resume.pdf';
    }
  };

  const downloadResume = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const src = download.href;
    if (!src) {
      return;
    }

    try {
      const response = await fetch(src, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Resume download failed.');
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = getDownloadFilename(src);
      tempLink.target = '_blank';
      tempLink.rel = 'noopener';
      tempLink.style.display = 'none';
      tempLink.addEventListener('click', (linkEvent) => {
        linkEvent.stopPropagation();
        linkEvent.stopImmediatePropagation();
      });
      (downloadWrap || document.body).appendChild(tempLink);
      tempLink.click();
      tempLink.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(src, '_blank', 'noopener');
    }
  };

  download.addEventListener('click', downloadResume);

  const setDownloadVisible = (isVisible) => {
    if (downloadWrap) {
      downloadWrap.hidden = !isVisible;
      return;
    }
    download.hidden = !isVisible;
  };

  const showResume = async (src, renderSrc, label, token) => {
    resumeViews.forEach((view) => view.classList.remove('is-hidden'));
    if (placeholder) {
      placeholder.classList.remove('is-visible');
    }
    setDownloadVisible(true);
    download.href = src;
    if (openFull) {
      openFull.href = src;
    }

    if (preview && renderSrc) {
      frame.hidden = true;
      preview.hidden = false;
      preview.setAttribute('aria-busy', 'true');
      try {
        const { renderResumePdf } = await getResumeRenderer();
        if (token !== selectionToken) {
          return;
        }
        await renderResumePdf({ container: preview, url: renderSrc, label });
        if (token !== selectionToken) {
          return;
        }
        preview.classList.remove('is-fading');
      } catch (error) {
        if (token !== selectionToken) {
          return;
        }
        console.error('Unable to render interactive resume preview.', error);
        const fallbackView = setNativeResume(src, label);
        fallbackView.classList.remove('is-fading');
      }
      return;
    }

    const activeView = setNativeResume(src, label);
    const handleLoad = () => {
      if (token !== selectionToken) {
        return;
      }
      activeView.classList.remove('is-fading');
    };
    activeView.addEventListener('load', handleLoad, { once: true });
    window.setTimeout(() => {
      if (token !== selectionToken) {
        return;
      }
      activeView.classList.remove('is-fading');
    }, FADE_DURATION + 200);
  };

  const showPlaceholder = (label, token, btn) => {
    setDownloadVisible(false);
    clearInteractivePreview();
    if (!placeholder) {
      resumeViews.forEach((view) => {
        view.classList.add('is-hidden');
        view.classList.remove('is-fading');
      });
      return;
    }
    placeholder.classList.add('is-visible');
    placeholder.textContent = '';
    const iconNode = btn ? btn.querySelector('.icon') : null;
    if (iconNode) {
      const iconClone = iconNode.cloneNode(true);
      iconClone.classList.add('resume-placeholder-icon');
      const key = (btn.getAttribute('data-resume-label') || '').toLowerCase();
      const color = brandColors.get(key);
      if (key === 'amazon') {
        iconClone.classList.add('resume-placeholder-amazon');
      } else if (color) {
        iconClone.style.color = color;
      }
      placeholder.appendChild(iconClone);
    }
    const message = document.createElement('span');
    message.className = 'resume-placeholder-text';
    message.textContent = `${label} themed resume is coming soon.`;
    placeholder.appendChild(message);
    window.setTimeout(() => {
      if (token !== selectionToken) {
        return;
      }
      resumeViews.forEach((view) => {
        view.classList.add('is-hidden');
        view.classList.remove('is-fading');
      });
    }, FADE_DURATION);
  };

  const checkAvailability = async (src) => {
    try {
      const response = await fetch(src, { method: 'HEAD', cache: 'no-store' });
      if (response.ok) {
        return { ready: true, definitive: true };
      }
      if (response.status === 404 || response.status === 403) {
        return { ready: false, definitive: true };
      }
    } catch (error) {
      // Fall through to a lightweight GET check.
    }

    try {
      const response = await fetch(src, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
        cache: 'no-store'
      });
      if (response.ok || response.status === 206) {
        return { ready: true, definitive: true };
      }
      return { ready: false, definitive: true };
    } catch (error) {
      return { ready: false, definitive: false };
    }
  };

  const ensureAvailability = (btn) => {
    const src = btn.getAttribute('data-resume-src');
    if (!src) {
      return Promise.resolve(false);
    }

    const cached = availabilityCache.get(src);
    if (typeof cached === 'boolean') {
      return Promise.resolve(cached);
    }
    if (cached) {
      return cached;
    }

    const readyHint = btn.getAttribute('data-resume-ready') === 'true';
    if (readyHint) {
      availabilityCache.set(src, true);
      return Promise.resolve(true);
    }
    if (btn.getAttribute('data-resume-ready') === 'false') {
      return Promise.resolve(false);
    }

    const promise = checkAvailability(src).then((result) => {
      if (result.definitive) {
        if (result.ready) {
          availabilityCache.set(src, true);
        } else {
          availabilityCache.delete(src);
        }
        btn.setAttribute('data-resume-ready', result.ready ? 'true' : 'false');
      } else {
        availabilityCache.delete(src);
      }
      return result.ready;
    }).catch(() => {
      availabilityCache.delete(src);
      return false;
    });

    availabilityCache.set(src, promise);
    return promise;
  };

  let selectionToken = 0;

  const applySelection = async (btn) => {
    selectionToken += 1;
    const token = selectionToken;
    const src = btn.getAttribute('data-resume-src');
    const renderSrc = btn.getAttribute('data-resume-render-src');
    const label = btn.getAttribute('data-resume-label') || 'This';
    const isInteractiveSelection = Boolean(preview && renderSrc);
    setActive(btn);
    resumeViews.forEach((view) => {
      view.classList.toggle('is-fading', !isInteractiveSelection);
    });
    if (placeholder) {
      placeholder.classList.remove('is-visible');
    }
    const fadeOut = isInteractiveSelection
      ? Promise.resolve()
      : new Promise((resolve) => {
          window.setTimeout(resolve, FADE_OUT_DELAY);
        });
    if (!src) {
      await fadeOut;
      if (token !== selectionToken || !btn.classList.contains('is-active')) {
        return;
      }
      showPlaceholder(label, token, btn);
      return;
    }

    const ready = await ensureAvailability(btn);
    await fadeOut;
    if (token !== selectionToken || !btn.classList.contains('is-active')) {
      return;
    }
    if (ready) {
      showResume(src, renderSrc, label, token);
      return;
    }
    showPlaceholder(label, token, btn);
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applySelection(btn);
    });
  });

  let viewerInitialized = false;
  const initializeResumeViewer = () => {
    if (viewerInitialized) {
      return;
    }
    viewerInitialized = true;
    const initial = document.querySelector('.resume-variant.is-active') || buttons[0];
    if (initial) {
      applySelection(initial);
    }
    buttons.forEach((btn) => {
      if (!btn.classList.contains('is-active')) {
        ensureAvailability(btn);
      }
    });
  };

  if (window.location.hash === '#resume') {
    initializeResumeViewer();
  }
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#resume') {
      initializeResumeViewer();
    }
  });
})();

(() => {
  const projectCards = document.querySelectorAll('#projects .project-card');
  if (!projectCards.length) {
    return;
  }

  projectCards.forEach((card) => {
    if (card.querySelector('.project-actions')) {
      return;
    }

    const actions = document.createElement('div');
    actions.className = 'project-actions';
    const projectName = card.querySelector('h2')?.textContent.trim() || 'project';

    const skills = card.dataset.skills;
    const categorizedSkills = [
      { key: 'skillsLanguages', label: 'Languages' },
      { key: 'skillsFrameworks', label: 'Frameworks & Libraries' },
      { key: 'skillsHosting', label: 'Hosting & Infrastructure' },
      { key: 'skillsOther', label: 'Other / Services' }
    ];

    const hasCategorized = categorizedSkills.some((item) => card.dataset[item.key]);

    if (skills || hasCategorized) {
      const skillsButton = document.createElement('button');
      skillsButton.className = 'button project-skills-trigger';
      skillsButton.type = 'button';
      skillsButton.textContent = 'Tech Stack';
      skillsButton.setAttribute('aria-label', `View the tech stack for ${projectName}`);
      skillsButton.setAttribute('aria-haspopup', 'dialog');
      skillsButton.setAttribute('aria-expanded', 'false');
      skillsButton.setAttribute('aria-controls', 'skills-popover');
      skillsButton.dataset.skills = skills || '';
      if (hasCategorized) {
        categorizedSkills.forEach((item) => {
          if (card.dataset[item.key]) {
            skillsButton.dataset[item.key] = card.dataset[item.key];
          }
        });
      }
      actions.appendChild(skillsButton);
    }

    const link = card.dataset.link;
    const linkLabel = card.dataset.linkLabel || 'Link';
    if (link) {
      const linkEl = document.createElement('a');
      linkEl.className = 'button project-link';
      linkEl.textContent = linkLabel;
      linkEl.href = link;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener';
      linkEl.setAttribute('aria-label', `Visit ${projectName}`);
      actions.appendChild(linkEl);
    }

    const github = card.dataset.github;
    const githubLabel = card.dataset.githubLabel || 'Github';
    if (github) {
      const githubEl = document.createElement('a');
      githubEl.className = 'button project-github';
      githubEl.textContent = githubLabel;
      githubEl.href = github;
      githubEl.target = '_blank';
      githubEl.rel = 'noopener';
      githubEl.setAttribute('aria-label', `View ${projectName} on GitHub`);
      actions.appendChild(githubEl);
    }
    card.appendChild(actions);
  });
})();

(() => {
  const triggers = document.querySelectorAll('.project-skills-trigger');
  if (!triggers.length) {
    return;
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'skills-popover-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  const popover = document.createElement('div');
  popover.className = 'skills-popover';
  popover.id = 'skills-popover';
  popover.setAttribute('role', 'dialog');
  popover.setAttribute('aria-modal', 'true');
  popover.setAttribute('aria-hidden', 'true');

  const closeButton = document.createElement('button');
  closeButton.className = 'skills-popover-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close tech stack');
  closeButton.textContent = '×';
  popover.appendChild(closeButton);

  const list = document.createElement('ul');
  list.className = 'skills-popover-list';
  popover.appendChild(list);

  document.body.appendChild(backdrop);
  document.body.appendChild(popover);

  let activeTrigger = null;

  const closePopover = (restoreFocus = true) => {
    const previousTrigger = activeTrigger;
    backdrop.classList.remove('is-visible');
    popover.classList.remove('is-visible');
    backdrop.setAttribute('aria-hidden', 'true');
    popover.setAttribute('aria-hidden', 'true');
    previousTrigger?.setAttribute('aria-expanded', 'false');
    activeTrigger = null;
    if (restoreFocus && previousTrigger) {
      previousTrigger.focus({ preventScroll: true });
    }
  };

  const positionPopover = (trigger) => {
    const rect = trigger.getBoundingClientRect();
    const popRect = popover.getBoundingClientRect();
    const gap = 10;
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    let left = rect.left + rect.width / 2 - popRect.width / 2 + scrollX;
    let top = rect.bottom + gap + scrollY;

    if (left < 12) {
      left = 12;
    }
    if (left + popRect.width > window.innerWidth - 12 + scrollX) {
      left = window.innerWidth - popRect.width - 12 + scrollX;
    }
    if (top + popRect.height > window.innerHeight - 12 + scrollY) {
      top = rect.top - popRect.height - gap + scrollY;
    }
    top = Math.max(scrollY + 12, top);

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
  };

  const openPopover = (trigger) => {
    list.innerHTML = '';

    const sections = [
      { key: 'skillsLanguages', label: 'Languages' },
      { key: 'skillsFrameworks', label: 'Frameworks & Libraries' },
      { key: 'skillsHosting', label: 'Hosting & Infrastructure' },
      { key: 'skillsOther', label: 'Other / Services' }
    ];

    const hasSections = sections.some((section) => trigger.dataset[section.key]);

    if (hasSections) {
      sections.forEach((section) => {
        const raw = trigger.dataset[section.key];
        if (!raw) {
          return;
        }

        const title = document.createElement('li');
        title.className = 'skills-popover-heading';
        title.textContent = section.label;
        list.appendChild(title);

        raw.split(',').map((item) => item.trim()).filter(Boolean).forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          list.appendChild(li);
        });
      });
    } else {
      const skills = trigger.dataset.skills || '';
      skills.split(',').map((item) => item.trim()).filter(Boolean).forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
    }

    backdrop.classList.add('is-visible');
    popover.classList.add('is-visible');
    backdrop.setAttribute('aria-hidden', 'false');
    popover.setAttribute('aria-hidden', 'false');
    popover.setAttribute('aria-label', `Tech stack for ${trigger.closest('.project-card')?.querySelector('h2')?.textContent.trim() || 'project'}`);
    activeTrigger = trigger;
    trigger.setAttribute('aria-expanded', 'true');
    closeButton.focus({ preventScroll: true });

    window.requestAnimationFrame(() => {
      positionPopover(trigger);
    });
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (popover.classList.contains('is-visible')) {
        closePopover();
        return;
      }
      openPopover(trigger);
    });
  });

  backdrop.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    closePopover();
  });

  closeButton.addEventListener('click', () => {
    closePopover();
  });

  popover.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeTrigger) {
      event.preventDefault();
      closePopover();
    }
    if (event.key === 'Tab' && activeTrigger) {
      event.preventDefault();
      closeButton.focus();
    }
  });

  window.addEventListener('scroll', () => {
    if (activeTrigger && popover.classList.contains('is-visible')) {
      positionPopover(activeTrigger);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (activeTrigger && popover.classList.contains('is-visible')) {
      positionPopover(activeTrigger);
    }
  });
})();
