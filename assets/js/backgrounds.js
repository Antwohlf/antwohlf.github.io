(function() {
  var bg = document.getElementById('bg');
  var toggle = document.getElementById('bg-toggle');
  var menu = document.getElementById('bg-menu');
  var locationTime = document.getElementById('location-time');

  if (!bg || !toggle || !menu || !locationTime) {
    return;
  }

  var locations = [
    { id: 'detroit', label: 'Detroit', timeZone: 'America/New_York', active: true },
    { id: 'annarbor', label: 'Ann Arbor', timeZone: 'America/New_York', active: true },
    { id: 'nyc', label: 'New York City', timeZone: 'America/New_York', active: true },
    { id: 'sansebastian', label: 'San Sebastian', timeZone: 'Europe/Madrid', active: true },
    { id: 'tokyo', label: 'Tokyo', timeZone: 'Asia/Tokyo', active: false },
    { id: 'losangeles', label: 'Los Angeles', timeZone: 'America/Los_Angeles', active: false }
  ];
  var activeLocationIds = ['detroit', 'annarbor', 'nyc', 'sansebastian'];
  var timeSegments = ['morning', 'day', 'evening', 'night'];
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
  var seasonalApprovalState = getSeasonalApprovalState();
  var isLocalReviewMode = window.location.protocol === 'file:' || ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.hostname) !== -1;
  var remoteStorageBaseUrl = 'https://uqmjvvghhhtjqbzzvtop.supabase.co/storage/v1/object/public/personal-website/backgrounds/';
  var localStorageBaseUrl = '/dev-assets/supabase-mirror/personal-website/backgrounds/';
  var storageBaseUrl = isLocalReviewMode ? localStorageBaseUrl : remoteStorageBaseUrl;
  var storageKey = 'bgLocation';
  var reviewSegmentKey = 'bgReviewSegment';
  var locationIndex = getSavedLocationIndex();
  var reviewSegment = getSavedReviewSegment();

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

  function getImageUrl(location, season, segment) {
    var seasonalFilename = location.id + '_' + season + '_' + segment + '_clear.png';
    var approvalState = seasonalApprovalState[season];
    var locationSeasonApproved = approvalState && approvalState.approvedLocationIds.indexOf(location.id) !== -1;
    var filename = locationSeasonApproved && approvalState.approvedKeys.indexOf(seasonalFilename) !== -1
      ? seasonalFilename
      : location.id + '_' + segment + '.png';

    return storageBaseUrl + filename;
  }

  function getReviewImageUrl(location, segment) {
    return storageBaseUrl + location.id + '_summer_' + segment + '_clear.png';
  }

  function applyBackgroundImage(imageUrl) {
    bg.style.setProperty('--bg-image', 'url("' + imageUrl + '")');
  }

  function updateActiveButton(locationId) {
    Array.prototype.forEach.call(menu.querySelectorAll('[data-location]'), function(button) {
      button.classList.toggle('is-active', button.getAttribute('data-location') === locationId);
    });

    Array.prototype.forEach.call(menu.querySelectorAll('[data-review-segment]'), function(button) {
      button.classList.toggle('is-active', button.getAttribute('data-review-segment') === reviewSegment);
    });
  }

  function setBackground() {
    var location = locations[locationIndex];
    var parts = getLocationDateParts(location);
    var season = getSeason(parts.month, parts.day);
    var segment = isLocalReviewMode ? reviewSegment : getTimeSegment(parts.hour);
    var renderSeason = isLocalReviewMode ? 'summer' : season;

    locationTime.querySelector('.value').textContent = location.label + ' · ' + parts.time;
    locationTime.querySelector('.context').textContent = titleCase(renderSeason) + ' · ' + titleCase(segment);
    toggle.setAttribute('aria-label', 'Change background location');
    toggle.setAttribute('title', location.label + ' · ' + titleCase(renderSeason) + ' · ' + titleCase(segment));
    updateActiveButton(location.id);
    applyBackgroundImage(isLocalReviewMode ? getReviewImageUrl(location, segment) : getImageUrl(location, season, segment));
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

  document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  buildLocalReviewControls();
  setBackground();
  window.setInterval(setBackground, 60 * 1000);
})();
