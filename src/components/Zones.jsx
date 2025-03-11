import { useEffect, useState } from "react";

export default function Zones() {
  const [zones, setZones] = useState([]);
  const [error, setError] = useState(null);
  const [selectedZones, setSelectedZones] = useState([]);
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    async function fetchZones() {
      try {
        const response = await fetch("https://jump.javin.io:5000/api/zones");
        if (!response.ok) {
          throw new Error(`Failed to fetch zones: ${response.status}`);
        }
        const result = await response.json();

        const formattedZones = result.data.map((zoneObj) => {
          //const key = `${index + 1}`;
          const key = Object.keys(zoneObj)[0];
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

  const fetchAwards = async (zoneIds) => {
    setError(null);
    console.log("zoneIds", zoneIds);

    try {
      const promises = zoneIds.map((zoneId) =>
        fetch(`https://jump.javin.io:5000/api/awards?zone=${zoneId}`)
      );
      const responses = await Promise.all(promises);

      for (const response of responses) {
        if (!response.ok) {
          throw new Error(`Failed to fetch awards: ${response.status}`);
        }
      }

      const result = await Promise.all(responses.map((res) => res.json()));

      const combinedAwards = result.flatMap((data) =>
        data.data.map((awardObj) => {
          const key = Object.keys(awardObj)[0];
          return awardObj[key];
        })
      );
      console.log("combinedAwards", combinedAwards);

      setAwards(combinedAwards);
    } catch (error) {
      console.error("Error fetching awards:", error);
      setError("Failed to load awards.");
    }
  };

  useEffect(() => {
    if (selectedZones.length > 0) {
      fetchAwards(selectedZones);
    } else {
      setAwards([]); // We clear awards in case no sone is selected
    }
  }, [selectedZones]);

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
              <select id="zone-select" multiple onChange={handleZoneChange}>
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
            {awards.length > 0 && (
              <div className="awards-list">
                <h3>Awards:</h3>
                <ul>
                  {awards.map((award) => (
                    <li key={award.award_id}>
                      Award ID: {award.award_id} - Zone ID: {award.zone_id} -
                      Date: {award.entry}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
