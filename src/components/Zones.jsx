import { useEffect, useState } from "react";

export default function Zones() {
  const [zones, setZones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchZones() {
      try {
        const response = await fetch("https://data.javin.io:5000/api/zones");
        if (!response.ok) {
          throw new Error(`Failed to fetch zones: ${response.status}`);
        }
        const result = await response.json();

        const formattedZones = result.data.map((zoneObj, index) => {
          const key = `${(index + 1)}`
          return zoneObj[key];
      });

        setZones(formattedZones);
      } catch (error) {
        console.error("Error fetching zones:", error);
        setError("Failed to load zones.");
      }
    }
    fetchZones();
  }, []);

  return (
    <section id="zones">
      <h2>Zones</h2>
      <div className="zones-list">
        {error ? (
          <p id="zones-error">{error}</p>
        ) : displayZones(zones)}
      </div>
    </section>
  );
}

function displayZones(zones) {
  return zones.length > 0 ? (
    <ul>
      {zones.map((zone) => (
        <li key={zone.zone_id}>
          Zone {zone.zone_id}: {zone.name}
        </li>
      ))}
    </ul>
  ) : (
    <p>Loading zones...</p>
  );
}
