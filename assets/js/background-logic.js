(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BackgroundLogic = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  var SEASONS = ['spring', 'summer', 'fall', 'winter'];
  var SEGMENTS = ['morning', 'day', 'evening', 'night'];
  var SKY_CHAIN = ['dark', 'cloudy', 'partly', 'clear'];
  var OVERLAY_PRIORITY = ['storm', 'snow', 'rain', 'fog', 'none'];
  var NEVER_SNOW_LOCATIONS = {
    losangeles: true
  };
  var LOCAL_DEBUG_BLOCKED_SEASONS = {
    nyc: {
      spring: 'manual_audit_failed'
    },
    tokyo: {
      spring: 'manual_audit_failed'
    },
    detroit: {
      spring: 'manual_audit_failed'
    }
  };

  var getDatePartInTimeZone = function(date, timeZone, part) {
    try {
      if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        var formatter = new Intl.DateTimeFormat('en-US', {
          hour12: false,
          timeZone: timeZone,
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric'
        });
        var parts = formatter.formatToParts(date);
        var i;

        for (i = 0; i < parts.length; i++) {
          if (parts[i].type === part) {
            return Number(parts[i].value);
          }
        }
      }
    } catch (error) {
      // Fall back below.
    }

    if (part === 'month') {
      return date.getMonth() + 1;
    }
    if (part === 'day') {
      return date.getDate();
    }
    return date.getHours();
  };

  var getSeasonForDate = function(date, timeZone) {
    var month = getDatePartInTimeZone(date, timeZone, 'month');

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

  var getTimeSegmentForDate = function(date, timeZone) {
    var hour = getDatePartInTimeZone(date, timeZone, 'hour');

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

  var unique = function(values) {
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

  var getNearestCyclicOrder = function(values, target) {
    var index = values.indexOf(target);
    var output = [];
    var distance;
    var prevIndex;
    var nextIndex;

    if (index === -1) {
      return values.slice();
    }

    output.push(values[index]);

    for (distance = 1; distance <= Math.floor(values.length / 2); distance++) {
      prevIndex = (index - distance + values.length) % values.length;
      nextIndex = (index + distance) % values.length;

      output.push(values[prevIndex]);
      output.push(values[nextIndex]);
    }

    return unique(output);
  };

  var getSkyFallbackOrder = function(sky) {
    var start = SKY_CHAIN.indexOf(sky);
    var output = [];
    var i;

    if (start === -1) {
      return SKY_CHAIN.slice();
    }

    for (i = start; i < SKY_CHAIN.length; i++) {
      output.push(SKY_CHAIN[i]);
    }

    return output;
  };

  var getSeasonFallbackOrder = function(season) {
    return getNearestCyclicOrder(SEASONS, season);
  };

  var getSegmentFallbackOrder = function(segment) {
    var index = SEGMENTS.indexOf(segment);

    if (index === -1) {
      return SEGMENTS.slice();
    }

    return unique([
      SEGMENTS[index],
      SEGMENTS[(index + 1) % SEGMENTS.length],
      SEGMENTS[(index - 1 + SEGMENTS.length) % SEGMENTS.length],
      SEGMENTS[(index + 2) % SEGMENTS.length]
    ]);
  };

  var getSkyForWeatherKind = function(kind) {
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

  var getOverlayForWeatherKind = function(kind) {
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

  var normalizeWeatherKind = function(kind, options) {
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
    if (NEVER_SNOW_LOCATIONS[locationId]) {
      return 'rain';
    }
    if (season && season !== 'winter') {
      return 'rain';
    }

    return resolvedKind;
  };

  var mapOpenMeteoCodeToKind = function(code) {
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

  var mapMetNoSymbolToKind = function(symbolCode) {
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

  var getBackgroundKey = function(locationId, season, segment, sky) {
    return locationId + '_' + season + '_' + segment + '_' + sky + '.png';
  };

  var getBackgroundApprovalRecord = function(key, approvalManifest) {
    if (approvalManifest && approvalManifest.assets && approvalManifest.assets[key]) {
      return approvalManifest.assets[key];
    }
    return null;
  };

  var getBackgroundApprovalStatus = function(key, approvalManifest) {
    var record = getBackgroundApprovalRecord(key, approvalManifest);

    if (record && record.status) {
      return record.status;
    }
    if (key.indexOf('_winter_') !== -1) {
      return 'approved';
    }
    if (
      approvalManifest &&
      approvalManifest.policy &&
      approvalManifest.policy.nonwinter_default_status
    ) {
      return approvalManifest.policy.nonwinter_default_status;
    }
    return 'fallback_only';
  };

  var getApprovedBackgroundRequest = function(locationId, season, segment, sky, approvalManifest) {
    var requestedKey = getBackgroundKey(locationId, season, segment, sky);
    var approvalStatus = getBackgroundApprovalStatus(requestedKey, approvalManifest);
    var approved = season === 'winter' || approvalStatus === 'approved';

    return {
      requestedKey: requestedKey,
      requestedSeason: season,
      renderSeason: approved ? season : 'winter',
      approved: approved,
      approvalStatus: approved
        ? (season === 'winter' ? 'approved_winter' : 'approved_seasonal')
        : 'winter_fallback_failed_audit'
    };
  };

  var isLocalDebugSeasonBlocked = function(locationId, season) {
    var normalizedLocation = String(locationId || '').toLowerCase();
    var normalizedSeason = String(season || '').toLowerCase();
    return !!(
      LOCAL_DEBUG_BLOCKED_SEASONS[normalizedLocation] &&
      LOCAL_DEBUG_BLOCKED_SEASONS[normalizedLocation][normalizedSeason]
    );
  };

  var buildBackgroundCandidates = function(locationId, season, segment, sky) {
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
          candidates.push(
            locationId + '_' + seasonOrder[j] + '_' + segmentOrder[i] + '_' + skyOrder[k] + '.png'
          );
        }
      }
    }

    return unique(candidates);
  };

  var buildApprovedBackgroundCandidates = function(locationId, season, segment, sky, approvalManifest) {
    var request = getApprovedBackgroundRequest(locationId, season, segment, sky, approvalManifest);
    return buildBackgroundCandidates(locationId, request.renderSeason, segment, sky);
  };

  var getLocalDebugBackgroundCandidates = function(locationId, season, segment, sky, approvalManifest) {
    var request = getApprovedBackgroundRequest(locationId, season, segment, sky, approvalManifest);
    var skyOrder = getSkyFallbackOrder(sky);
    var segmentOrder = getSegmentFallbackOrder(segment);
    var candidates = [];
    var i;
    var j;

    if (isLocalDebugSeasonBlocked(locationId, season)) {
      for (i = 0; i < segmentOrder.length; i++) {
        for (j = 0; j < skyOrder.length; j++) {
          candidates.push(getBackgroundKey(locationId, 'winter', segmentOrder[i], skyOrder[j]));
        }
      }
      return unique(candidates);
    }

    if (request.approved) {
      for (i = 0; i < segmentOrder.length; i++) {
        for (j = 0; j < skyOrder.length; j++) {
          candidates.push(getBackgroundKey(locationId, request.renderSeason, segmentOrder[i], skyOrder[j]));
        }
      }

      if (request.renderSeason !== 'winter') {
        for (i = 0; i < segmentOrder.length; i++) {
          for (j = 0; j < skyOrder.length; j++) {
            candidates.push(getBackgroundKey(locationId, 'winter', segmentOrder[i], skyOrder[j]));
          }
        }
      }
    } else {
      for (i = 0; i < segmentOrder.length; i++) {
        for (j = 0; j < skyOrder.length; j++) {
          candidates.push(getBackgroundKey(locationId, 'winter', segmentOrder[i], skyOrder[j]));
        }
      }
    }

    return unique(candidates);
  };

  return {
    SEASONS: SEASONS,
    SEGMENTS: SEGMENTS,
    SKY_CHAIN: SKY_CHAIN,
    OVERLAY_PRIORITY: OVERLAY_PRIORITY,
    getSeasonForDate: getSeasonForDate,
    getTimeSegmentForDate: getTimeSegmentForDate,
    getSeasonFallbackOrder: getSeasonFallbackOrder,
    getSegmentFallbackOrder: getSegmentFallbackOrder,
    getSkyFallbackOrder: getSkyFallbackOrder,
    getSkyForWeatherKind: getSkyForWeatherKind,
    getOverlayForWeatherKind: getOverlayForWeatherKind,
    normalizeWeatherKind: normalizeWeatherKind,
    mapOpenMeteoCodeToKind: mapOpenMeteoCodeToKind,
    mapMetNoSymbolToKind: mapMetNoSymbolToKind,
    getBackgroundKey: getBackgroundKey,
    getBackgroundApprovalRecord: getBackgroundApprovalRecord,
    getBackgroundApprovalStatus: getBackgroundApprovalStatus,
    getApprovedBackgroundRequest: getApprovedBackgroundRequest,
    isLocalDebugSeasonBlocked: isLocalDebugSeasonBlocked,
    buildBackgroundCandidates: buildBackgroundCandidates,
    buildApprovedBackgroundCandidates: buildApprovedBackgroundCandidates,
    getLocalDebugBackgroundCandidates: getLocalDebugBackgroundCandidates
  };
}));
