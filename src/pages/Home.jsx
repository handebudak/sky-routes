import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CITY_SUGGESTIONS = [
  { code: 'LHR', name: 'London' },
  { code: 'CDG', name: 'Paris' },
  { code: 'JFK', name: 'New York' },
  { code: 'LAX', name: 'Los Angeles' },
  { code: 'BCN', name: 'Barcelona' },
  { code: 'AMS', name: 'Amsterdam' },
  { code: 'FRA', name: 'Frankfurt' },
  { code: 'MAD', name: 'Madrid' },
  { code: 'FCO', name: 'Rome' },
  { code: 'MXP', name: 'Milan' },
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
  { code: 'ORD', name: 'Chicago, USA' },
  { code: 'MIA', name: 'Miami, USA' },
  { code: 'SFO', name: 'San Francisco, USA' },
  { code: 'BOS', name: 'Boston, USA' },
  { code: 'IAD', name: 'Washington, USA' },
  { code: 'SEA', name: 'Seattle, USA' },
  { code: 'LAS', name: 'Las Vegas, USA' },
  { code: 'YYZ', name: 'Toronto, Canada' },
  { code: 'YVR', name: 'Vancouver, Canada' },
  { code: 'YUL', name: 'Montreal, Canada' },
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
  { code: 'SYD', name: 'Sydney, Australia' },
  { code: 'MEL', name: 'Melbourne, Australia' },
  { code: 'BNE', name: 'Brisbane, Australia' },
  { code: 'AKL', name: 'Auckland, New Zealand' }
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
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6
        bg-gradient-to-b from-sky-950 via-sky-950 to-sky-700 text-transparent bg-clip-text drop-shadow-lg tracking-widest uppercase">
        SKY ROUTES ✈️
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg flex flex-col gap-4 w-full max-w-md mx-3"
      >
        <div className="relative" ref={fromDropdownRef}>
          <input
            type="text"
            placeholder="From (e.g. LHR)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onFocus={() => setFromFocus(true)}
            className="border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          />
          {fromFocus && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {CITY_SUGGESTIONS.map(city => (
                <div
                  key={city.code}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCitySelect(city, 'from')}
                >
                  {city.name} ({city.code})
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={toDropdownRef}>
          <input
            type="text"
            placeholder="To (e.g. JFK)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onFocus={() => setToFocus(true)}
            className="border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          />
          {toFocus && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {CITY_SUGGESTIONS.map(city => (
                <div
                  key={city.code}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCitySelect(city, 'to')}
                >
                  {city.name} ({city.code})
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-sky-800 text-white p-3 rounded-md font-semibold hover:bg-sky-950 transition"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
};

export default Home;
