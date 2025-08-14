import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetchFlights from "../hooks/useFetchFlights";

const Flights = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [sortType, setSortType] = useState("price-asc"); 
  const [sortedFlights, setSortedFlights] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-700 to-sky-800">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-xl border-b border-sky-200/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-bold">Home</span>
              </button>
              <div className="hidden sm:block h-10 w-px bg-sky-300/50"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-sky-800 via-sky-700 to-sky-600 text-transparent bg-clip-text">
                  ✈️ Flight Results
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-semibold text-sky-700">{from}</span>
                  <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-sm font-semibold text-sky-700">{to}</span>
                  <span className="text-sky-500">•</span>
                  <span className="text-sm text-sky-600 font-medium">{date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sky-600">
              <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="text-sm font-bold hidden sm:block">Sky Routes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6">
        <div className="max-w-3xl mx-auto">

        {/* Filtreleme ve Sıralama */}
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-700">Sort Results</h2>
            </div>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="px-4 py-3 text-base border-2 border-sky-200 rounded-xl bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-500 cursor-pointer hover:border-sky-300 transition-all duration-200 font-semibold"
            >
              <option value="price-asc">💰 Price: Low to High</option>
              <option value="price-desc">💰 Price: High to Low</option>
              <option value="time-asc">🕐 Time: Earliest to Latest</option>
              <option value="time-desc">🕐 Time: Latest to Earliest</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
              <span className="text-lg font-semibold text-gray-700">Searching for flights...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-3 bg-red-50 border-2 border-red-200 px-6 py-4 rounded-2xl">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-semibold text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {Array.isArray(sortedFlights) && sortedFlights.length > 0 ? (
            sortedFlights.map((flight, index) => (
              <div key={index} className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-sky-200/50">
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
    </div>
  );
};

export default Flights;
