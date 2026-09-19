/*!
=========================================================
* Portfolio interactions (smooth scroll, map)
=========================================================
*/

$(document).ready(function () {
	$(".site-nav a[href^='#'], .hero a[href^='#']").on("click", function (event) {
		var hash = this.hash;
		if (!hash) return;

		var $target = $(hash);
		if (!$target.length) return;

		event.preventDefault();
		$("html, body").animate(
			{ scrollTop: $target.offset().top - 64 },
			700,
			function () {
				if (history.replaceState) {
					history.replaceState(null, null, hash);
				} else {
					window.location.hash = hash;
				}
			}
		);
	});
});

// Google Maps — centered near Shahkot / Faisalabad (portfolio address)
function initMap() {
	var mapEl = document.getElementById("map");
	if (!mapEl || typeof google === "undefined") return;

	new google.maps.Map(mapEl, {
		center: { lat: 31.5704, lng: 73.4855 },
		zoom: 11,
		scrollwheel: false,
		navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,
		styles: [
			{ elementType: "geometry", stylers: [{ color: "#f1f5f9" }] },
			{ elementType: "labels.text.stroke", stylers: [{ color: "#f1f5f9" }] },
			{ elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
			{
				featureType: "administrative.locality",
				elementType: "labels.text.fill",
				stylers: [{ color: "#334155" }]
			},
			{
				featureType: "poi",
				elementType: "labels.text.fill",
				stylers: [{ color: "#64748b" }]
			},
			{
				featureType: "poi.park",
				elementType: "geometry",
				stylers: [{ color: "#e2e8f0" }]
			},
			{
				featureType: "road",
				elementType: "geometry",
				stylers: [{ color: "#ffffff" }]
			},
			{
				featureType: "road",
				elementType: "geometry.stroke",
				stylers: [{ color: "#cbd5e1" }]
			},
			{
				featureType: "road.highway",
				elementType: "geometry",
				stylers: [{ color: "#e2e8f0" }]
			},
			{
				featureType: "water",
				elementType: "geometry",
				stylers: [{ color: "#cbd5e1" }]
			},
			{
				featureType: "water",
				elementType: "labels.text.fill",
				stylers: [{ color: "#64748b" }]
			}
		]
	});
}
