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
    { id: 'tokyo', label: 'Tokyo', timeZone: 'Asia/Tokyo' },
    { id: 'losangeles', label: 'Los Angeles', timeZone: 'America/Los_Angeles' },
    { id: 'annarbor', label: 'Ann Arbor', timeZone: 'America/New_York' },
    { id: 'detroit', label: 'Detroit', timeZone: 'America/New_York' },
    { id: 'nyc', label: 'New York City', timeZone: 'America/New_York' },
    { id: 'sansebastian', label: 'San Sebastian', timeZone: 'Europe/Madrid' }
  ];
  var storageKey = 'bgLocation';
  var locationIndex = 0;
  var currentImageUrl = null;
  var fadeOutTimeoutId = null;
  var fadeInTimeoutId = null;
  var snowLocationIds = ['annarbor', 'nyc'];
  var prefersReducedMotion = false;
  var snowCanvas = bg.querySelector('.snow-canvas');
  var snowCtx = null;
  var snowAnimationId = null;
  var snowParticles = [];
  var snowLastTime = 0;
  var snowBounds = { width: 0, height: 0 };
  var snowResizeHandler = null;

  if (window.matchMedia) {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  var getHourInTimeZone = function(timeZone) {
    try {
      if (window.Intl && Intl.DateTimeFormat) {
        var formatter = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          hour12: false,
          timeZone: timeZone
        });
        return Number(formatter.format(new Date()));
      }
    } catch (error) {
      // Fall back to local time.
    }

    return new Date().getHours();
  };

  var getTimeSegment = function(timeZone) {
    var hour = getHourInTimeZone(timeZone);

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

  var updateLocationTime = function(location) {
    var labelEl = locationTime.querySelector('.label');
    var valueEl = locationTime.querySelector('.value');

    if (labelEl) {
      labelEl.textContent = 'Location';
    }
    if (valueEl) {
      valueEl.textContent = location.label + ' · ' + formatLocalTime(location.timeZone);
    }
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

  var ensureSnowCanvas = function() {
    if (!snowCanvas) {
      snowCanvas = document.createElement('canvas');
      snowCanvas.className = 'snow-canvas';
      snowCanvas.setAttribute('aria-hidden', 'true');
      bg.appendChild(snowCanvas);
    }

    if (!snowCtx && snowCanvas.getContext) {
      snowCtx = snowCanvas.getContext('2d');
    }
  };

  var resizeSnowCanvas = function() {
    if (!snowCanvas || !snowCtx) {
      return;
    }

    var width = bg.clientWidth || window.innerWidth;
    var height = bg.clientHeight || window.innerHeight;
    var ratio = window.devicePixelRatio || 1;

    snowCanvas.width = Math.max(1, Math.floor(width * ratio));
    snowCanvas.height = Math.max(1, Math.floor(height * ratio));
    snowCanvas.style.width = width + 'px';
    snowCanvas.style.height = height + 'px';
    snowCtx.setTransform(ratio, 0, 0, ratio, 0, 0);

    snowBounds.width = width;
    snowBounds.height = height;
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

  var seedSnowParticles = function() {
    var width = snowBounds.width;
    var height = snowBounds.height;
    var area = width * height;
    var count = Math.round(area * 0.00003);
    var i;

    count = Math.max(40, Math.min(110, count));
    snowParticles = [];

    for (i = 0; i < count; i++) {
      snowParticles.push(createSnowParticle(width, height));
    }
  };

  var updateSnow = function(timestamp) {
    var width = snowBounds.width;
    var height = snowBounds.height;
    var i;

    if (!snowCtx || !width || !height) {
      return;
    }

    if (!snowLastTime) {
      snowLastTime = timestamp;
    }

    var dt = (timestamp - snowLastTime) / 1000;
    snowLastTime = timestamp;

    if (dt > 0.05) {
      dt = 0.05;
    }

    snowCtx.clearRect(0, 0, width, height);

    for (i = 0; i < snowParticles.length; i++) {
      var particle = snowParticles[i];
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

      snowCtx.beginPath();
      snowCtx.fillStyle = 'rgba(255, 255, 255, ' + particle.alpha.toFixed(3) + ')';
      snowCtx.arc(drawX, particle.y, particle.radius, 0, Math.PI * 2);
      snowCtx.fill();
    }

    snowAnimationId = window.requestAnimationFrame(updateSnow);
  };

  var startSnow = function() {
    ensureSnowCanvas();

    if (!snowCtx) {
      return;
    }

    resizeSnowCanvas();
    seedSnowParticles();
    snowLastTime = 0;

    if (snowAnimationId) {
      window.cancelAnimationFrame(snowAnimationId);
    }

    snowAnimationId = window.requestAnimationFrame(updateSnow);

    if (!snowResizeHandler) {
      snowResizeHandler = function() {
        resizeSnowCanvas();
        seedSnowParticles();
      };
      window.addEventListener('resize', snowResizeHandler);
    }
  };

  var stopSnow = function() {
    if (snowAnimationId) {
      window.cancelAnimationFrame(snowAnimationId);
      snowAnimationId = null;
    }

    snowLastTime = 0;

    if (snowCtx && snowBounds.width && snowBounds.height) {
      snowCtx.clearRect(0, 0, snowBounds.width, snowBounds.height);
    }

    if (snowResizeHandler) {
      window.removeEventListener('resize', snowResizeHandler);
      snowResizeHandler = null;
    }
  };

  var setBackground = function() {
    var location = locations[locationIndex];
    var segment = getTimeSegment(location.timeZone);
    var imageUrl = 'https://uqmjvvghhhtjqbzzvtop.supabase.co/storage/v1/object/public/personal-website/backgrounds/' + location.id + '_' + segment + '.png';
    var segmentLabel = formatSegment(segment);
    var shouldSnow = segment === 'night'
      && snowLocationIds.indexOf(location.id) !== -1
      && !prefersReducedMotion;

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

    toggle.setAttribute(
      'title',
      'Change background location (' + location.label + ' - ' + segmentLabel + ')'
    );
    toggle.setAttribute(
      'aria-label',
      'Change background location (' + location.label + ' - ' + segmentLabel + ')'
    );

    bg.classList.toggle('has-snow', shouldSnow);
    if (shouldSnow) {
      startSnow();
    } else {
      stopSnow();
    }
    updateLocationTime(location);
    updateActiveButton(location.id);
  };

  locationIndex = getSavedLocationIndex();
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
