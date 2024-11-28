import { Button } from "@/components/ui/button";
import React from "react";
import { FaMapLocation } from "react-icons/fa6";

function PlaceCardItem({ place }) {
  return (
    <div className="border round-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all">
      <img src="/placeholder.jpg" className="w-[130px] h-[130px] rounded-xl" />
      <div>
        <h2 className="font-bold text-lg">{place.placeName}</h2>
        <p className="text-sm text-gray-400">{place.placeDetails}</p>
        <h2 className="mt-2">🕙{place.travelTime}</h2>
        {/* <Button >
          <FaMapLocation />
        </Button> */}
      </div>
    </div>
  );
}

export default PlaceCardItem;
