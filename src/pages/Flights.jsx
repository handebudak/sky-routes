import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFetchFlights from "../hooks/useFetchFlights";

const Flights = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [sortType, setSortType] = useState("price-asc"); 
  const [sortedFlights, setSortedFlights] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  useEffect(() => {
    const fromCity = params.get("from");
    const toCity = params.get("to");
    const travelDate = params.get("date");

    if (fromCity) setFrom(fromCity);
    if (toCity) setTo(toCity);
    if (travelDate) setDate(travelDate);
  }, [params]);

  const { flights, loading, error } = useFetchFlights(from, to, date);

  // price and time
  useEffect(() => {
    if (flights) {
      const sorted = [...flights].sort((a, b) => {
        // price
        const priceA = typeof a.price.amount === 'string' ? 
          parseFloat(a.price.amount.replace(/[^0-9.]/g, '')) : 
          parseFloat(a.price.amount);
        
        const priceB = typeof b.price.amount === 'string' ? 
          parseFloat(b.price.amount.replace(/[^0-9.]/g, '')) : 
          parseFloat(b.price.amount);

        // time
        const timeA = new Date(a.departure).getTime();
        const timeB = new Date(b.departure).getTime();

        switch(sortType) {
          case "price-asc":
            return priceA - priceB; 
          case "price-desc":
            return priceB - priceA; 
          case "time-asc":
            return timeA - timeB; 
          case "time-desc":
            return timeB - timeA; 
          default:
            return 0;
        }
      });

      setSortedFlights(sorted);
    }
  }, [flights, sortType]);

  const formatDuration = (minutes) => {
    if (minutes > 1000) return "Duration not available";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return "Time not available";
      
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return "Time not available";
    }
  };

  const formatDate = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return "Date not available";

      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Date not available";
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    if (price.formatted) return price.formatted;
    if (price.amount) return `$${price.amount}`;
    return "Price not available";
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-sky-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6
          bg-gradient-to-b from-white via-white to-sky-200 
          text-transparent bg-clip-text drop-shadow-lg tracking-wider">
          Flight Results ✈️
        </h1>

        {/* Filtreleme ve Sıralama */}
        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-2 sm:gap-0">
            <h2 className="text-sm font-medium text-gray-500">Sort by</h2>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="w-full sm:w-auto text-sm py-1 pl-2 pr-8 rounded-md border-0 
                bg-gray-50 text-gray-600 font-medium 
                focus:ring-1 focus:ring-sky-500 
                cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="time-asc">Time: Earliest to Latest</option>
              <option value="time-desc">Time: Latest to Earliest</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-center text-white">Loading flights...</p>}
        {error && <p className="text-center text-red-300">{error}</p>}

        <div className="grid grid-cols-1 gap-3">
          {Array.isArray(sortedFlights) && sortedFlights.length > 0 ? (
            sortedFlights.map((flight, index) => (
              <div key={index} className="bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src={flight.carrier?.logoUrl} 
                      alt={flight.carrier?.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-base font-semibold text-blue-600">
                      {flight.carrier?.name}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-green-600 w-full sm:w-auto text-left sm:text-right">
                    {formatPrice(flight.price)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <div className="w-full sm:w-auto">
                      <p className="text-xs text-gray-500">Departure</p>
                      <p className="font-semibold text-sm">
                        {formatDateTime(flight.departure)}
                      </p>
                      <p className="text-xs">{flight.origin}</p>
                    </div>
                    <div className="text-center w-full sm:w-auto">
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-xs font-medium">
                        {formatDuration(flight.duration)}
                      </p>
                      <div className="w-20 h-px bg-gray-300 my-1.5 mx-auto"></div>
                      <p className="text-xs text-gray-500">
                        {flight.stops} {flight.stops === 1 ? 'stop' : 'stops'}
                      </p>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                      <p className="text-xs text-gray-500">Arrival</p>
                      <p className="font-semibold text-sm">
                        {formatDateTime(flight.arrival)}
                      </p>
                      <p className="text-xs">{flight.destination}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-white">No flights found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flights;
