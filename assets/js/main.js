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
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

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
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

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
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

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
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

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
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

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
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

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

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

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
				$main.hide();
				$main_articles.hide();

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
(function() {
  var bg = document.getElementById('bg');
  var toggle = document.getElementById('bg-toggle');
  var menu = document.getElementById('bg-menu');
  var locationTime = document.getElementById('location-time');

  if (!bg || !toggle || !menu || !locationTime) {
    return;
  }

  var locations = [
    { id: 'tokyo', label: 'Tokyo', timeZone: 'Asia/Tokyo', lat: 35.6895, lon: 139.6917 },
    { id: 'losangeles', label: 'Los Angeles', timeZone: 'America/Los_Angeles', lat: 34.0522, lon: -118.2437 },
    { id: 'annarbor', label: 'Ann Arbor', timeZone: 'America/New_York', lat: 42.2808, lon: -83.7430 },
    { id: 'detroit', label: 'Detroit', timeZone: 'America/New_York', lat: 42.3314, lon: -83.0458 },
    { id: 'nyc', label: 'New York City', timeZone: 'America/New_York', lat: 40.7128, lon: -74.0060 },
    { id: 'sansebastian', label: 'San Sebastian', timeZone: 'Europe/Madrid', lat: 43.3183, lon: -1.9812 }
  ];
  var storageKey = 'bgLocation';
  var locationIndex = 0;
  var currentImageUrl = null;
  var fadeOutTimeoutId = null;
  var fadeInTimeoutId = null;
  var bgLogic = window.BackgroundLogic || {};
  var backgroundAssetApproval = window.BackgroundAssetApproval || null;
  var storageBaseUrl = 'https://uqmjvvghhhtjqbzzvtop.supabase.co/storage/v1/object/public/personal-website/backgrounds/';
  var prefersReducedMotion = false;
  var overlayCanvas = bg.querySelector('.weather-canvas') || bg.querySelector('.snow-canvas');
  var overlayCtx = null;
  var overlayAnimationId = null;
  var overlayParticles = [];
  var overlayType = 'none';
  var overlayLastTime = 0;
  var overlayBounds = { width: 0, height: 0 };
  var overlayResizeHandler = null;
  var stormFlashAlpha = 0;
  var stormFlashCooldown = 0;
  var weatherCache = {};
  var weatherInFlight = {};
  var imageAvailabilityCache = {};
  var currentVisualRequestId = 0;
  var WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;
  var FALLBACK_SEASONS = ['spring', 'summer', 'fall', 'winter'];
  var FALLBACK_SEGMENTS = ['morning', 'day', 'evening', 'night'];
  var FALLBACK_SKY_CHAIN = ['dark', 'cloudy', 'partly', 'clear'];
  var DEBUG_VISUAL_STORAGE_KEY = 'bgVisualDebugState';
  var LOCAL_ASSET_OVERRIDE_STORAGE_KEY = 'bgUseRemoteAssetsOnly';
  var DEBUG_SEASONS = ['auto', 'spring', 'summer', 'fall', 'winter'];
  var DEBUG_SEGMENTS = ['auto', 'morning', 'day', 'evening', 'night'];
  var DEBUG_WEATHER_KINDS = ['auto', 'clear', 'partly', 'cloudy', 'rain', 'fog', 'storm', 'snow'];
  var debugStatusEl = null;
  var debugAssetInfoEl = null;
  var debugVisual = {
    enabled: false,
    season: 'auto',
    segment: 'auto',
    weather: 'auto'
  };
  var currentResolvedAssetKey = '';
  var currentResolvedAssetSource = '';
  var currentRequestedAssetKey = '';
  var currentApprovalStateLabel = '';

  var isLocalDebugEnvironment = function() {
    var location = window.location || {};
    var host = (location.hostname || '').toLowerCase();

    if (location.protocol === 'file:') {
      return true;
    }
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host === '[::1]' ||
      host === '0.0.0.0'
    ) {
      return true;
    }
    if (host.slice(-6) === '.local') {
      return true;
    }
    if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) {
      return true;
    }

    return false;
  };

  var sanitizeDebugValue = function(value, allowedValues, fallbackValue) {
    var normalized = String(value || '').toLowerCase();
    return allowedValues.indexOf(normalized) !== -1 ? normalized : fallbackValue;
  };

  var loadDebugVisualState = function() {
    var parsed = null;

    if (!debugVisual.enabled) {
      return;
    }

    try {
      parsed = JSON.parse(localStorage.getItem(DEBUG_VISUAL_STORAGE_KEY) || 'null');
    } catch (error) {
      parsed = null;
    }

    debugVisual.season = sanitizeDebugValue(parsed && parsed.season, DEBUG_SEASONS, 'auto');
    debugVisual.segment = sanitizeDebugValue(parsed && parsed.segment, DEBUG_SEGMENTS, 'auto');
    debugVisual.weather = sanitizeDebugValue(parsed && parsed.weather, DEBUG_WEATHER_KINDS, 'auto');
  };

  var saveDebugVisualState = function() {
    if (!debugVisual.enabled) {
      return;
    }

    try {
      localStorage.setItem(
        DEBUG_VISUAL_STORAGE_KEY,
        JSON.stringify({
          season: debugVisual.season,
          segment: debugVisual.segment,
          weather: debugVisual.weather
        })
      );
    } catch (error) {
      // Ignore storage failures.
    }
  };

  var titleCase = function(value) {
    var text = String(value || '');

    if (!text) {
      return '';
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  var formatWeatherKindLabel = function(kind) {
    if (kind === 'partly') {
      return 'Partly Cloudy';
    }

    return titleCase(kind);
  };

  var getDebugWeatherText = function(requestedKind, normalizedKind) {
    if (requestedKind === 'auto') {
      return 'Loading weather...';
    }

    if (normalizedKind !== requestedKind) {
      return (
        'Debug weather: ' +
        formatWeatherKindLabel(requestedKind) +
        ' -> ' +
        formatWeatherKindLabel(normalizedKind)
      );
    }

    return 'Debug weather: ' + formatWeatherKindLabel(normalizedKind);
  };

  var updateDebugStatus = function() {
    if (!debugStatusEl || !debugVisual.enabled) {
      return;
    }

    var seasonLabel = debugVisual.season === 'auto' ? 'Auto' : titleCase(debugVisual.season);
    var segmentLabel = debugVisual.segment === 'auto' ? 'Auto' : titleCase(debugVisual.segment);
    var weatherLabel = debugVisual.weather === 'auto' ? 'Auto' : formatWeatherKindLabel(debugVisual.weather);

    debugStatusEl.textContent = 'Season: ' + seasonLabel + ' · Time: ' + segmentLabel + ' · Weather: ' + weatherLabel;

    if (debugAssetInfoEl) {
      if (currentResolvedAssetKey) {
        debugAssetInfoEl.textContent =
          'Requested: ' + (currentRequestedAssetKey || 'pending') +
          '\nRendered: ' + currentResolvedAssetKey +
          '\nSource: ' + currentResolvedAssetSource +
          '\nApproval: ' + (currentApprovalStateLabel || 'pending');
      } else {
        debugAssetInfoEl.textContent = 'Requested: pending\nRendered: pending\nSource: pending\nApproval: pending';
      }
    }
  };

  var buildAssetUrlsForName = function(name) {
    var urls = [];
    var normalizedName = String(name || '');
    var seasonMatch = normalizedName.match(/_(spring|summer|fall|winter)_/);

    if (debugVisual.enabled && seasonMatch) {
      urls.push('/tools/background-generation/generated/' + seasonMatch[1] + '-images/' + normalizedName);
    }

    urls.push(storageBaseUrl + normalizedName);
    return urls;
  };

  var buildLocalGeneratedUrlForName = function(name) {
    var normalizedName = String(name || '');
    var seasonMatch = normalizedName.match(/_(spring|summer|fall|winter)_/);
    var parts;

    if (!seasonMatch) {
      return null;
    }

    if (seasonMatch[1] === 'winter') {
      parts = normalizedName.replace('.png', '').split('_');
      return '/tools/background-generation/generated/.reference-cache/' + parts[0] + '_' + parts[2] + '.png';
    }

    return '/tools/background-generation/generated/' + seasonMatch[1] + '-images/' + normalizedName;
  };

  var getAssetInfoForUrl = function(url) {
    var raw = String(url || '');
    var match = raw.match(/([^\/?#]+\.png)(?:[?#].*)?$/);
    var key = match ? match[1] : raw;
    var source = 'unknown';

    if (raw.indexOf('/tools/background-generation/generated/') === 0 || raw.indexOf('tools/background-generation/generated/') === 0) {
      source = 'local generated';
    } else if (raw.indexOf(storageBaseUrl) === 0) {
      source = 'supabase';
    }

    return {
      key: key,
      source: source
    };
  };

  var initLocalDebugPanel = function(onChange) {
    var panel;
    var title;
    var row;
    var status;
    var resetButton;
    var controls = [
      {
        key: 'season',
        label: 'Season',
        options: [
          { value: 'auto', label: 'Auto (calendar)' },
          { value: 'spring', label: 'Spring' },
          { value: 'summer', label: 'Summer' },
          { value: 'fall', label: 'Fall' },
          { value: 'winter', label: 'Winter' }
        ]
      },
      {
        key: 'segment',
        label: 'Time',
        options: [
          { value: 'auto', label: 'Auto (local time)' },
          { value: 'morning', label: 'Morning' },
          { value: 'day', label: 'Day' },
          { value: 'evening', label: 'Evening' },
          { value: 'night', label: 'Night' }
        ]
      },
      {
        key: 'weather',
        label: 'Weather',
        options: [
          { value: 'auto', label: 'Auto (provider)' },
          { value: 'clear', label: 'Clear' },
          { value: 'partly', label: 'Partly Cloudy' },
          { value: 'cloudy', label: 'Cloudy' },
          { value: 'rain', label: 'Rain' },
          { value: 'fog', label: 'Fog' },
          { value: 'storm', label: 'Storm' },
          { value: 'snow', label: 'Snow' }
        ]
      }
    ];
    var i;

    if (!debugVisual.enabled) {
      return;
    }

    panel = document.createElement('aside');
    panel.className = 'bg-debug-panel';
    panel.setAttribute('aria-label', 'Local background debug controls');

    title = document.createElement('div');
    title.className = 'bg-debug-title';
    title.textContent = 'Local Background Debug';
    panel.appendChild(title);

    for (i = 0; i < controls.length; i++) {
      (function(control) {
        var controlRow = document.createElement('label');
        var label = document.createElement('span');
        var select = document.createElement('select');
        var j;

        controlRow.className = 'bg-debug-row';
        label.textContent = control.label;
        controlRow.appendChild(label);

        for (j = 0; j < control.options.length; j++) {
          var option = document.createElement('option');
          option.value = control.options[j].value;
          option.textContent = control.options[j].label;
          select.appendChild(option);
        }

        select.value = debugVisual[control.key];
        select.addEventListener('change', function() {
          debugVisual[control.key] = select.value;
          saveDebugVisualState();
          updateDebugStatus();
          onChange();
        });

        controlRow.appendChild(select);
        panel.appendChild(controlRow);
      })(controls[i]);
    }

    row = document.createElement('div');
    row.className = 'bg-debug-actions';
    resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.textContent = 'Reset Auto';
    resetButton.addEventListener('click', function() {
      var selects = panel.querySelectorAll('select');
      var idx;

      debugVisual.season = 'auto';
      debugVisual.segment = 'auto';
      debugVisual.weather = 'auto';
      saveDebugVisualState();
      updateDebugStatus();

      for (idx = 0; idx < selects.length; idx++) {
        selects[idx].value = 'auto';
      }

      onChange();
    });
    row.appendChild(resetButton);
    panel.appendChild(row);

    status = document.createElement('div');
    status.className = 'bg-debug-status';
    panel.appendChild(status);
    debugStatusEl = status;

    debugAssetInfoEl = document.createElement('div');
    debugAssetInfoEl.className = 'bg-debug-asset';
    panel.appendChild(debugAssetInfoEl);

    updateDebugStatus();

    document.body.appendChild(panel);
  };

  debugVisual.enabled = isLocalDebugEnvironment();
  loadDebugVisualState();

  var getSeasonForDate = typeof bgLogic.getSeasonForDate === 'function'
    ? bgLogic.getSeasonForDate
    : function(date) {
      var month = date.getMonth() + 1;
      if (month >= 3 && month < 6) {
        return 'spring';
      }
      if (month >= 6 && month < 9) {
        return 'summer';
      }
      if (month >= 9 && month < 12) {
        return 'fall';
      }
      return 'winter';
    };

  var getTimeSegmentForDate = typeof bgLogic.getTimeSegmentForDate === 'function'
    ? bgLogic.getTimeSegmentForDate
    : function(date, timeZone) {
      var hour = date.getHours();

      try {
        if (window.Intl && Intl.DateTimeFormat) {
          var formatter = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: timeZone
          });
          hour = Number(formatter.format(date));
        }
      } catch (error) {
        // Use local hour as fallback.
      }

      if (hour >= 5 && hour < 11) {
        return 'morning';
      }
      if (hour >= 11 && hour < 17) {
        return 'day';
      }
      if (hour >= 17 && hour < 21) {
        return 'evening';
      }
      return 'night';
    };

  var mapOpenMeteoCodeToKind = typeof bgLogic.mapOpenMeteoCodeToKind === 'function'
    ? bgLogic.mapOpenMeteoCodeToKind
    : function(code) {
      var num = Number(code);
      if (num === 0 || num === 1) {
        return 'clear';
      }
      if (num === 2) {
        return 'partly';
      }
      if (num === 3) {
        return 'cloudy';
      }
      if (num === 45 || num === 48) {
        return 'fog';
      }
      if (num === 95 || num === 96 || num === 99) {
        return 'storm';
      }
      if (num === 71 || num === 73 || num === 75 || num === 77 || num === 85 || num === 86) {
        return 'snow';
      }
      if (
        num === 51 || num === 53 || num === 55 || num === 56 || num === 57 ||
        num === 61 || num === 63 || num === 65 || num === 66 || num === 67 ||
        num === 80 || num === 81 || num === 82
      ) {
        return 'rain';
      }
      return 'cloudy';
    };

  var mapMetNoSymbolToKind = typeof bgLogic.mapMetNoSymbolToKind === 'function'
    ? bgLogic.mapMetNoSymbolToKind
    : function(symbolCode) {
      var code = symbolCode ? String(symbolCode).replace(/_(day|night|polartwilight)$/i, '') : '';

      if (!code) {
        return 'cloudy';
      }
      if (code.indexOf('thunder') !== -1) {
        return 'storm';
      }
      if (code.indexOf('snow') !== -1 || code.indexOf('sleet') !== -1) {
        return 'snow';
      }
      if (code.indexOf('rain') !== -1 || code.indexOf('drizzle') !== -1 || code.indexOf('shower') !== -1) {
        return 'rain';
      }
      if (code.indexOf('fog') !== -1) {
        return 'fog';
      }
      if (code.indexOf('partlycloudy') !== -1) {
        return 'partly';
      }
      if (code.indexOf('cloudy') !== -1) {
        return 'cloudy';
      }
      if (code.indexOf('clearsky') !== -1 || code.indexOf('fair') !== -1) {
        return 'clear';
      }
      return 'cloudy';
    };

  var getSkyForWeatherKind = typeof bgLogic.getSkyForWeatherKind === 'function'
    ? bgLogic.getSkyForWeatherKind
    : function(kind) {
      if (kind === 'storm' || kind === 'snow' || kind === 'rain') {
        return 'dark';
      }
      if (kind === 'fog') {
        return 'cloudy';
      }
      if (kind === 'partly') {
        return 'partly';
      }
      if (kind === 'clear') {
        return 'clear';
      }
      return 'cloudy';
    };

  var getOverlayForWeatherKind = typeof bgLogic.getOverlayForWeatherKind === 'function'
    ? bgLogic.getOverlayForWeatherKind
    : function(kind) {
      if (kind === 'storm') {
        return 'storm';
      }
      if (kind === 'snow') {
        return 'snow';
      }
      if (kind === 'rain') {
        return 'rain';
      }
      if (kind === 'fog') {
        return 'fog';
      }
      return 'none';
    };

  var normalizeWeatherKind = typeof bgLogic.normalizeWeatherKind === 'function'
    ? bgLogic.normalizeWeatherKind
    : function(kind, options) {
      var resolvedKind = kind || 'cloudy';
      var season = '';
      var locationId = '';

      options = options || {};
      if (options.season) {
        season = String(options.season).toLowerCase();
      }
      if (options.locationId) {
        locationId = String(options.locationId).toLowerCase();
      }

      if (resolvedKind !== 'snow') {
        return resolvedKind;
      }
      if (locationId === 'losangeles') {
        return 'rain';
      }
      if (season && season !== 'winter') {
        return 'rain';
      }
      return resolvedKind;
    };

  var uniqueValues = function(values) {
    var seen = {};
    var output = [];
    var i;

    for (i = 0; i < values.length; i++) {
      if (!seen[values[i]]) {
        seen[values[i]] = true;
        output.push(values[i]);
      }
    }

    return output;
  };

  var getSkyFallbackOrder = typeof bgLogic.getSkyFallbackOrder === 'function'
    ? bgLogic.getSkyFallbackOrder
    : function(sky) {
      var start = FALLBACK_SKY_CHAIN.indexOf(sky);
      var output = [];
      var i;

      if (start === -1) {
        return FALLBACK_SKY_CHAIN.slice();
      }

      for (i = start; i < FALLBACK_SKY_CHAIN.length; i++) {
        output.push(FALLBACK_SKY_CHAIN[i]);
      }

      return output;
    };

  var getSeasonFallbackOrder = typeof bgLogic.getSeasonFallbackOrder === 'function'
    ? bgLogic.getSeasonFallbackOrder
    : function(season) {
      var index = FALLBACK_SEASONS.indexOf(season);
      var output = [];
      var distance;

      if (index === -1) {
        return FALLBACK_SEASONS.slice();
      }

      output.push(FALLBACK_SEASONS[index]);

      for (distance = 1; distance <= Math.floor(FALLBACK_SEASONS.length / 2); distance++) {
        output.push(FALLBACK_SEASONS[(index - distance + FALLBACK_SEASONS.length) % FALLBACK_SEASONS.length]);
        output.push(FALLBACK_SEASONS[(index + distance) % FALLBACK_SEASONS.length]);
      }

      return uniqueValues(output);
    };

  var getSegmentFallbackOrder = typeof bgLogic.getSegmentFallbackOrder === 'function'
    ? bgLogic.getSegmentFallbackOrder
    : function(segment) {
      var index = FALLBACK_SEGMENTS.indexOf(segment);

      if (index === -1) {
        return FALLBACK_SEGMENTS.slice();
      }

      return uniqueValues([
        FALLBACK_SEGMENTS[index],
        FALLBACK_SEGMENTS[(index + 1) % FALLBACK_SEGMENTS.length],
        FALLBACK_SEGMENTS[(index - 1 + FALLBACK_SEGMENTS.length) % FALLBACK_SEGMENTS.length],
        FALLBACK_SEGMENTS[(index + 2) % FALLBACK_SEGMENTS.length]
      ]);
    };

  var buildBackgroundCandidates = typeof bgLogic.buildBackgroundCandidates === 'function'
    ? bgLogic.buildBackgroundCandidates
    : function(locationId, season, segment, sky) {
      var candidates = [];
      var skyOrder = getSkyFallbackOrder(sky);
      var seasonOrder = getSeasonFallbackOrder(season);
      var segmentOrder = getSegmentFallbackOrder(segment);
      var i;
      var j;
      var k;

      for (i = 0; i < segmentOrder.length; i++) {
        for (j = 0; j < seasonOrder.length; j++) {
          for (k = 0; k < skyOrder.length; k++) {
            candidates.push(locationId + '_' + seasonOrder[j] + '_' + segmentOrder[i] + '_' + skyOrder[k] + '.png');
          }
        }
      }

      return uniqueValues(candidates);
    };

  var getApprovedBackgroundRequest = typeof bgLogic.getApprovedBackgroundRequest === 'function'
    ? bgLogic.getApprovedBackgroundRequest
    : function(locationId, season, segment, sky) {
      return {
        requestedKey: locationId + '_' + season + '_' + segment + '_' + sky + '.png',
        requestedSeason: season,
        renderSeason: season,
        approved: true,
        approvalStatus: season === 'winter' ? 'approved_winter' : 'approved_seasonal'
      };
    };

  var getWeatherFromOpenMeteoPayload = function(payload) {
    var current = payload && payload.current ? payload.current : null;
    var legacyCurrent = payload && payload.current_weather ? payload.current_weather : null;
    var temp = null;
    var code = null;

    if (current && current.temperature_2m != null && current.weather_code != null) {
      temp = current.temperature_2m;
      code = current.weather_code;
    } else if (legacyCurrent && legacyCurrent.temperature != null && legacyCurrent.weathercode != null) {
      temp = legacyCurrent.temperature;
      code = legacyCurrent.weathercode;
    }

    if (temp == null || code == null) {
      return null;
    }

    return {
      text: Math.round(Number(temp)) + '°F · ' + weatherCondition(code),
      kind: mapOpenMeteoCodeToKind(code)
    };
  };

  var metNoCondition = function(symbolCode) {
    if (!symbolCode) {
      return 'Current conditions';
    }

    var code = String(symbolCode).replace(/_(day|night|polartwilight)$/i, '');

    if (code.indexOf('thunder') !== -1) {
      return 'Thunderstorm';
    }
    if (code.indexOf('snow') !== -1) {
      return 'Snow';
    }
    if (code.indexOf('sleet') !== -1) {
      return 'Sleet';
    }
    if (code.indexOf('rain') !== -1) {
      return 'Rain';
    }
    if (code.indexOf('fog') !== -1) {
      return 'Fog';
    }
    if (code.indexOf('partlycloudy') !== -1) {
      return 'Partly cloudy';
    }
    if (code.indexOf('cloudy') !== -1) {
      return 'Cloudy';
    }
    if (code.indexOf('clearsky') !== -1) {
      return 'Clear';
    }
    if (code.indexOf('fair') !== -1) {
      return 'Fair';
    }

    return 'Current conditions';
  };

  var getWeatherFromMetNoPayload = function(payload) {
    var timeseries = payload && payload.properties && payload.properties.timeseries ? payload.properties.timeseries[0] : null;
    var details = timeseries && timeseries.data && timeseries.data.instant ? timeseries.data.instant.details : null;
    var tempC = details ? details.air_temperature : null;
    var summary = null;

    if (timeseries && timeseries.data) {
      summary = (timeseries.data.next_1_hours && timeseries.data.next_1_hours.summary && timeseries.data.next_1_hours.summary.symbol_code)
        || (timeseries.data.next_6_hours && timeseries.data.next_6_hours.summary && timeseries.data.next_6_hours.summary.symbol_code)
        || (timeseries.data.next_12_hours && timeseries.data.next_12_hours.summary && timeseries.data.next_12_hours.summary.symbol_code);
    }

    if (tempC == null) {
      return null;
    }

    var tempF = (Number(tempC) * 9 / 5) + 32;
    return {
      text: Math.round(tempF) + '°F · ' + metNoCondition(summary),
      kind: mapMetNoSymbolToKind(summary)
    };
  };

  var fetchWeatherJson = function(url, parser) {
    return fetch(url).then(function(response) {
      if (!response.ok) {
        throw new Error('Weather request failed');
      }

      return response.text().then(function(text) {
        var payload = JSON.parse(text);
        var parsed = parser(payload);
        if (!parsed || !parsed.text) {
          throw new Error('Weather payload missing required fields');
        }
        return parsed;
      });
    });
  };

  var fetchWeather = function(location) {
    var openMeteoUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + encodeURIComponent(location.lat) + '&longitude=' + encodeURIComponent(location.lon) + '&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=' + encodeURIComponent(location.timeZone);
    var metNoUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=' + encodeURIComponent(location.lat) + '&lon=' + encodeURIComponent(location.lon);

    return fetchWeatherJson(openMeteoUrl, getWeatherFromOpenMeteoPayload)
      .catch(function() {
        return fetchWeatherJson(metNoUrl, getWeatherFromMetNoPayload);
      });
  };

  if (window.matchMedia) {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  var getSavedLocationIndex = function() {
    try {
      var saved = localStorage.getItem(storageKey);
      var i;
      if (saved === 'la') {
        saved = 'losangeles';
      }

      for (i = 0; i < locations.length; i++) {
        if (locations[i].id === saved) {
          return i;
        }
      }
    } catch (error) {
      // Ignore storage failures (privacy mode, etc.).
    }

    for (i = 0; i < locations.length; i++) {
      if (locations[i].id === 'sansebastian') {
        return i;
      }
    }

    return 0;
  };

  var formatSegment = function(segment) {
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  var formatLocalTime = function(timeZone) {
    try {
      if (window.Intl && Intl.DateTimeFormat) {
        var formatter = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: timeZone
        });
        return formatter.format(new Date());
      }
    } catch (error) {
      // Fall back to local time.
    }

    return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  var weatherCondition = function(code) {
    var map = {
      0: 'Clear',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Fog',
      51: 'Drizzle',
      53: 'Drizzle',
      55: 'Drizzle',
      56: 'Freezing drizzle',
      57: 'Freezing drizzle',
      61: 'Rain',
      63: 'Rain',
      65: 'Heavy rain',
      66: 'Freezing rain',
      67: 'Freezing rain',
      71: 'Snow',
      73: 'Snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Rain showers',
      81: 'Rain showers',
      82: 'Heavy rain showers',
      85: 'Snow showers',
      86: 'Snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm',
      99: 'Thunderstorm'
    };

    return map[code] || 'Current conditions';
  };

  var getCachedWeather = function(location) {
    var cached = weatherCache[location.id];
    if (cached && Date.now() - cached.updatedAt < WEATHER_CACHE_TTL_MS) {
      return cached.data;
    }
    return null;
  };

  var getWeather = function(location) {
    var cached = getCachedWeather(location);
    if (cached) {
      return Promise.resolve(cached);
    }

    if (weatherInFlight[location.id]) {
      return weatherInFlight[location.id];
    }

    weatherInFlight[location.id] = fetchWeather(location)
      .then(function(result) {
        weatherCache[location.id] = {
          data: result,
          updatedAt: Date.now()
        };
        return result;
      })
      .finally(function() {
        delete weatherInFlight[location.id];
      });

    return weatherInFlight[location.id];
  };

  var updateWeatherText = function(location, text) {
    var weatherEl = locationTime.querySelector('.weather');
    if (!weatherEl || !location) {
      return;
    }
    weatherEl.textContent = text || 'Weather unavailable';
  };

  var updateLocationTime = function(location, weatherText) {
    var labelEl = locationTime.querySelector('.label');
    var valueEl = locationTime.querySelector('.value');

    if (labelEl) {
      labelEl.textContent = 'Location';
    }
    if (valueEl) {
      valueEl.textContent = location.label + ' · ' + formatLocalTime(location.timeZone);
    }
    updateWeatherText(location, weatherText);
  };

  var updateActiveButton = function(locationId) {
    var buttons = menu.querySelectorAll('[data-location]');
    var i;

    for (i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      var isActive = button.getAttribute('data-location') === locationId;

      if (isActive) {
        button.classList.add('is-active');
      } else {
        button.classList.remove('is-active');
      }
    }
  };

  var randomBetween = function(min, max) {
    return min + Math.random() * (max - min);
  };

  var ensureOverlayCanvas = function() {
    if (!overlayCanvas) {
      overlayCanvas = document.createElement('canvas');
      overlayCanvas.className = 'snow-canvas weather-canvas';
      overlayCanvas.setAttribute('aria-hidden', 'true');
      bg.appendChild(overlayCanvas);
    }

    if (!overlayCtx && overlayCanvas.getContext) {
      overlayCtx = overlayCanvas.getContext('2d');
    }
  };

  var resizeOverlayCanvas = function() {
    if (!overlayCanvas || !overlayCtx) {
      return;
    }

    var width = bg.clientWidth || window.innerWidth;
    var height = bg.clientHeight || window.innerHeight;
    var ratio = window.devicePixelRatio || 1;

    overlayCanvas.width = Math.max(1, Math.floor(width * ratio));
    overlayCanvas.height = Math.max(1, Math.floor(height * ratio));
    overlayCanvas.style.width = width + 'px';
    overlayCanvas.style.height = height + 'px';
    overlayCtx.setTransform(ratio, 0, 0, ratio, 0, 0);

    overlayBounds.width = width;
    overlayBounds.height = height;
  };

  var createSnowParticle = function(width, height) {
    var depth = Math.random();
    var size = randomBetween(0.6, 1.6) + depth * 1.6;
    var speed = randomBetween(18, 46) + depth * 62;
    var drift = randomBetween(-36, 36);
    var swayAmp = randomBetween(12, 54) + depth * 26;
    var swaySpeed = randomBetween(0.4, 1.5);
    var alpha = Math.min(0.95, randomBetween(0.25, 0.55) + depth * 0.35);

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: size,
      vy: speed,
      vx: drift,
      driftTarget: drift,
      swayAmp: swayAmp,
      swaySpeed: swaySpeed,
      swayPhase: Math.random() * Math.PI * 2,
      alpha: alpha
    };
  };

  var createRainParticle = function(width, height) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: randomBetween(-180, -100),
      vy: randomBetween(360, 660),
      length: randomBetween(12, 22),
      alpha: randomBetween(0.15, 0.34),
      width: randomBetween(0.8, 1.4)
    };
  };

  var createFogParticle = function(width, height) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: randomBetween(4, 16),
      vy: randomBetween(-3, 3),
      radius: randomBetween(80, 220),
      alpha: randomBetween(0.03, 0.08)
    };
  };

  var seedOverlayParticles = function(type) {
    var width = overlayBounds.width;
    var height = overlayBounds.height;
    var area = width * height;
    var count = Math.round(area * 0.00003);
    var i;

    overlayParticles = [];

    if (type === 'snow') {
      count = Math.max(40, Math.min(110, count));
      for (i = 0; i < count; i++) {
        overlayParticles.push(createSnowParticle(width, height));
      }
      return;
    }

    if (type === 'rain' || type === 'storm') {
      count = Math.round(area * 0.00009);
      count = Math.max(100, Math.min(260, count));
      for (i = 0; i < count; i++) {
        overlayParticles.push(createRainParticle(width, height));
      }
      return;
    }

    if (type === 'fog') {
      count = Math.round(area * 0.00001);
      count = Math.max(10, Math.min(26, count));
      for (i = 0; i < count; i++) {
        overlayParticles.push(createFogParticle(width, height));
      }
    }
  };

  var drawSnowOverlay = function(dt, width, height) {
    var i;

    for (i = 0; i < overlayParticles.length; i++) {
      var particle = overlayParticles[i];
      var sway;
      var drawX;

      if (Math.random() < 0.02) {
        particle.driftTarget = randomBetween(-70, 70);
      }

      particle.vx += (particle.driftTarget - particle.vx) * 0.02;
      particle.swayPhase += particle.swaySpeed * dt;
      sway = Math.sin(particle.swayPhase) * particle.swayAmp;

      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;

      drawX = particle.x + sway;

      if (drawX < -80) {
        particle.x = width + 80;
      } else if (drawX > width + 80) {
        particle.x = -80;
      }

      if (particle.y > height + 40) {
        particle.y = -40;
        particle.x = Math.random() * width;
        particle.swayPhase = Math.random() * Math.PI * 2;
      }

      overlayCtx.beginPath();
      overlayCtx.fillStyle = 'rgba(255, 255, 255, ' + particle.alpha.toFixed(3) + ')';
      overlayCtx.arc(drawX, particle.y, particle.radius, 0, Math.PI * 2);
      overlayCtx.fill();
    }
  };

  var drawRainOverlay = function(dt, width, height, stormMode) {
    var i;

    overlayCtx.lineCap = 'round';

    for (i = 0; i < overlayParticles.length; i++) {
      var particle = overlayParticles[i];
      var startX;
      var startY;
      var endX;
      var endY;

      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;

      if (particle.y > height + particle.length) {
        particle.y = -particle.length;
        particle.x = Math.random() * width;
      }

      if (particle.x < -60) {
        particle.x = width + 30;
      }

      startX = particle.x;
      startY = particle.y;
      endX = startX - particle.vx * 0.03;
      endY = startY - particle.length;

      overlayCtx.beginPath();
      overlayCtx.strokeStyle = stormMode
        ? 'rgba(214, 229, 255, ' + particle.alpha.toFixed(3) + ')'
        : 'rgba(186, 212, 255, ' + particle.alpha.toFixed(3) + ')';
      overlayCtx.lineWidth = particle.width;
      overlayCtx.moveTo(startX, startY);
      overlayCtx.lineTo(endX, endY);
      overlayCtx.stroke();
    }
  };

  var drawFogOverlay = function(dt, width, height) {
    var i;

    overlayCtx.fillStyle = 'rgba(214, 224, 232, 0.1)';
    overlayCtx.fillRect(0, 0, width, height);

    for (i = 0; i < overlayParticles.length; i++) {
      var particle = overlayParticles[i];
      var gradient;

      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;

      if (particle.x - particle.radius > width + 100) {
        particle.x = -particle.radius - 120;
        particle.y = Math.random() * height;
      }
      if (particle.y < -particle.radius) {
        particle.y = height + particle.radius;
      } else if (particle.y > height + particle.radius) {
        particle.y = -particle.radius;
      }

      gradient = overlayCtx.createRadialGradient(
        particle.x,
        particle.y,
        particle.radius * 0.2,
        particle.x,
        particle.y,
        particle.radius
      );
      gradient.addColorStop(0, 'rgba(226, 233, 239, ' + (particle.alpha * 1.6).toFixed(3) + ')');
      gradient.addColorStop(1, 'rgba(226, 233, 239, 0)');

      overlayCtx.fillStyle = gradient;
      overlayCtx.beginPath();
      overlayCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      overlayCtx.fill();
    }
  };

  var drawStormFlash = function(dt, width, height) {
    stormFlashCooldown -= dt;

    if (stormFlashCooldown <= 0 && Math.random() < 0.028) {
      stormFlashAlpha = randomBetween(0.1, 0.34);
      stormFlashCooldown = randomBetween(1.4, 5.1);
    }

    if (stormFlashAlpha > 0.005) {
      overlayCtx.fillStyle = 'rgba(238, 245, 255, ' + stormFlashAlpha.toFixed(3) + ')';
      overlayCtx.fillRect(0, 0, width, height);
      stormFlashAlpha *= 0.84;
    }
  };

  var updateOverlay = function(timestamp) {
    var width = overlayBounds.width;
    var height = overlayBounds.height;
    var dt;

    if (!overlayCtx || !width || !height) {
      return;
    }

    if (!overlayLastTime) {
      overlayLastTime = timestamp;
    }

    dt = (timestamp - overlayLastTime) / 1000;
    overlayLastTime = timestamp;
    if (dt > 0.05) {
      dt = 0.05;
    }

    overlayCtx.clearRect(0, 0, width, height);

    if (overlayType === 'snow') {
      drawSnowOverlay(dt, width, height);
    } else if (overlayType === 'rain') {
      drawRainOverlay(dt, width, height, false);
    } else if (overlayType === 'fog') {
      drawFogOverlay(dt, width, height);
    } else if (overlayType === 'storm') {
      overlayCtx.fillStyle = 'rgba(12, 18, 24, 0.08)';
      overlayCtx.fillRect(0, 0, width, height);
      drawRainOverlay(dt, width, height, true);
      drawStormFlash(dt, width, height);
    }

    overlayAnimationId = window.requestAnimationFrame(updateOverlay);
  };

  var startOverlay = function(type) {
    ensureOverlayCanvas();

    if (!overlayCtx || prefersReducedMotion || type === 'none') {
      stopOverlay();
      return;
    }

    overlayType = type;
    resizeOverlayCanvas();
    seedOverlayParticles(type);
    overlayLastTime = 0;
    stormFlashAlpha = 0;
    stormFlashCooldown = randomBetween(1.2, 4.8);
    bg.classList.add('has-weather-overlay');

    if (overlayAnimationId) {
      window.cancelAnimationFrame(overlayAnimationId);
    }

    overlayAnimationId = window.requestAnimationFrame(updateOverlay);

    if (!overlayResizeHandler) {
      overlayResizeHandler = function() {
        resizeOverlayCanvas();
        seedOverlayParticles(overlayType);
      };
      window.addEventListener('resize', overlayResizeHandler);
    }
  };

  var stopOverlay = function() {
    bg.classList.remove('has-weather-overlay');
    bg.classList.remove('has-snow');

    if (overlayAnimationId) {
      window.cancelAnimationFrame(overlayAnimationId);
      overlayAnimationId = null;
    }

    overlayType = 'none';
    overlayLastTime = 0;
    overlayParticles = [];
    stormFlashAlpha = 0;
    stormFlashCooldown = 0;

    if (overlayCtx && overlayBounds.width && overlayBounds.height) {
      overlayCtx.clearRect(0, 0, overlayBounds.width, overlayBounds.height);
    }

    if (overlayResizeHandler) {
      window.removeEventListener('resize', overlayResizeHandler);
      overlayResizeHandler = null;
    }
  };

  var applyBackgroundImage = function(imageUrl) {
    var assetInfo = getAssetInfoForUrl(imageUrl);
    currentResolvedAssetKey = assetInfo.key;
    currentResolvedAssetSource = assetInfo.source;

    if (currentImageUrl && currentImageUrl !== imageUrl) {
      window.clearTimeout(fadeOutTimeoutId);
      window.clearTimeout(fadeInTimeoutId);

      bg.classList.add('is-fading');
      fadeOutTimeoutId = window.setTimeout(function() {
        bg.style.setProperty('--bg-image', 'url("' + imageUrl + '")');
        currentImageUrl = imageUrl;

        fadeInTimeoutId = window.setTimeout(function() {
          bg.classList.remove('is-fading');
        }, 80);
      }, 350);
    } else {
      bg.style.setProperty('--bg-image', 'url("' + imageUrl + '")');
      currentImageUrl = imageUrl;
    }

    updateDebugStatus();
  };

  var checkImageAvailability = function(url) {
    var isLocalGenerated = String(url || '').indexOf('/tools/background-generation/generated/') === 0;
    var cached = imageAvailabilityCache[url];

    if (!isLocalGenerated && (cached === true || cached === false)) {
      return Promise.resolve(cached);
    }
    if (!isLocalGenerated && cached && typeof cached.then === 'function') {
      return cached;
    }

    var probePromise = fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then(function(response) {
        return response.ok;
      })
      .catch(function() {
        return new Promise(function(resolve) {
          var probe = new Image();
          probe.onload = function() {
            resolve(true);
          };
          probe.onerror = function() {
            resolve(false);
          };
          probe.src = url + (url.indexOf('?') === -1 ? '?probe=1' : '&probe=1');
        });
      })
      .then(function(result) {
        if (!isLocalGenerated) {
          imageAvailabilityCache[url] = result;
        }
        return result;
      });

    if (!isLocalGenerated) {
      imageAvailabilityCache[url] = probePromise;
    }

    return probePromise;
  };

  var getLocalDebugCandidateNames = function(locationId, season, segment, sky) {
    return getLocalDebugBackgroundCandidates(locationId, season, segment, sky, backgroundAssetApproval);
  };

  var resolveLocalDebugImageUrl = function(locationId, season, segment, sky) {
    var names = getLocalDebugCandidateNames(locationId, season, segment, sky);
    var urls = names
      .map(buildLocalGeneratedUrlForName)
      .filter(function(url) { return !!url; });
    var index = 0;

    var next = function() {
      if (index >= urls.length) {
        return Promise.reject(new Error('No approved local debug asset available for ' + locationId));
      }

      var candidate = urls[index++];
      return checkImageAvailability(candidate).then(function(exists) {
        if (exists) {
          return candidate;
        }
        return next();
      });
    };

    return next();
  };

  var resolveImageUrl = function(locationId, season, segment, sky) {
    var names = buildBackgroundCandidates(locationId, season, segment, sky);
    var urls = [];
    names.forEach(function(name) {
      buildAssetUrlsForName(name).forEach(function(url) {
        if (urls.indexOf(url) === -1) {
          urls.push(url);
        }
      });
    });
    var index = 0;

    var next = function() {
      if (index >= urls.length) {
        return Promise.resolve(urls[0]);
      }

      var candidate = urls[index++];
      return checkImageAvailability(candidate).then(function(exists) {
        if (exists) {
          return candidate;
        }
        return next();
      });
    };

    return next();
  };

  var setBackground = function() {
    var location = locations[locationIndex];
    var now = new Date();
    var requestId = ++currentVisualRequestId;
    var autoSeason = getSeasonForDate(now, location.timeZone);
    var autoSegment = getTimeSegmentForDate(now, location.timeZone);
    var season = debugVisual.enabled && debugVisual.season !== 'auto' ? debugVisual.season : autoSeason;
    var segment = debugVisual.enabled && debugVisual.segment !== 'auto' ? debugVisual.segment : autoSegment;
    var seasonLabel = season.charAt(0).toUpperCase() + season.slice(1);
    var segmentLabel = formatSegment(segment);
    var cachedWeather = getCachedWeather(location);
    var weatherText = cachedWeather ? cachedWeather.text : 'Loading weather...';

    var applyVisualState = function(kind, text) {
      var normalizedKind = normalizeWeatherKind(kind, {
        season: season,
        locationId: location.id
      });
      var overlay = getOverlayForWeatherKind(normalizedKind);
      var sky = getSkyForWeatherKind(normalizedKind);

      updateLocationTime(location, text || 'Weather unavailable');
      toggle.setAttribute(
        'title',
        'Change background location (' + location.label + ' - ' + seasonLabel + ' ' + segmentLabel + ')'
      );
      toggle.setAttribute(
        'aria-label',
        'Change background location (' + location.label + ' - ' + seasonLabel + ' ' + segmentLabel + ')'
      );

      var approvalRequest = getApprovedBackgroundRequest(location.id, season, segment, sky, backgroundAssetApproval);

      currentRequestedAssetKey = location.id + '_' + season + '_' + segment + '_' + sky + '.png';
      currentApprovalStateLabel = debugVisual.enabled
        ? 'Using generated local assets'
        : (
          approvalRequest.approvalStatus === 'winter_fallback_failed_audit'
            ? 'Winter fallback due to failed audit'
            : (approvalRequest.approvalStatus === 'approved_winter' ? 'Approved winter' : 'Approved seasonal')
        );
      updateDebugStatus();

      var resolvePromise = debugVisual.enabled
        ? resolveLocalDebugImageUrl(location.id, season, segment, sky)
        : resolveImageUrl(location.id, approvalRequest.renderSeason, segment, sky);

      return resolvePromise.then(function(imageUrl) {
        var resolvedInfo = getAssetInfoForUrl(imageUrl);

        if (requestId !== currentVisualRequestId) {
          return;
        }

        applyBackgroundImage(imageUrl);
        currentApprovalStateLabel = resolvedInfo.key.indexOf('_winter_') !== -1
          ? (
            isLocalDebugSeasonBlocked(location.id, season)
              ? 'Using local winter fallback (blocked by manual audit)'
              : 'Using local winter fallback'
          )
          : 'Showing generated seasonal asset';
        updateDebugStatus();
        if (overlay === 'none') {
          stopOverlay();
        } else {
          startOverlay(overlay);
          bg.classList.toggle('has-snow', overlay === 'snow');
        }
      }).catch(function(error) {
        if (requestId !== currentVisualRequestId) {
          return;
        }

        currentResolvedAssetKey = 'missing-local-asset';
        currentResolvedAssetSource = 'local generated';
        currentApprovalStateLabel = 'Missing local generated asset';
        updateDebugStatus();
        stopOverlay();
      });
    };

    if (debugVisual.enabled && debugVisual.weather !== 'auto') {
      var debugRequestedKind = debugVisual.weather;
      var debugNormalizedKind = normalizeWeatherKind(debugRequestedKind, {
        season: season,
        locationId: location.id
      });
      weatherText = getDebugWeatherText(debugRequestedKind, debugNormalizedKind);
    }

    updateLocationTime(location, weatherText);
    updateActiveButton(location.id);

    if (debugVisual.enabled && debugVisual.weather !== 'auto') {
      applyVisualState(debugVisual.weather, weatherText);
      return;
    }

    getWeather(location)
      .catch(function() {
        return null;
      })
      .then(function(weatherData) {
        if (requestId !== currentVisualRequestId) {
          return null;
        }

        var kind = weatherData && weatherData.kind ? weatherData.kind : 'cloudy';
        return applyVisualState(kind, weatherData ? weatherData.text : 'Weather unavailable');
      });
  };

  locationIndex = getSavedLocationIndex();
  initLocalDebugPanel(function() {
    setBackground();
  });
  setBackground();

  var menuBackdrop = document.createElement('div');
  menuBackdrop.className = 'bg-menu-backdrop';
  document.body.appendChild(menuBackdrop);

  var closeMenu = function() {
    menu.classList.remove('is-visible');
    menu.setAttribute('aria-hidden', 'true');
    menuBackdrop.classList.remove('is-visible');
  };

  var openMenu = function() {
    menu.classList.add('is-visible');
    menu.setAttribute('aria-hidden', 'false');
    menuBackdrop.classList.add('is-visible');
  };

  toggle.addEventListener('click', function() {
    var isOpen = menu.classList.contains('is-visible');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.addEventListener('click', function(event) {
    var target = event.target;

    while (target && target !== menu) {
      if (target.getAttribute && target.getAttribute('data-location')) {
        break;
      }
      target = target.parentNode;
    }

    if (!target || target === menu) {
      return;
    }

    var nextId = target.getAttribute('data-location');
    var i;

    for (i = 0; i < locations.length; i++) {
      if (locations[i].id === nextId) {
        locationIndex = i;
        break;
      }
    }

    try {
      localStorage.setItem(storageKey, locations[locationIndex].id);
    } catch (error) {
      // Ignore storage failures (privacy mode, etc.).
    }

    setBackground();
    closeMenu();
  });

  document.addEventListener('click', function(event) {
    if (!menu.classList.contains('is-visible')) {
      return;
    }

    if (menu.contains(event.target) || toggle.contains(event.target)) {
      return;
    }

    closeMenu();
  });

  menuBackdrop.addEventListener('click', function() {
    if (menu.classList.contains('is-visible')) {
      closeMenu();
    }
  });

  var globeCanvas = toggle.querySelector('.globe-canvas');
  if (globeCanvas && globeCanvas.getContext) {
    var globeCtx = globeCanvas.getContext('2d');
    var globeAngle = 0;
    var globeHover = false;
    var globeSize = 0;
    var globeRadius = 0;
    var globeCenter = 0;

    var resizeGlobe = function() {
      var size = globeCanvas.clientWidth || 32;
      var ratio = window.devicePixelRatio || 1;
      globeCanvas.width = size * ratio;
      globeCanvas.height = size * ratio;
      globeCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      globeSize = size;
      globeRadius = size * 0.34;
      globeCenter = size / 2;
    };

    var projectPoint = function(point) {
      var depth = 0.55;
      var scale = 1 / (1 + point.z * depth);
      return {
        x: globeCenter + point.x * globeRadius * scale,
        y: globeCenter + point.y * globeRadius * scale,
        z: point.z
      };
    };

    var rotateY = function(point, angle) {
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos
      };
    };

    var mapReady = false;
    var mapTexture = null;

    var drawGlobe = function(angle) {
      globeCtx.clearRect(0, 0, globeSize, globeSize);
      globeCtx.imageSmoothingEnabled = true;

      var sphereFill = globeCtx.createRadialGradient(
        globeCenter - globeRadius * 0.5,
        globeCenter - globeRadius * 0.4,
        globeRadius * 0.2,
        globeCenter,
        globeCenter,
        globeRadius
      );
      sphereFill.addColorStop(0, 'rgba(20, 22, 26, 0.95)');
      sphereFill.addColorStop(0.6, 'rgba(12, 13, 16, 0.95)');
      sphereFill.addColorStop(1, 'rgba(5, 6, 8, 0.95)');

      globeCtx.fillStyle = sphereFill;
      globeCtx.beginPath();
      globeCtx.arc(globeCenter, globeCenter, globeRadius, 0, Math.PI * 2);
      globeCtx.fill();

      globeCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      globeCtx.lineWidth = 1;
      globeCtx.beginPath();
      globeCtx.arc(globeCenter, globeCenter, globeRadius, 0, Math.PI * 2);
      globeCtx.stroke();

      if (mapReady) {
        globeCtx.save();
        globeCtx.beginPath();
        globeCtx.arc(globeCenter, globeCenter, globeRadius, 0, Math.PI * 2);
        globeCtx.clip();

        globeCtx.globalCompositeOperation = 'screen';
        globeCtx.globalAlpha = 0.9;
        globeCtx.filter = 'grayscale(1)';
        globeCtx.imageSmoothingEnabled = true;

        var mapSource = mapTexture || mapImage;
        var mapW = mapSource.width;
        var mapH = mapSource.height;
        var radius = globeRadius;

        for (var x = -radius; x <= radius; x += 1) {
          var xNorm = x / radius;
          var lon = Math.asin(xNorm);
          var z = Math.cos(lon);
          var mapLon = lon + angle;
          var mapX = ((mapLon / (Math.PI * 2)) + 0.5) * mapW;
          mapX = (mapX % mapW + mapW) % mapW;

          var screenX = globeCenter + x;
          var colH = 2 * radius * z;
          var destY = globeCenter - colH / 2;

          globeCtx.drawImage(mapSource, mapX, 0, 1, mapH, screenX, destY, 1, colH);
        }

        globeCtx.restore();
        globeCtx.filter = 'none';
        globeCtx.globalCompositeOperation = 'source-over';
        globeCtx.globalAlpha = 1;
      }
    };

    var tick = function() {
      if (globeHover) {
        globeAngle += 0.02;
      }
      drawGlobe(globeAngle);
      window.requestAnimationFrame(tick);
    };

    var mapImage = new Image();
    var triedFallback = false;
    mapImage.onload = function() {
      var maxWidth = 720;
      var scale = Math.min(1, maxWidth / mapImage.width);
      if (scale < 1) {
        var texCanvas = document.createElement('canvas');
        texCanvas.width = Math.round(mapImage.width * scale);
        texCanvas.height = Math.round(mapImage.height * scale);
        var texCtx = texCanvas.getContext('2d');
        texCtx.imageSmoothingEnabled = true;
        texCtx.drawImage(mapImage, 0, 0, texCanvas.width, texCanvas.height);
        mapTexture = texCanvas;
      }
      mapReady = true;
      drawGlobe(globeAngle);
    };
    mapImage.onerror = function() {
      if (!triedFallback) {
        triedFallback = true;
        mapImage.src = 'https://uqmjvvghhhtjqbzzvtop.supabase.co/storage/v1/object/public/personal-website/theImage.png';
      }
    };
    mapImage.src = 'https://uqmjvvghhhtjqbzzvtop.supabase.co/storage/v1/object/public/personal-website/theImage.png';

    resizeGlobe();
    drawGlobe(globeAngle);
    window.addEventListener('resize', resizeGlobe);
    toggle.addEventListener('mouseenter', function() {
      globeHover = true;
    });
    toggle.addEventListener('mouseleave', function() {
      globeHover = false;
    });
    toggle.addEventListener('focus', function() {
      globeHover = true;
    });
    toggle.addEventListener('blur', function() {
      globeHover = false;
    });

    window.requestAnimationFrame(tick);
  }

  window.setInterval(setBackground, 60 * 1000);
})();

(() => {
  const frame = document.getElementById('resume-frame');
  const placeholder = document.getElementById('resume-placeholder');
  const download = document.getElementById('resume-download');
  const downloadWrap = download ? download.closest('.resume-link') : null;
  const buttons = document.querySelectorAll('.resume-variant');
  if (!frame || !download || !buttons.length) {
    return;
  }

  const availabilityCache = new Map();
  const FADE_DURATION = 250;
  const FADE_OUT_DELAY = 120;
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
    buttons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
  };

  const setResume = (src) => {
    frame.src = src + '#toolbar=0&navpanes=0&scrollbar=0&view=Fit';
    download.href = src;
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

  const showResume = (src, token) => {
    frame.classList.remove('is-hidden');
    if (placeholder) {
      placeholder.classList.remove('is-visible');
    }
    setDownloadVisible(true);
    const handleLoad = () => {
      if (token !== selectionToken) {
        return;
      }
      frame.classList.remove('is-fading');
    };
    frame.addEventListener('load', handleLoad, { once: true });
    setResume(src);
    window.setTimeout(() => {
      if (token !== selectionToken) {
        return;
      }
      frame.classList.remove('is-fading');
    }, FADE_DURATION + 200);
  };

  const showPlaceholder = (label, token, btn) => {
    setDownloadVisible(false);
    if (!placeholder) {
      frame.classList.add('is-hidden');
      frame.classList.remove('is-fading');
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
      frame.classList.add('is-hidden');
      frame.classList.remove('is-fading');
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
    const label = btn.getAttribute('data-resume-label') || 'This';
    setActive(btn);
    frame.classList.add('is-fading');
    if (placeholder) {
      placeholder.classList.remove('is-visible');
    }
    const fadeOut = new Promise((resolve) => {
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
      showResume(src, token);
      return;
    }
    showPlaceholder(label, token, btn);
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applySelection(btn);
    });
  });

  const initial = document.querySelector('.resume-variant.is-active') || buttons[0];
  if (initial) {
    applySelection(initial);
  }

  buttons.forEach((btn) => {
    if (!btn.classList.contains('is-active')) {
      ensureAvailability(btn);
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

  const popover = document.createElement('div');
  popover.className = 'skills-popover';

  const list = document.createElement('ul');
  list.className = 'skills-popover-list';
  popover.appendChild(list);

  document.body.appendChild(backdrop);
  document.body.appendChild(popover);

  let activeTrigger = null;

  const closePopover = () => {
    backdrop.classList.remove('is-visible');
    popover.classList.remove('is-visible');
    activeTrigger = null;
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
    activeTrigger = trigger;

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

  popover.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePopover();
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
