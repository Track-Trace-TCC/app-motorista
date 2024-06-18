import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const MapWebView = forwardRef(({ route, onMessage }, ref) => {
    const webViewRef = useRef(null);

    useImperativeHandle(ref, () => ({
        postMessage: (message) => {
            console.log('Sending message to WebView:', message);
            webViewRef.current?.postMessage(message);
        },
        moveCar: (position) => {
            const message = JSON.stringify({ type: 'moveCar', data: { position } });
            console.log('Sending moveCar message:', message);
            webViewRef.current?.postMessage(message);
        }
    }));

    const injectedJavaScript = `
        (function() {
            console.log = function(message) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: message }));
            };

            function initialize() {
                console.log('Map initialization started');

                const map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: { lat: ${route.source.lat}, lng: ${route.source.lng} }
                });

                const directionsService = new google.maps.DirectionsService();
                const directionsRenderer = new google.maps.DirectionsRenderer({
                    map: map,
                    suppressMarkers: true
                });

                const legs = ${JSON.stringify(route.directions.routes[0].legs)};
                const waypoints = legs.slice(1, -1).map(leg => ({ location: { lat: leg.start_location.lat, lng: leg.start_location.lng }, stopover: true }));
                const origin = { lat: legs[0].start_location.lat, lng: legs[0].start_location.lng };
                const destination = { lat: legs[legs.length - 1].end_location.lat, lng: legs[legs.length - 1].end_location.lng };

                const request = {
                    origin: origin,
                    destination: destination,
                    waypoints: waypoints,
                    travelMode: google.maps.TravelMode.DRIVING
                };

                let carMarker = null;

                directionsService.route(request, (result, status) => {
                    if (status === 'OK') {
                        directionsRenderer.setDirections(result);
                        carMarker = new google.maps.Marker({
                            position: origin,
                            map: map,
                            icon: {
                                path: "M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.063-.667.267-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z",
                                fillColor: "#FF0000",
                                fillOpacity: 1,
                                strokeColor: "#FF0000",
                                strokeWeight: 1,
                                anchor: new google.maps.Point(0, 0),
                            }
                        });

                        // Adiciona marcadores de waypoints
                        legs.forEach((leg, index) => {
                            new google.maps.Marker({
                                position: leg.start_location,
                                map: map,
                                label: {
                                    text: String(index + 1),
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                },
                            });
                        });

                        // Adiciona o botão de navegação
                        const navigateButton = document.createElement('button');
                        navigateButton.textContent = 'Navegar';
                        navigateButton.style.position = 'absolute';
                        navigateButton.style.top = '10px';
                        navigateButton.style.right = '10px';
                        navigateButton.style.padding = '10px 20px';
                        navigateButton.style.backgroundColor = '#007bff';
                        navigateButton.style.color = '#fff';
                        navigateButton.style.border = 'none';
                        navigateButton.style.borderRadius = '5px';
                        navigateButton.style.cursor = 'pointer';

                        navigateButton.addEventListener('click', () => {
                            const waypoints = legs.slice(1, -1).map(leg => \`\${leg.start_location.lat},\${leg.start_location.lng}\`).join('|');
                            const navigationUrl = \`https://www.google.com/maps/dir/?api=1&origin=\${origin.lat},\${origin.lng}&destination=\${destination.lat},\${destination.lng}&waypoints=\${waypoints}&travelmode=driving\`;
                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'navigate', data: { url: navigationUrl } }));
                        });

                        document.body.appendChild(navigateButton);
                    } else {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ error: status }));
                    }
                });

                // Adiciona listener para mensagens do React Native
                console.log('Adding message listener for moveCar');
                document.addEventListener('message', (event) => {
                    console.log('Received message in WebView:', event.data);
                    try {
                        const message = JSON.parse(event.data);
                        if (message.type === 'moveCar' && carMarker) {
                            const { position } = message.data;
                            console.log('Moving car to position:', position);
                            carMarker.setPosition(new google.maps.LatLng(position.lat, position.lng));
                        }
                    } catch (error) {
                        console.error('Failed to move car:', error);
                    }
                });
            }

            initialize();
        })();
    `;

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                style={{ width, height }}
                originWhitelist={['*']}
                source={{
                    html: `
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <title>Google Maps</title>
                            <script src="https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}"></script>
                            <style>
                                #map {
                                    height: 100%;
                                    width: 100%;
                                }
                                html, body {
                                    height: 100%;
                                    margin: 0;
                                    padding: 0;
                                }
                            </style>
                        </head>
                        <body>
                            <div id="map"></div>
                            <script>
                                ${injectedJavaScript}
                            </script>
                        </body>
                    </html>
                `}}
                javaScriptEnabled
                onMessage={(event) => {
                    const message = JSON.parse(event.nativeEvent.data);
                    if (message.type === 'log') {
                        console.log('WebView log:', message.message);
                    } else if (message.type === 'navigate') {
                        onMessage && onMessage(message.data);
                    }
                }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapWebView;
