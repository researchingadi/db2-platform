"use client";

import { useEffect, useRef } from "react";

const ZOOM_THRESHOLD = 10;

function makeObsPopupHtml(obs: any): string {
  const name = obs.taxon?.preferred_common_name
    ? obs.taxon.preferred_common_name
    : `<em>${obs.taxon?.name ?? "Unknown"}</em>`;
  const photo = obs.photos?.[0]?.url?.replace("square", "small");
  const date = obs.observed_on
    ? new Date(obs.observed_on + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";
  const badge =
    obs.quality_grade === "research"
      ? `<span style="background:var(--db-green);color:var(--db-black);padding:2px 7px;font-size:10px;font-weight:600;margin-right:4px">Research Grade</span>`
      : obs.quality_grade === "needs_id"
      ? `<span style="background:var(--db-cream);color:var(--db-black);padding:2px 7px;font-size:10px;font-weight:600;margin-right:4px">Needs ID</span>`
      : "";
  const photoHtml = photo
    ? `<img src="${photo}" style="width:80px;height:80px;object-fit:cover;flex-shrink:0"/>`
    : "";

  return `
    <div style="font-family:sans-serif;font-size:13px;min-width:220px;max-width:280px;padding:4px">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px;color:var(--db-black);margin-bottom:3px">🪲 ${name}</div>
          <div style="color:var(--db-charcoal);margin-bottom:3px;font-size:12px">
            Observer: <a href="https://www.inaturalist.org/people/${obs.user?.login}" target="_blank" style="color:var(--db-black);text-decoration:underline">${obs.user?.login}</a>
          </div>
          <div style="color:var(--db-charcoal);font-size:12px;margin-bottom:6px">Date: ${date}</div>
          <div style="display:flex;align-items:center;gap:4px;margin-bottom:8px">
            ${badge}
            <span style="color:var(--db-charcoal);font-size:10px">${obs.num_identification_agreements} IDs</span>
          </div>
        </div>
        ${photoHtml}
      </div>
      <div style="border-top:1px solid var(--db-black);padding-top:8px">
        <a href="${obs.uri}" target="_blank" style="color:var(--db-black);text-decoration:underline;font-size:12px">View observation →</a>
      </div>
    </div>
  `;
}

export default function DistributionMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      if (!containerRef.current || (containerRef.current as any)._leaflet_id) return;

      const map = L.map(containerRef.current!, {
        center: [20, 10],
        zoom: 2,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      // Base map
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      // Tile overlays
      const gridLayer = L.tileLayer(
        "https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?taxon_id=125819&color=%236366f1",
        { opacity: 0.7, attribution: "Observations © iNaturalist" }
      );
      const pointsLayer = L.tileLayer(
        "https://api.inaturalist.org/v1/points/{z}/{x}/{y}.png?taxon_id=125819",
        { opacity: 0.9, attribution: "Observations © iNaturalist" }
      );

      gridLayer.addTo(map);

      // Circle marker layer group
      const markerGroup = L.layerGroup().addTo(map);

      // Loading indicator
      const loadingEl = loadingRef.current;
      const showLoading = () => { if (loadingEl) loadingEl.style.display = "block"; };
      const hideLoading = () => { if (loadingEl) loadingEl.style.display = "none"; };

      // Fetch and place markers for current bounds
      let fetchController: AbortController | null = null;

      async function loadMarkers() {
        if (fetchController) fetchController.abort();
        fetchController = new AbortController();

        showLoading();
        markerGroup.clearLayers();

        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const url =
          `https://api.inaturalist.org/v1/observations?taxon_id=125819` +
          `&nelat=${ne.lat}&nelng=${ne.lng}&swlat=${sw.lat}&swlng=${sw.lng}` +
          `&per_page=200&order_by=observed_on`;

        try {
          const res = await fetch(url, { signal: fetchController.signal });
          const data = await res.json();
          hideLoading();

          if (!data.results) return;

          for (const obs of data.results) {
            if (!obs.location) continue;
            const [olat, olng] = obs.location.split(",").map(Number);
            if (isNaN(olat) || isNaN(olng)) continue;

            L.circleMarker([olat, olng], {
              radius: 7,
              fillColor: "#FF5733",
              color: "#fff",
              weight: 1.5,
              fillOpacity: 0.85,
            })
              .bindPopup(makeObsPopupHtml(obs), { maxWidth: 300 })
              .addTo(markerGroup);
          }
        } catch (err: any) {
          if (err.name !== "AbortError") hideLoading();
        }
      }

      // Debounce helper
      let debounceTimer: ReturnType<typeof setTimeout> | null = null;
      function debouncedLoad() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(loadMarkers, 300);
      }

      // Switch layers and behaviour based on zoom
      function applyZoom() {
        const z = map.getZoom();
        if (z >= ZOOM_THRESHOLD) {
          if (map.hasLayer(gridLayer)) map.removeLayer(gridLayer);
          if (!map.hasLayer(pointsLayer)) pointsLayer.addTo(map);
          debouncedLoad();
        } else {
          if (map.hasLayer(pointsLayer)) map.removeLayer(pointsLayer);
          if (!map.hasLayer(gridLayer)) gridLayer.addTo(map);
          markerGroup.clearLayers();
          hideLoading();
          if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
          if (fetchController) { fetchController.abort(); fetchController = null; }
        }
      }

      map.on("zoomend", applyZoom);
      map.on("moveend", () => {
        if (map.getZoom() >= ZOOM_THRESHOLD) debouncedLoad();
      });

      // Low-zoom click handler (radius-based popup list)
      map.on("click", async (e: any) => {
        if (map.getZoom() >= ZOOM_THRESHOLD) return;

        const { lat, lng } = e.latlng;
        const zoom = map.getZoom();
        const radius = Math.max(1, Math.round(500 / Math.pow(2, zoom - 2)));

        const loadingPopup = L.popup()
          .setLatLng([lat, lng])
          .setContent(
            `<div style="font-family:sans-serif;font-size:13px;padding:8px;color:var(--db-charcoal)">Finding nearby observations...</div>`
          )
          .openOn(map);

        try {
          const res = await fetch(
            `https://api.inaturalist.org/v1/observations?taxon_id=125819&lat=${lat}&lng=${lng}&radius=${radius}&per_page=10&order_by=observed_on&order=desc`
          );
          const data = await res.json();

          if (!data.results || data.results.length === 0) {
            loadingPopup.setContent(
              `<div style="font-family:sans-serif;font-size:13px;padding:8px;color:var(--db-charcoal)">No observations recorded in this area</div>`
            );
            return;
          }

          const total = data.results.length;
          const obsCards = data.results.slice(0, 5).map((obs: any) => {
            const name = obs.taxon?.preferred_common_name || `<em>${obs.taxon?.name ?? "Unknown"}</em>`;
            const photo = obs.photos?.[0]?.url?.replace("square", "small");
            const date = obs.observed_on
              ? new Date(obs.observed_on + "T00:00:00").toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric",
                })
              : "Unknown date";
            const badge =
              obs.quality_grade === "research"
                ? `<span style="background:var(--db-green);color:var(--db-black);padding:1px 6px;font-size:10px;font-weight:600;margin-right:4px">Research Grade</span>`
                : obs.quality_grade === "needs_id"
                ? `<span style="background:var(--db-cream);color:var(--db-black);padding:1px 6px;font-size:10px;font-weight:600;margin-right:4px">Needs ID</span>`
                : "";
            const photoHtml = photo
              ? `<img src="${photo}" style="width:60px;height:60px;object-fit:cover;flex-shrink:0"/>`
              : "";
            return `
              <div style="display:flex;gap:8px;align-items:flex-start;padding:8px 0;border-bottom:1px dashed var(--db-charcoal)">
                <div style="flex:1">
                  <div style="font-weight:700;font-size:13px;color:var(--db-black);margin-bottom:2px">🪲 ${name}</div>
                  <div style="color:var(--db-charcoal);font-size:11px;margin-bottom:2px">Observer: <a href="https://www.inaturalist.org/people/${obs.user?.login}" target="_blank" style="color:var(--db-black);text-decoration:underline">${obs.user?.login}</a></div>
                  <div style="color:var(--db-charcoal);font-size:11px;margin-bottom:4px">Date: ${date}</div>
                  <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">${badge}<span style="color:var(--db-charcoal);font-size:10px">${obs.num_identification_agreements} IDs</span></div>
                  <a href="${obs.uri}" target="_blank" style="color:var(--db-black);font-size:11px;text-decoration:underline">View observation →</a>
                </div>
                ${photoHtml}
              </div>`;
          }).join("");

          const areaUrl = `https://www.inaturalist.org/observations?taxon_id=125819&lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}&radius=${radius}`;
          loadingPopup.setContent(`
            <div style="font-family:sans-serif;min-width:240px;max-width:300px;max-height:400px;overflow-y:auto;padding:4px">
              <div style="font-weight:700;font-size:12px;color:var(--db-charcoal);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">${total} observation${total > 1 ? "s" : ""} in this area</div>
              ${obsCards}
              <div style="padding-top:8px"><a href="${areaUrl}" target="_blank" style="color:var(--db-black);font-size:11px;text-decoration:underline">View all ${total} on iNaturalist →</a></div>
            </div>
          `);
        } catch {
          loadingPopup.setContent(
            `<div style="font-family:sans-serif;font-size:13px;padding:8px;color:var(--db-charcoal)">Error loading observations. Try again.</div>`
          );
        }
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (containerRef.current) {
        delete (containerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  return (
    <div className="distribution-map-frame" style={{ position: "relative", width: "100%" }}>
      <div
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
      />
      <div
        ref={loadingRef}
        style={{
          display: "none",
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          background: "var(--db-black)",
          color: "var(--db-cyan)",
          fontSize: "14px",
          fontFamily: "var(--font-mono)",
          padding: "6px 12px",
          border: "2px solid var(--db-cream)",
          boxShadow: "4px 4px 0 var(--db-black)",
          pointerEvents: "none",
        }}
      >
        Loading observations…
      </div>
    </div>
  );
}
