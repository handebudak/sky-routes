import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CITY_SUGGESTIONS = [
  // Europe
  { code: 'LHR', name: 'London, UK' },
  { code: 'CDG', name: 'Paris, France' },
  { code: 'AMS', name: 'Amsterdam, Netherlands' },
  { code: 'FRA', name: 'Frankfurt, Germany' },
  { code: 'MAD', name: 'Madrid, Spain' },
  { code: 'BCN', name: 'Barcelona, Spain' },
  { code: 'FCO', name: 'Rome, Italy' },
  { code: 'MXP', name: 'Milan, Italy' },
  { code: 'VIE', name: 'Vienna, Austria' },
  { code: 'ZRH', name: 'Zurich, Switzerland' },
  { code: 'BRU', name: 'Brussels, Belgium' },
  { code: 'CPH', name: 'Copenhagen, Denmark' },
  { code: 'DUB', name: 'Dublin, Ireland' },
  { code: 'LIS', name: 'Lisbon, Portugal' },
  { code: 'ATH', name: 'Athens, Greece' },
  { code: 'BER', name: 'Berlin, Germany' },
  { code: 'MUC', name: 'Munich, Germany' },
  { code: 'PRG', name: 'Prague, Czech Republic' },
  { code: 'WAW', name: 'Warsaw, Poland' },
  { code: 'BUD', name: 'Budapest, Hungary' },
  { code: 'IST', name: 'Istanbul, Turkey' },
  { code: 'ESB', name: 'Ankara, Turkey' },
  { code: 'ADB', name: 'Izmir, Turkey' },
  { code: 'ARN', name: 'Stockholm, Sweden' },
  { code: 'OSL', name: 'Oslo, Norway' },
  { code: 'HEL', name: 'Helsinki, Finland' },
  { code: 'SVO', name: 'Moscow, Russia' },
  
  // Americas
  { code: 'JFK', name: 'New York, USA' },
  { code: 'LAX', name: 'Los Angeles, USA' },
  { code: 'CHI', name: 'Chicago, USA' },
  { code: 'MIA', name: 'Miami, USA' },
  { code: 'SFO', name: 'San Francisco, USA' },
  { code: 'BOS', name: 'Boston, USA' },
  { code: 'IAD', name: 'Washington, USA' },
  { code: 'SEA', name: 'Seattle, USA' },
  { code: 'LAS', name: 'Las Vegas, USA' },
  { code: 'YYZ', name: 'Toronto, Canada' },
  { code: 'YVR', name: 'Vancouver, Canada' },
  { code: 'YUL', name: 'Montreal, Canada' },
  { code: 'MEX', name: 'Mexico City, Mexico' },
  { code: 'CUN', name: 'Cancun, Mexico' },
  { code: 'GRU', name: 'Sao Paulo, Brazil' },
  { code: 'GIG', name: 'Rio de Janeiro, Brazil' },
  { code: 'EZE', name: 'Buenos Aires, Argentina' },
  { code: 'SCL', name: 'Santiago, Chile' },
  { code: 'LIM', name: 'Lima, Peru' },
  { code: 'BOG', name: 'Bogota, Colombia' },
  
  // Asia
  { code: 'HND', name: 'Tokyo, Japan' },
  { code: 'SIN', name: 'Singapore' },
  { code: 'HKG', name: 'Hong Kong' },
  { code: 'ICN', name: 'Seoul, South Korea' },
  { code: 'BKK', name: 'Bangkok, Thailand' },
  { code: 'DXB', name: 'Dubai, UAE' },
  { code: 'DOH', name: 'Doha, Qatar' },
  { code: 'PEK', name: 'Beijing, China' },
  { code: 'PVG', name: 'Shanghai, China' },
  { code: 'TPE', name: 'Taipei, Taiwan' },
  { code: 'MNL', name: 'Manila, Philippines' },
  { code: 'CGK', name: 'Jakarta, Indonesia' },
  { code: 'KUL', name: 'Kuala Lumpur, Malaysia' },
  { code: 'SGN', name: 'Ho Chi Minh City, Vietnam' },
  { code: 'HAN', name: 'Hanoi, Vietnam' },
  { code: 'BOM', name: 'Mumbai, India' },
  { code: 'DEL', name: 'Delhi, India' },
  { code: 'BLR', name: 'Bangalore, India' },
  { code: 'MAA', name: 'Chennai, India' },
  { code: 'KHI', name: 'Karachi, Pakistan' },
  { code: 'LHE', name: 'Lahore, Pakistan' },
  { code: 'IKA', name: 'Tehran, Iran' },
  { code: 'CAI', name: 'Cairo, Egypt' },
  { code: 'CMN', name: 'Casablanca, Morocco' },
  
  // Australia/Oceania
  { code: 'SYD', name: 'Sydney, Australia' },
  { code: 'MEL', name: 'Melbourne, Australia' },
  { code: 'BNE', name: 'Brisbane, Australia' },
  { code: 'AKL', name: 'Auckland, New Zealand' },
  { code: 'PER', name: 'Perth, Australia' },
  { code: 'HNL', name: 'Honolulu, USA' }
];

const Home = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  // Dropdown referansları
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

  // Sayfa yüklendiğinde click listener ekle
  useEffect(() => {
    const handleClickOutside = (event) => {
      // From dropdown için kontrol
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setFromFocus(false);
      }
      // To dropdown için kontrol
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setToFocus(false);
      }
    };

    // Click listener'ı ekle
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) return;
    navigate(`/flights?from=${from}&to=${to}&date=${date}`);
  };

  // Filtreleme fonksiyonu - hem şehir adında hem de kodda arama yapar
  const filterCities = (searchTerm, cityList) => {
    if (!searchTerm) return cityList;
    
    const term = searchTerm.toLowerCase();
    return cityList.filter(city => 
      city.name.toLowerCase().includes(term) || 
      city.code.toLowerCase().includes(term)
    );
  };

  const handleCitySelect = (city, type) => {
    if (type === 'from') {
      setFrom(city.code);
      setFromFocus(false);
    } else {
      setTo(city.code);
      setToFocus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-sky-700 relative overflow-hidden">
              {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
              <span className="text-3xl">✈️</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-sky-100 to-white text-transparent bg-clip-text drop-shadow-lg">
              SKY ROUTES
            </h1>
          </div>
          <p className="text-sky-100 text-lg md:text-xl font-medium max-w-md mx-auto">
            Discover the world with smart flight search
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-6 w-full max-w-lg mx-3 border border-white/20"
        >
        <div className="relative" ref={fromDropdownRef}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Departure City
            </span>
          </label>
          <input
            type="text"
            placeholder="Search city or airport code..."
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onFocus={() => setFromFocus(true)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
          />
          {fromFocus && (
            <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-md border-2 border-sky-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
              {filterCities(from, CITY_SUGGESTIONS).map(city => (
                <div
                  key={city.code}
                  className="p-4 hover:bg-sky-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                  onClick={() => handleCitySelect(city, 'from')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.code}</div>
                    </div>
                    <div className="text-sky-600 font-bold">{city.code}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={toDropdownRef}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Destination City
            </span>
          </label>
          <input
            type="text"
            placeholder="Search city or airport code..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onFocus={() => setToFocus(true)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
          />
          {toFocus && (
            <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-md border-2 border-sky-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
              {filterCities(to, CITY_SUGGESTIONS).map(city => (
                <div
                  key={city.code}
                  className="p-4 hover:bg-sky-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                  onClick={() => handleCitySelect(city, 'to')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.code}</div>
                    </div>
                    <div className="text-sky-600 font-bold">{city.code}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Travel Date
            </span>
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        <button
          type="submit"
          disabled={!from || !to || !date}
          className="w-full bg-gradient-to-r from-sky-600 to-sky-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:from-sky-700 hover:to-sky-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Flights
          </span>
        </button>
      </form>
      
      {/* Quick Tips */}
      <div className="mt-8 text-center">
        <p className="text-sky-100 text-sm opacity-80">
          💡 Try popular routes like London → New York or Paris → Amsterdam
        </p>
      </div>
    </div>
  </div>
  );
};

export default Home;
