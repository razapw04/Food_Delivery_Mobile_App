import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import {WebView, type WebViewMessageEvent} from 'react-native-webview';

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapMarker = MapCoordinate & {
  id: string;
  title?: string;
  color?: string;
};

type AppMapProps = {
  style?: StyleProp<ViewStyle>;
  center: MapCoordinate;
  zoom?: number;
  markers?: MapMarker[];
  /** Fixed pin in center; parent should update center on drag end. */
  showCenterPin?: boolean;
  onRegionChangeComplete?: (coords: MapCoordinate) => void;
  onMarkerPress?: (markerId: string) => void;
};

const buildHtml = ({
  center,
  zoom,
  markers,
  showCenterPin,
}: {
  center: MapCoordinate;
  zoom: number;
  markers: MapMarker[];
  showCenterPin: boolean;
}) => {
  const markersJson = JSON.stringify(markers);
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #E8EEF2; }
    .center-pin {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -100%);
      z-index: 1000;
      pointer-events: none;
      font-size: 36px;
      line-height: 1;
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.25));
    }
    .leaflet-control-attribution { font-size: 9px; }
  </style>
</head>
<body>
  ${showCenterPin ? '<div class="center-pin">📍</div>' : ''}
  <div id="map"></div>
  <script>
    const center = [${center.latitude}, ${center.longitude}];
    const zoom = ${zoom};
    const markers = ${markersJson};
    const showCenterPin = ${showCenterPin ? 'true' : 'false'};

    const map = L.map('map', {
      zoomControl: false,
      attributionControl: true
    }).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const markerLayer = L.layerGroup().addTo(map);
    const markerRefs = {};

    function renderMarkers(list) {
      markerLayer.clearLayers();
      Object.keys(markerRefs).forEach(k => delete markerRefs[k]);
      list.forEach(item => {
        const marker = L.circleMarker([item.latitude, item.longitude], {
          radius: 10,
          color: '#FFFFFF',
          weight: 2,
          fillColor: item.color || '#FF7622',
          fillOpacity: 1
        });
        if (item.title) {
          marker.bindTooltip(item.title, { direction: 'top', offset: [0, -8] });
        }
        marker.on('click', function () {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerPress',
            id: item.id
          }));
        });
        marker.addTo(markerLayer);
        markerRefs[item.id] = marker;
      });
    }

    renderMarkers(markers);

    if (!showCenterPin && markers.length > 1) {
      const bounds = L.latLngBounds(markers.map(m => [m.latitude, m.longitude]));
      map.fitBounds(bounds.pad(0.25));
    } else if (!showCenterPin && markers.length === 1) {
      map.setView([markers[0].latitude, markers[0].longitude], Math.max(zoom, 14));
    }

    let moveTimer = null;
    let programmatic = false;
    function emitRegion() {
      const c = map.getCenter();
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'regionChange',
        latitude: c.lat,
        longitude: c.lng
      }));
    }

    map.on('moveend', function () {
      if (!showCenterPin || programmatic) return;
      if (moveTimer) clearTimeout(moveTimer);
      moveTimer = setTimeout(emitRegion, 220);
    });

    function handleNative(payload) {
      try {
        const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
        if (data.type === 'setCenter' && data.latitude && data.longitude) {
          programmatic = true;
          map.setView([data.latitude, data.longitude], data.zoom || map.getZoom(), { animate: true });
          setTimeout(function () { programmatic = false; }, 400);
        }
        if (data.type === 'setMarkers' && Array.isArray(data.markers)) {
          renderMarkers(data.markers);
          if (!showCenterPin && data.markers.length > 1) {
            programmatic = true;
            const bounds = L.latLngBounds(data.markers.map(m => [m.latitude, m.longitude]));
            map.fitBounds(bounds.pad(0.25));
            setTimeout(function () { programmatic = false; }, 400);
          }
        }
      } catch (e) {}
    }

    document.addEventListener('message', function (e) { handleNative(e.data); });
    window.addEventListener('message', function (e) { handleNative(e.data); });
  </script>
</body>
</html>`;
};

const AppMap = ({
  style,
  center,
  zoom = 14,
  markers = [],
  showCenterPin = false,
  onRegionChangeComplete,
  onMarkerPress,
}: AppMapProps) => {
  const webRef = useRef<WebView>(null);
  const lastSentCenter = useRef(`${center.latitude},${center.longitude}`);
  const html = useMemo(
    () =>
      buildHtml({
        center,
        zoom,
        markers,
        showCenterPin,
      }),
    // Initial HTML only — later updates go via inject.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showCenterPin],
  );

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as {
          type: string;
          id?: string;
          latitude?: number;
          longitude?: number;
        };
        if (
          data.type === 'regionChange' &&
          typeof data.latitude === 'number' &&
          typeof data.longitude === 'number'
        ) {
          onRegionChangeComplete?.({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
        if (data.type === 'markerPress' && data.id) {
          onMarkerPress?.(data.id);
        }
      } catch {
        // ignore malformed messages
      }
    },
    [onMarkerPress, onRegionChangeComplete],
  );

  const inject = useCallback((payload: Record<string, unknown>) => {
    webRef.current?.injectJavaScript(
      `handleNative(${JSON.stringify(payload)}); true;`,
    );
  }, []);

  React.useEffect(() => {
    const key = `${center.latitude},${center.longitude}`;
    if (key === lastSentCenter.current) {
      return;
    }
    lastSentCenter.current = key;
    inject({
      type: 'setCenter',
      latitude: center.latitude,
      longitude: center.longitude,
      zoom,
    });
  }, [center.latitude, center.longitude, zoom, inject]);

  React.useEffect(() => {
    inject({
      type: 'setMarkers',
      markers,
    });
  }, [markers, inject]);

  return (
    <View style={[styles.wrap, style]}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{html}}
        onMessage={onMessage}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        androidLayerType="hardware"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#E8EEF2',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default AppMap;
