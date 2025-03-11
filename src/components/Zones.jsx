import { useEffect, useState } from "react";

export default function Zones() {
  const [zones, setZones] = useState([]);
  const [error, setError] = useState(null);
  const [selectedZones, setSelectedZones] = useState([]);

  useEffect(() => {
    async function fetchZones() {
      try {
        const response = await fetch("https://jump.javin.io:5000/api/zones");
        if (!response.ok) {
          throw new Error(`Failed to fetch zones: ${response.status}`);
        }
        const result = await response.json();

        const formattedZones = result.data.map((zoneObj, index) => {
          const key = `${index + 1}`;
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

  const handleZoneChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedZoneIds = selectedOptions.map((option) => option.value);
    setSelectedZones(selectedZoneIds);
  };

  return (
    <section id="zones">
      <h2>Zones</h2>
      <div className="zones-list">
        {error ? (
          <p id="zones-error">{error}</p>
        ) : (
          <>
            <form>
              <label htmlFor="zone-select">Select Zone(s):</label>
              <select
                id="zone-select"
                multiple
                onChange={handleZoneChange}
              >
                {zones.map((zone) => (
                  <option key={zone.zone_id} value={zone.zone_id}>
                    {zone.name} (ID: {zone.zone_id})
                  </option>
                ))}
              </select>
            </form>
            {selectedZones.length > 0 && (
              <div>
                <h3>Selected Zones:</h3>
                <ul>
                  {selectedZones.map((zoneId) => {
                    const zone = zones.find(
                      (thisZone) => thisZone.zone_id === parseInt(zoneId)
                    );
                    return (
                      <li key={zoneId}>
                        {zone.name} (ID: {zone.zone_id})
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
