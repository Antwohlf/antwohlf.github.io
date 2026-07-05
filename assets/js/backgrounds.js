(function() {
  var bg = document.getElementById('bg');
  var toggle = document.getElementById('bg-toggle');
  var menu = document.getElementById('bg-menu');
  var locationTime = document.getElementById('location-time');

  if (!bg || !toggle || !menu || !locationTime) {
    return;
  }

  var locations = [
    { id: 'detroit', label: 'Detroit', timeZone: 'America/New_York', latitude: 42.3314, longitude: -83.0458, alertProvider: 'nws', active: true },
    { id: 'annarbor', label: 'Ann Arbor', timeZone: 'America/New_York', latitude: 42.2808, longitude: -83.7430, alertProvider: 'nws', active: true },
    { id: 'nyc', label: 'New York City', timeZone: 'America/New_York', latitude: 40.7812, longitude: -73.9665, alertProvider: 'nws', active: true },
    { id: 'sansebastian', label: 'San Sebastian', timeZone: 'Europe/Madrid', latitude: 43.3183, longitude: -1.9812, active: true },
    { id: 'tokyo', label: 'Tokyo', timeZone: 'Asia/Tokyo', active: false },
    { id: 'losangeles', label: 'Los Angeles', timeZone: 'America/Los_Angeles', active: false }
  ];
  var activeLocationIds = ['detroit', 'annarbor', 'nyc', 'sansebastian'];
  var timeSegments = ['morning', 'day', 'evening', 'night'];
  var skyVariants = ['clear', 'partly', 'cloudy', 'dark'];
  var seasonalAssetApprovals = {
    spring: {
      detroit_spring_morning_clear: false,
      detroit_spring_day_clear: false,
      detroit_spring_evening_clear: true,
      detroit_spring_night_clear: false,
      annarbor_spring_morning_clear: true,
      annarbor_spring_day_clear: true,
      annarbor_spring_evening_clear: true,
      annarbor_spring_night_clear: true,
      nyc_spring_morning_clear: true,
      nyc_spring_day_clear: false,
      nyc_spring_evening_clear: true,
      nyc_spring_night_clear: true,
      sansebastian_spring_morning_clear: false,
      sansebastian_spring_day_clear: false,
      sansebastian_spring_evening_clear: true,
      sansebastian_spring_night_clear: true
    },
    summer: {
      detroit_summer_morning_clear: true,
      detroit_summer_day_clear: true,
      detroit_summer_evening_clear: true,
      detroit_summer_night_clear: true,
      annarbor_summer_morning_clear: true,
      annarbor_summer_day_clear: true,
      annarbor_summer_evening_clear: true,
      annarbor_summer_night_clear: true,
      nyc_summer_morning_clear: true,
      nyc_summer_day_clear: true,
      nyc_summer_evening_clear: true,
      nyc_summer_night_clear: true,
      sansebastian_summer_morning_clear: true,
      sansebastian_summer_day_clear: true,
      sansebastian_summer_evening_clear: true,
      sansebastian_summer_night_clear: true
    }
  };
  var weatherAssetApprovals = {
    summer: {
      detroit: true,
      annarbor: true,
      nyc: true,
      sansebastian: true
    }
  };
  var seasonalApprovalState = getSeasonalApprovalState();
  var weatherApprovalState = getWeatherApprovalState();
  var isLocalReviewMode = window.location.protocol === 'file:' || ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.hostname) !== -1;
  var remoteStorageBaseUrl = 'https://uqmjvvghhhtjqbzzvtop.supabase.co/storage/v1/object/public/personal-website/backgrounds/';
  var localStorageBaseUrl = '/dev-assets/supabase-mirror/personal-website/backgrounds/';
  var storageBaseUrl = isLocalReviewMode ? localStorageBaseUrl : remoteStorageBaseUrl;
  var storageKey = 'bgLocation';
  var reviewSegmentKey = 'bgReviewSegment';
  var reviewSkyKey = 'bgReviewSky';
  var weatherCacheKeyPrefix = 'bgWeather:v3:';
  var weatherCacheTtlMs = 5 * 60 * 1000;
  var stormWeatherCacheTtlMs = 2 * 60 * 1000;
  var staleWeatherCacheTtlMs = 60 * 60 * 1000;
  var weatherFetchTimeoutMs = 4500;
  var locationIndex = getSavedLocationIndex();
  var reviewSegment = getSavedReviewSegment();
  var reviewSky = getSavedReviewSky();
  var weatherStateByLocation = {};

  function getSeasonalApprovalState() {
    var state = {};

    Object.keys(seasonalAssetApprovals).forEach(function(season) {
      var approvedKeys = [];

      activeLocationIds.forEach(function(locationId) {
        timeSegments.forEach(function(segment) {
          var key = locationId + '_' + season + '_' + segment + '_clear';
          if (seasonalAssetApprovals[season][key]) {
            approvedKeys.push(key + '.png');
          }
        });
      });

      var approvedLocationIds = activeLocationIds.filter(function(locationId) {
        return timeSegments.every(function(segment) {
          return seasonalAssetApprovals[season][locationId + '_' + season + '_' + segment + '_clear'];
        });
      });

      state[season] = {
        approvedKeys: approvedKeys,
        approvedLocationIds: approvedLocationIds
      };
    });

    return state;
  }

  function getWeatherApprovalState() {
    var state = {};

    Object.keys(weatherAssetApprovals).forEach(function(season) {
      state[season] = {};

      activeLocationIds.forEach(function(locationId) {
        state[season][locationId] = weatherAssetApprovals[season] && weatherAssetApprovals[season][locationId] === true;
      });
    });

    return state;
  }

  function getSavedLocationIndex() {
    var savedId = '';

    try {
      savedId = localStorage.getItem(storageKey) || '';
    } catch (error) {
      return 0;
    }

    for (var i = 0; i < locations.length; i++) {
      if (locations[i].active && locations[i].id === savedId) {
        return i;
      }
    }

    return 0;
  }

  function getSavedReviewSegment() {
    var savedSegment = '';

    try {
      savedSegment = localStorage.getItem(reviewSegmentKey) || '';
    } catch (error) {
      return 'morning';
    }

    return timeSegments.indexOf(savedSegment) !== -1 ? savedSegment : 'morning';
  }

  function getSavedReviewSky() {
    var savedSky = '';

    try {
      savedSky = localStorage.getItem(reviewSkyKey) || '';
    } catch (error) {
      return 'clear';
    }

    return skyVariants.indexOf(savedSky) !== -1 ? savedSky : 'clear';
  }

  function getLocationDateParts(location) {
    var parts = new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: location.timeZone
    }).formatToParts(new Date());
    var values = {};

    parts.forEach(function(part) {
      values[part.type] = part.value;
    });

    return {
      month: Number(values.month),
      day: Number(values.day),
      hour: Number(values.hour) % 12 + (values.dayPeriod === 'PM' ? 12 : 0),
      time: values.hour + ':' + values.minute + ' ' + values.dayPeriod
    };
  }

  function getSeason(month, day) {
    var date = month * 100 + day;

    if (date >= 320 && date < 621) {
      return 'spring';
    }
    if (date >= 621 && date < 922) {
      return 'summer';
    }
    if (date >= 922 && date < 1221) {
      return 'fall';
    }
    return 'winter';
  }

  function getTimeSegment(hour) {
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
  }

  function titleCase(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function getWeatherLabel(code, fallbackSky) {
    if (code === 0) {
      return 'Clear';
    }
    if ([1, 2].indexOf(code) !== -1) {
      return 'Partly Cloudy';
    }
    if ([3].indexOf(code) !== -1) {
      return 'Cloudy';
    }
    if ([45, 48].indexOf(code) !== -1) {
      return 'Fog';
    }
    if ([51, 53, 55, 56, 57].indexOf(code) !== -1) {
      return 'Drizzle';
    }
    if ([61, 63, 65, 66, 67, 80, 81, 82].indexOf(code) !== -1) {
      return 'Rain';
    }
    if ([71, 73, 75, 77, 85, 86].indexOf(code) !== -1) {
      return 'Snow';
    }
    if ([95, 96, 99].indexOf(code) !== -1) {
      return 'Storm';
    }
    return titleCase(fallbackSky);
  }

  function getWeatherBucket(code, cloudCover) {
    if ([95, 96, 99, 65, 67, 82, 75, 86].indexOf(code) !== -1) {
      return 'dark';
    }
    if ([45, 48, 51, 53, 55, 56, 57, 61, 63, 66, 71, 73, 77, 80, 81, 85].indexOf(code) !== -1) {
      return 'cloudy';
    }
    if (code === 0) {
      return 'clear';
    }
    if ([1, 2].indexOf(code) !== -1) {
      return 'partly';
    }
    if (code === 3) {
      return 'cloudy';
    }
    if (typeof cloudCover === 'number') {
      if (cloudCover < 20) {
        return 'clear';
      }
      if (cloudCover < 70) {
        return 'partly';
      }
      return 'cloudy';
    }
    return 'clear';
  }

  function getOverlayKind(code) {
    if ([95, 96, 99].indexOf(code) !== -1) {
      return 'storm';
    }
    if ([61, 63, 65, 66, 67, 80, 81, 82, 51, 53, 55, 56, 57].indexOf(code) !== -1) {
      return 'rain';
    }
    if ([71, 73, 75, 77, 85, 86].indexOf(code) !== -1) {
      return 'snow';
    }
    if ([45, 48].indexOf(code) !== -1) {
      return 'fog';
    }
    return 'none';
  }

  function getFallbackWeather() {
    return {
      sky: 'clear',
      label: 'Clear',
      temperature: null,
      overlay: 'none',
      live: false
    };
  }

  function normalizeWeather(data) {
    var current = data && data.current ? data.current : {};
    var code = typeof current.weather_code === 'number' ? current.weather_code : null;
    var cloudCover = typeof current.cloud_cover === 'number' ? current.cloud_cover : null;
    var sky = code === null ? getWeatherBucket(null, cloudCover) : getWeatherBucket(code, cloudCover);

    return {
      sky: sky,
      label: code === null ? titleCase(sky) : getWeatherLabel(code, sky),
      temperature: typeof current.temperature_2m === 'number' ? Math.round(current.temperature_2m) : null,
      overlay: code === null ? 'none' : getOverlayKind(code),
      live: true
    };
  }

  function getAlertPriority(event) {
    var normalizedEvent = (event || '').toLowerCase();

    if (normalizedEvent.indexOf('tornado warning') !== -1) {
      return 50;
    }
    if (normalizedEvent.indexOf('tornado watch') !== -1) {
      return 45;
    }
    if (normalizedEvent.indexOf('severe thunderstorm warning') !== -1) {
      return 40;
    }
    if (normalizedEvent.indexOf('severe thunderstorm watch') !== -1) {
      return 35;
    }
    if (normalizedEvent.indexOf('severe thunderstorm') !== -1 || normalizedEvent.indexOf('tornado') !== -1) {
      return 30;
    }
    return 0;
  }

  function getAlertOverride(alertData) {
    var features = alertData && Array.isArray(alertData.features) ? alertData.features : [];
    var stormAlert = null;
    var stormAlertPriority = 0;

    features.forEach(function(feature) {
      var properties = feature && feature.properties ? feature.properties : {};
      var event = properties.event || '';
      var priority = getAlertPriority(event);

      if (priority > stormAlertPriority) {
        stormAlert = event;
        stormAlertPriority = priority;
      }
    });

    if (!stormAlert) {
      return null;
    }

    return {
      sky: 'dark',
      label: stormAlert,
      overlay: 'storm'
    };
  }

  function fetchJsonWithTimeout(url, options) {
    var controller = window.AbortController ? new AbortController() : null;
    var timeout = null;
    var requestOptions = options || {};

    if (controller) {
      requestOptions.signal = controller.signal;
      timeout = setTimeout(function() {
        controller.abort();
      }, weatherFetchTimeoutMs);
    }

    return window.fetch(url, requestOptions)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Weather request failed');
        }
        return response.json();
      })
      .finally(function() {
        if (timeout) {
          clearTimeout(timeout);
        }
      });
  }

  function applyAlertOverride(weather, alertOverride) {
    if (!alertOverride) {
      return weather;
    }

    return {
      sky: alertOverride.sky,
      label: alertOverride.label,
      temperature: weather ? weather.temperature : null,
      overlay: alertOverride.overlay,
      live: weather ? weather.live : true
    };
  }

  function fetchWeatherAlerts(location) {
    if (location.alertProvider !== 'nws') {
      return Promise.resolve(null);
    }

    var url = 'https://api.weather.gov/alerts/active'
      + '?point=' + encodeURIComponent(location.latitude + ',' + location.longitude);

    return fetchJsonWithTimeout(url, {
      headers: {
        Accept: 'application/geo+json'
      }
    })
      .then(getAlertOverride)
      .catch(function() {
        return null;
      });
  }

  function fetchCurrentWeather(location) {
    var url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + encodeURIComponent(location.latitude)
      + '&longitude=' + encodeURIComponent(location.longitude)
      + '&current=temperature_2m,weather_code,cloud_cover,precipitation,rain,snowfall'
      + '&temperature_unit=fahrenheit'
      + '&timezone=' + encodeURIComponent(location.timeZone);

    return fetchJsonWithTimeout(url)
      .then(normalizeWeather)
      .catch(function() {
        return null;
      });
  }

  function readCachedWeather(locationId, allowStale) {
    var cached = null;

    try {
      cached = JSON.parse(localStorage.getItem(weatherCacheKeyPrefix + locationId) || 'null');
    } catch (error) {
      return null;
    }

    if (!cached || !cached.timestamp || !cached.weather) {
      return null;
    }
    var age = Date.now() - cached.timestamp;
    var ttl = cached.weather.overlay === 'storm' ? stormWeatherCacheTtlMs : weatherCacheTtlMs;

    if (allowStale) {
      ttl = staleWeatherCacheTtlMs;
    }

    if (age > ttl) {
      return null;
    }
    return cached.weather;
  }

  function writeCachedWeather(locationId, weather) {
    try {
      localStorage.setItem(weatherCacheKeyPrefix + locationId, JSON.stringify({
        timestamp: Date.now(),
        weather: weather
      }));
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function fetchWeather(location) {
    if (!location.latitude || !location.longitude || !window.fetch) {
      weatherStateByLocation[location.id] = getFallbackWeather();
      setBackground();
      return;
    }

    var cachedWeather = readCachedWeather(location.id, false);
    if (cachedWeather) {
      weatherStateByLocation[location.id] = cachedWeather;
      setBackground();
      return;
    }

    Promise.all([fetchCurrentWeather(location), fetchWeatherAlerts(location)])
      .then(function(results) {
        var weather = results[0] || getFallbackWeather();
        var alertOverride = results[1];
        var staleWeather = null;

        if (!results[0] && !alertOverride) {
          staleWeather = readCachedWeather(location.id, true);
          if (staleWeather) {
            weather = staleWeather;
          }
        }

        weather = applyAlertOverride(weather, alertOverride);
        weatherStateByLocation[location.id] = weather;

        if (weather.live) {
          writeCachedWeather(location.id, weather);
        }
        setBackground();
      })
      .catch(function() {
        weatherStateByLocation[location.id] = readCachedWeather(location.id, true) || getFallbackWeather();
        setBackground();
      });
  }

  function getWeatherForLocation(location) {
    if (isLocalReviewMode) {
      return {
        sky: reviewSky,
        label: titleCase(reviewSky),
        temperature: null,
        overlay: 'none',
        live: false
      };
    }

    if (!weatherStateByLocation[location.id]) {
      weatherStateByLocation[location.id] = getFallbackWeather();
      fetchWeather(location);
    }

    return weatherStateByLocation[location.id];
  }

  function getSeasonalFilename(location, season, segment, sky) {
    return location.id + '_' + season + '_' + segment + '_' + sky + '.png';
  }

  function getImageUrl(location, season, segment, weather) {
    var sky = weather && skyVariants.indexOf(weather.sky) !== -1 ? weather.sky : 'clear';
    var requestedFilename = getSeasonalFilename(location, season, segment, sky);
    var clearFilename = getSeasonalFilename(location, season, segment, 'clear');
    var approvalState = seasonalApprovalState[season];
    var locationWeatherApproved = weatherApprovalState[season] && weatherApprovalState[season][location.id];
    var locationSeasonApproved = approvalState && approvalState.approvedLocationIds.indexOf(location.id) !== -1;
    var filename = locationWeatherApproved
      ? requestedFilename
      : locationSeasonApproved && approvalState.approvedKeys.indexOf(clearFilename) !== -1
      ? clearFilename
      : location.id + '_' + segment + '.png';

    return storageBaseUrl + filename;
  }

  function getReviewImageUrl(location, segment, sky) {
    return storageBaseUrl + location.id + '_summer_' + segment + '_' + sky + '.png';
  }

  function applyBackgroundImage(imageUrl) {
    bg.style.setProperty('--bg-image', 'url("' + imageUrl + '")');
  }

  function applyWeatherOverlay(overlay) {
    ['rain', 'snow', 'fog', 'storm'].forEach(function(kind) {
      bg.classList.toggle('weather-overlay-' + kind, overlay === kind);
    });
  }

  function updateActiveButton(locationId) {
    Array.prototype.forEach.call(menu.querySelectorAll('[data-location]'), function(button) {
      button.classList.toggle('is-active', button.getAttribute('data-location') === locationId);
    });

    Array.prototype.forEach.call(menu.querySelectorAll('[data-review-segment]'), function(button) {
      button.classList.toggle('is-active', button.getAttribute('data-review-segment') === reviewSegment);
    });

    Array.prototype.forEach.call(menu.querySelectorAll('[data-review-sky]'), function(button) {
      button.classList.toggle('is-active', button.getAttribute('data-review-sky') === reviewSky);
    });
  }

  function setBackground() {
    var location = locations[locationIndex];
    var parts = getLocationDateParts(location);
    var season = getSeason(parts.month, parts.day);
    var segment = isLocalReviewMode ? reviewSegment : getTimeSegment(parts.hour);
    var renderSeason = isLocalReviewMode ? 'summer' : season;
    var weather = getWeatherForLocation(location);
    var weatherText = weather.temperature === null
      ? weather.label
      : weather.temperature + '°F · ' + weather.label;

    locationTime.querySelector('.value').textContent = location.label + ' · ' + parts.time;
    locationTime.querySelector('.context').textContent = titleCase(renderSeason) + ' · ' + titleCase(segment) + ' · ' + weatherText;
    toggle.setAttribute('aria-label', 'Change background location');
    toggle.setAttribute('title', location.label + ' · ' + titleCase(renderSeason) + ' · ' + titleCase(segment) + ' · ' + weatherText);
    updateActiveButton(location.id);
    applyWeatherOverlay(weather.overlay);
    applyBackgroundImage(isLocalReviewMode ? getReviewImageUrl(location, segment, weather.sky) : getImageUrl(location, season, segment, weather));
  }

  function buildLocalReviewControls() {
    if (!isLocalReviewMode) {
      return;
    }

    var divider = document.createElement('div');
    divider.className = 'bg-menu-label';
    divider.textContent = 'Summer Review';
    menu.appendChild(divider);

    timeSegments.forEach(function(segment) {
      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-review-segment', segment);
      button.textContent = titleCase(segment);
      menu.appendChild(button);
    });

    var skyDivider = document.createElement('div');
    skyDivider.className = 'bg-menu-label';
    skyDivider.textContent = 'Sky Variant';
    menu.appendChild(skyDivider);

    skyVariants.forEach(function(sky) {
      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-review-sky', sky);
      button.textContent = titleCase(sky);
      menu.appendChild(button);
    });
  }

  function closeMenu() {
    menu.classList.remove('is-visible');
    menu.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', function() {
    if (menu.classList.contains('is-visible')) {
      closeMenu();
      return;
    }

    menu.classList.add('is-visible');
    menu.setAttribute('aria-hidden', 'false');
  });

  menu.addEventListener('click', function(event) {
    var button = event.target.closest('[data-location]');

    if (!button) {
      return;
    }

    locationIndex = locations.findIndex(function(location) {
      return location.active && location.id === button.getAttribute('data-location');
    });
    if (locationIndex === -1) {
      locationIndex = getSavedLocationIndex();
      closeMenu();
      return;
    }

    try {
      localStorage.setItem(storageKey, locations[locationIndex].id);
    } catch (error) {
      // Ignore storage failures.
    }

    setBackground();
    closeMenu();
  });

  menu.addEventListener('click', function(event) {
    var button = event.target.closest('[data-review-segment]');

    if (!button || !isLocalReviewMode) {
      return;
    }

    reviewSegment = button.getAttribute('data-review-segment');
    if (timeSegments.indexOf(reviewSegment) === -1) {
      reviewSegment = 'morning';
    }

    try {
      localStorage.setItem(reviewSegmentKey, reviewSegment);
    } catch (error) {
      // Ignore storage failures.
    }

    setBackground();
    closeMenu();
  });

  menu.addEventListener('click', function(event) {
    var button = event.target.closest('[data-review-sky]');

    if (!button || !isLocalReviewMode) {
      return;
    }

    reviewSky = button.getAttribute('data-review-sky');
    if (skyVariants.indexOf(reviewSky) === -1) {
      reviewSky = 'clear';
    }

    try {
      localStorage.setItem(reviewSkyKey, reviewSky);
    } catch (error) {
      // Ignore storage failures.
    }

    setBackground();
    closeMenu();
  });

  document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  buildLocalReviewControls();
  setBackground();
  window.setInterval(setBackground, 60 * 1000);
})();
