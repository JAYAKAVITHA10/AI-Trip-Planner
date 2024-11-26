import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions } from "@/constants/options";
import { SelectTravelesList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { useGoogleLogin } from "@react-oauth/google";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestions = async (value) => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&apiKey=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features) {
        setSuggestions(data.features);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = (formattedAddress) => {
    setQuery(formattedAddress);
    setSuggestions([]);
    handleInputChanges("location", {
      label: formattedAddress,
      value: formattedAddress,
    });
  };

  const handleInputChanges = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      (formData?.noOfDays > 5 && formData?.location) ||
      !formData?.budget ||
      !formData?.travelers
    ) {
      toast("Please fill all details");

      return;
    }
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.travelers)
      .replace("{budget}", formData?.budget);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("--", result?.response?.text());
    SaveAiTrip(result?.response?.text());
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        OnGenerateTrip();
      });
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docID = Date.now().toString();
    await setDoc(doc(db, "AITrips", docID), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docID,
    });
    setLoading(false);
    navigate("/view-trip/" + docID);
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us Your Travel Preferences🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary for you.
      </p>
      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice?
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Type a destination..."
              value={query}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            />

            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 w-full overflow-y-auto">
                {suggestions.map((place, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleSelectSuggestion(place.properties.formatted)
                    }
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {place.properties.formatted}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning for trip?
          </h2>
          <Input
            placeholder={"Ex.3"}
            type="number"
            onChange={(e) => handleInputChanges("noOfdays", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChanges("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData.budget === item.title &&
                "shadow-lg bg-green-100 border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="text-lg font-bold">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on travelling with on your next adventure?
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChanges("travelers", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData.travelers === item.people &&
                "shadow-lg bg-green-100 border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="text-lg font-bold">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>

        <div className="mb-10 justify-end flex">
          <Button disabled={loading} onClick={OnGenerateTrip}>
            {loading ? (
              <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
            ) : (
              " Generate Trip"
            )}
          </Button>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <img src="/logo.svg" />
          <DialogHeader>
            <DialogTitle className="font-bold text-lg mt-7">
              Sign In with Google
            </DialogTitle>
            <DialogDescription>
              Sign in to the App with Google Authentication
            </DialogDescription>
          </DialogHeader>

          <Button
            onClick={login}
            className="w-full mt-5 flex gap-4 items-center"
          >
            <FcGoogle style={{ height: "30px", width: "30px" }} />
            Sign In with Google
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
