import React from "react";
import { Link } from "react-router-dom";

function Hotels({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendation</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {trip?.tripData?.hotels?.map((hotel, index) => (
          <Link
            to={
              "https://www.google.com/maps/search/?api=1&query=centurylink+field" +
              hotel?.hotelName +
              hotel?.hotelAddress
            }
            target="_blank"
          >
            <div
              key={hotel.id || index}
              className="hover:scale-105 transition-all"
            >
              <img src="/placeholder.jpg" className="rounded-xl" />
              <div className="my-2 flex flex-col gap-2">
                <h2 className="font-medium">
                  {hotel?.hotelName || "Unknown Hotel"}
                </h2>
                <h2 className="text-xs text-gray-500">
                  📍{hotel?.hotelAddress || "Address not available"}
                </h2>
                <h2 className="text-sm">
                  💰{hotel?.pricePerNight?.currency || "N/A"}{" "}
                  {hotel?.pricePerNight?.estimate || ""}
                </h2>
                <h2 className="text-sm">⭐{hotel?.rating || "Not rated"}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
