(function() {
  var mapElement = document.getElementById('travel-map');
  if (!mapElement) {
    return;
  }

  var destinations = [
    [42.270109,-83.739132],[42.332068,-83.055234],[41.871008,-87.631726],[40.727918,-73.999066],
    [38.246718,-85.758556],[27.945784,-82.450299],[28.530141,-81.381878],[33.418738,-112.096905],
    [34.038909,-118.257488],[37.76791,-122.443279],[32.710947,-117.154049],[35.72301,-83.526959],
    [35.566769,-82.554669],[39.502892,-85.773663],[37.320936,-121.885722],[38.890942,-77.029918],
    [39.937557,-75.167736],[40.416021,-79.987301],[41.646662,-83.555111],[40.091116,-88.240781],
    [42.944778,-85.658994],[45.756423,-84.719663],[44.739334,-85.620542],[43.317598,-83.730893],
    [33.041379,-112.053647],[51.507218,-0.127586],[48.856614,2.352222],[42.360082,-71.05888],
    [43.318334,-1.981231],[42.812526,-1.645774],[42.350466,-3.689354],[41.902783,12.496365],
    [41.902916,12.453389],[35.676423,139.650027],[34.693725,135.502253],[35.011564,135.768149],
    [34.685109,135.804802],[35.233769,139.108845],[40.220377,-74.011821],[45.515232,-122.678385],
    [47.596233,-120.661477],[43.072166,-89.40075],[47.376887,8.541694],[52.367573,4.904139],
    [50.075538,14.4378],[40.416728,-3.703291],[43.26338,-2.934812],[41.387397,2.168568],
    [44.058173,-121.31531],[47.606139,-122.332848],[47.23706,-121.178979],[37.704307,-85.871238],
    [18.415311,-66.059351],[30.267153,-97.743061],[45.646956,-84.47448],[44.251953,-85.401162],
    [42.789387,-86.108951],[45.027513,-84.674752],[44.661404,-84.714751],[44.811108,-86.060093],
    [44.652236,-84.129728],[42.655025,-86.201982],[41.676355,-86.25199],[39.76909,-86.158018],
    [42.733599,-84.553866],[43.419561,-83.947371],[41.374774,-83.651323],[42.093858,-86.489546],
    [41.750839,-88.153535],[35.790391,-83.563748],[43.597807,-84.767514],[41.916434,-83.39771],
    [53.349805,-6.26031],[53.372762,-6.058843],[64.146987,-21.940755],[35.148581,-90.051896],
    [36.162664,-86.781602],[41.49932,-81.694361],[38.722252,-9.139337]
  ];
  var airports = [
    [39.962543,-82.997975],[42.21322,-83.352482],[40.772663,-73.872421],[33.435249,-112.010124],
    [45.58527,-122.591718],[27.976865,-82.53028],[33.942153,-118.403605],[43.302788,-2.913954],
    [40.644612,-73.779728],[33.643619,-84.439136],[42.365602,-71.009614],[39.856349,-104.676406],
    [51.153662,-0.182063],[40.489515,-3.564276],[28.424442,-81.310459],[44.885059,-93.214435],
    [30.194085,-97.671089],[49.008861,2.54912],[41.79923,12.593174],[35.216299,-80.953943],
    [35.548296,139.777995],[38.952248,-77.457889],[51.46799,-0.455047],[43.138887,-89.336925],
    [50.101791,14.263181],[37.619114,-122.381627],[18.439504,-65.999228],[51.886375,0.241316],
    [43.679834,-79.628383],[47.461714,8.55086],[52.312787,4.74017],[41.29834,2.08001],
    [40.688484,-74.176864],[36.083091,-115.148224],[41.786776,-87.752188],[41.980259,-87.908986],
    [38.74994,-90.374819],[53.425632,-6.257375],[63.981712,-22.627578],[35.047528,-89.981255],
    [36.124885,-86.676218],[32.732891,-117.189712],[38.778845,-9.131976]
  ];
  var initialized = false;

  function loadStyle(href) {
    if (document.querySelector('link[href="' + href + '"]')) {
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve();
        } else {
          existing.addEventListener('load', resolve, { once: true });
          existing.addEventListener('error', reject, { once: true });
        }
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.addEventListener('load', function() {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.appendChild(script);
    });
  }

  function showError() {
    mapElement.innerHTML = '<div class="travel-map-error">The map could not load. <a href="https://snazzymaps.com/embed/474495" target="_blank" rel="noopener">Open the original map</a>.</div>';
  }

  function buildMap() {
    mapElement.innerHTML = '';
    var map = window.L.map(mapElement, {
      attributionControl: false,
      maxBounds: [[-85, -180], [85, 180]],
      minZoom: 0,
      scrollWheelZoom: false,
      worldCopyJump: false,
      zoomControl: true
    });

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(map);

    var pinIcon = window.L.divIcon({
      className: 'travel-map-pin-icon',
      html: '<span aria-hidden="true"></span>',
      iconAnchor: [4, 4],
      iconSize: [8, 8]
    });
    var airportIcon = window.L.divIcon({
      className: 'travel-map-airport-icon',
      html: '<span class="fas fa-plane" aria-hidden="true"></span>',
      iconAnchor: [6, 6],
      iconSize: [12, 12]
    });
    var columbusIcon = window.L.divIcon({
      className: 'travel-map-columbus-icon',
      html: '<span aria-hidden="true"></span>',
      iconAnchor: [7, 7],
      iconSize: [14, 14]
    });
    var markers = window.L.featureGroup();

    destinations.forEach(function(destination) {
      markers.addLayer(window.L.marker(destination, {
        icon: pinIcon,
        interactive: false,
        title: 'Travel destination'
      }));
    });
    airports.forEach(function(airport, index) {
      markers.addLayer(window.L.marker(airport, {
        icon: index === 0 ? columbusIcon : airportIcon,
        interactive: false,
        zIndexOffset: index === 0 ? 100 : -100,
        title: index === 0 ? 'Columbus (Go Blue)' : 'Flight connection'
      }));
    });
    map.addLayer(markers);
    map.fitBounds(markers.getBounds(), {
      animate: false,
      maxZoom: 2,
      padding: [24, 24]
    });
    window.setTimeout(function() {
      map.invalidateSize();
    }, 0);
  }

  function initializeMap() {
    if (initialized) {
      return;
    }
    initialized = true;

    loadStyle('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')
      .then(buildMap)
      .catch(showError);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) {
          return;
        }
        observer.disconnect();
        initializeMap();
      });
    }, { rootMargin: '300px 0px' });
    observer.observe(mapElement);
  } else {
    initializeMap();
  }
})();
