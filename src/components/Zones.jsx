import { useEffect, useState } from "react";

export default function Zones() {
  const [zones, setZones] = useState([]);
  const [error, setError] = useState(null);
  const [selectedZones, setSelectedZones] = useState([]);
  const [awards, setAwards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

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

  async function fetchAwards(zoneIds, page) {
    console.log("page", page)
    setError(null);
    console.log("zoneIds", zoneIds);

    try {
      const promises = zoneIds.map((zoneId) => {
        if (page) {
          return fetch(
            `https://jump.javin.io:5000/api/awards?zone=${zoneId}&page=${page}&limit=10`
          );
        }

        return fetch(
          `https://jump.javin.io:5000/api/awards?zone=${zoneId}&limit=10`
        );
      });

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

      const pagination = result[0]?.pagination;
      console.log("pagination", pagination);
      setTotalPages(pagination?.total_pages || 1);
      setHasNextPage(pagination?.has_next || false);
      setHasPreviousPage(pagination?.has_previous || false);

      setAwards(combinedAwards);
    } catch (error) {
      console.error("Error fetching awards:", error);
      setError("Failed to load awards.");
    }
  }

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (selectedZones.length > 0) {
      fetchAwards(selectedZones, currentPage);
    } else {
      setAwards([]); // We clear awards in case no sone is selected
    }
  }, [selectedZones]);

  function handleZoneChange(event) {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedZoneIds = selectedOptions.map((option) => option.value);
    setSelectedZones(selectedZoneIds);
  }

  function handleNextPage() {
    setCurrentPage((prevPage) => prevPage + 1);
    console.log()
  }

  function handlePreviousPage() {
    setCurrentPage((prevPage) => prevPage - 1);
  }

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
                <div className="pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={!hasPreviousPage}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button onClick={handleNextPage} disabled={!hasNextPage}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
