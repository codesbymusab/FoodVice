import { createContext, useContext, useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface LocationContextType {
  location: [number, number] | null;
  loading: boolean;
  error: string | null;
  setLocation: Dispatch<SetStateAction<[number, number] | null>>;
  fetchLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocation(null);
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
          resolve();
        },
        (fetchError) => {
          console.error("Unable to determine current location:", fetchError);
          setLocation(null);
          setError("Unable to determine your current location.");
          setLoading(false);
          resolve();
        },
        { enableHighAccuracy: true, timeout: 15000 },
      );
    });
  };

  useEffect(() => {
    void fetchLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error, setLocation, fetchLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useAppLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useAppLocation must be used within a LocationProvider");
  }
  return context;
};
