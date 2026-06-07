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
  var seasonalLocations = {
    spring: [],
    fall: ['tokyo', 'detroit', 'nyc']
  };
  var seasonalOverrides = {
    spring: {
      detroit: 'fall'
    }
  };
  var storageBaseUrl = 'https://uqmjvvghhhtjqbzzvtop.supabase.co/storage/v1/object/public/personal-website/backgrounds/';
  var storageKey = 'bgLocation';
  var locationIndex = getSavedLocationIndex();

  function getSavedLocationIndex() {
    var savedId = '';

    try {
      savedId = localStorage.getItem(storageKey) || '';
    } catch (error) {
      return 0;
    }

    for (var i = 0; i < locations.length; i++) {
      if (locations[i].id === savedId) {
        return i;
      }
    }

    return 0;
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
    var assetSeason = seasonalOverrides[season] && seasonalOverrides[season][location.id]
      ? seasonalOverrides[season][location.id]
      : season;
    var availableLocations = seasonalLocations[season] || [];
    var filename = seasonalOverrides[season] && seasonalOverrides[season][location.id]
      ? location.id + '_' + assetSeason + '_' + segment + '_clear.png'
      : availableLocations.indexOf(location.id) !== -1
        ? location.id + '_' + season + '_' + segment + '_clear.png'
      : location.id + '_' + segment + '.png';

    return storageBaseUrl + filename;
  }

  function applyBackgroundImage(imageUrl) {
    bg.style.setProperty('--bg-image', 'url("' + imageUrl + '")');
  }

  function updateActiveButton(locationId) {
    Array.prototype.forEach.call(menu.querySelectorAll('[data-location]'), function(button) {
      button.classList.toggle('is-active', button.getAttribute('data-location') === locationId);
    });
  }

  function setBackground() {
    var location = locations[locationIndex];
    var parts = getLocationDateParts(location);
    var season = getSeason(parts.month, parts.day);
    var segment = getTimeSegment(parts.hour);

    locationTime.querySelector('.value').textContent = location.label + ' · ' + parts.time;
    locationTime.querySelector('.context').textContent = titleCase(season) + ' · ' + titleCase(segment);
    toggle.setAttribute('aria-label', 'Change background location');
    toggle.setAttribute('title', location.label + ' · ' + titleCase(season) + ' · ' + titleCase(segment));
    updateActiveButton(location.id);
    applyBackgroundImage(getImageUrl(location, season, segment));
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
      return location.id === button.getAttribute('data-location');
    });

    try {
      localStorage.setItem(storageKey, locations[locationIndex].id);
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

  setBackground();
  window.setInterval(setBackground, 60 * 1000);
})();
