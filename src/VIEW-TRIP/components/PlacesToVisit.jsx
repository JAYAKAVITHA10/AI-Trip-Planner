import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-lg">Places To Visit</h2>
      <div>
        {trip.tripData?.itinerary &&
          Object.entries(trip.tripData.itinerary)
            .sort(([dayA], [dayB]) => {
              const numA = parseInt(dayA.replace("day", ""), 10);
              const numB = parseInt(dayB.replace("day", ""), 10);
              return numA - numB;
            })
            .map(([day, places], dayIndex) => (
              <div key={dayIndex} className="mb-6">
                <h2 className="font-medium text-lg capitalize mb-3">{day}</h2>
                <ul>
                  {places.map((place, placeIndex) => (
                    <li key={placeIndex} className="mb-4">
                      <div className="my-3">
                        {/* <h3 className="font-medium text-lg">{place.placeName}</h3>
                      <p className="text-sm text-gray-600">
                        {place.placeDetails}
                      </p> */}

                        <PlaceCardItem place={place} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
