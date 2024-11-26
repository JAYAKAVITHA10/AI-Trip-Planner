import React from "react";
import { useParams } from "react-router-dom";

function Viewtrip() {
  const { tripId } = useParams();
  return <div>Viewtrip: {tripId}</div>;
}

export default Viewtrip;
