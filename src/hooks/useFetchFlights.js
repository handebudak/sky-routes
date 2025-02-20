import { useState, useEffect } from "react";

const CITY_CODES = {
  // Europe
  'LONDON': 'LHR',
  'PARIS': 'CDG',
  'AMSTERDAM': 'AMS',
  'FRANKFURT': 'FRA',
  'MADRID': 'MAD',
  'BARCELONA': 'BCN',
  'ROME': 'FCO',
  'MILAN': 'MXP',
  'VIENNA': 'VIE',
  'ZURICH': 'ZRH',
  'BRUSSELS': 'BRU',
  'COPENHAGEN': 'CPH',
  'DUBLIN': 'DUB',
  'LISBON': 'LIS',
  'ATHENS': 'ATH',
  'BERLIN': 'BER',
  'MUNICH': 'MUC',
  'PRAGUE': 'PRG',
  'WARSAW': 'WAW',
  'BUDAPEST': 'BUD',

  // Americas
  'NEW YORK': 'JFK',
  'LOS ANGELES': 'LAX',
  'CHICAGO': 'ORD',
  'MIAMI': 'MIA',
  'SAN FRANCISCO': 'SFO',
  'BOSTON': 'BOS',
  'WASHINGTON': 'IAD',
  'SEATTLE': 'SEA',
  'LAS VEGAS': 'LAS',
  'TORONTO': 'YYZ',
  'VANCOUVER': 'YVR',
  'MONTREAL': 'YUL',

  // Asia
  'TOKYO': 'HND',
  'SINGAPORE': 'SIN',
  'HONG KONG': 'HKG',
  'SEOUL': 'ICN',
  'BANGKOK': 'BKK',
  'DUBAI': 'DXB',
  'DOHA': 'DOH',
  'BEIJING': 'PEK',
  'SHANGHAI': 'PVG',
  'TAIPEI': 'TPE',

  // Australia/Oceania
  'SYDNEY': 'SYD',
  'MELBOURNE': 'MEL',
  'BRISBANE': 'BNE',
  'AUCKLAND': 'AKL'
};

const getEntityId = (city) => {
  const entityIds = {
    // Avrupa
    'LHR': '27544008', // London
    'CDG': '27539733', // Paris
    'AMS': '27544915', // Amsterdam
    'FRA': '27545744', // Frankfurt
    'MAD': '27547498', // Madrid
    'BCN': '27548283', // Barcelona
    'FCO': '27539793', // Rome
    'MXP': '27544850', // Milan
    'VIE': '27547558', // Vienna
    'ZRH': '27547858', // Zurich
    'BRU': '27538635', // Brussels
    'CPH': '27539267', // Copenhagen
    'DUB': '27540823', // Dublin
    'LIS': '27544950', // Lisbon
    'ATH': '27538091', // Athens
    'BER': '27538787', // Berlin
    'MUC': '27545517', // Munich
    'PRG': '27546253', // Prague
    'WAW': '27546533', // Warsaw
    'BUD': '27538731', // Budapest

    // Amerika
    'JFK': '27537542', // New York
    'LAX': '27545022', // Los Angeles
    'ORD': '27546033', // Chicago
    'MIA': '27545212', // Miami
    'SFO': '27547327', // San Francisco
    'BOS': '27538638', // Boston
    'IAD': '27547597', // Washington
    'SEA': '27547098', // Seattle
    'LAS': '27544966', // Las Vegas
    'YYZ': '27547375', // Toronto
    'YVR': '27547431', // Vancouver
    'YUL': '27545461', // Montreal

    // Asya
    'HND': '27542671', // Tokyo
    'SIN': '27547029', // Singapore
    'HKG': '27542447', // Hong Kong
    'ICN': '27543039', // Seoul
    'BKK': '27538249', // Bangkok
    'DXB': '27540825', // Dubai
    'DOH': '27540728', // Doha
    'PEK': '27546276', // Beijing
    'PVG': '27546291', // Shanghai
    'TPE': '27547168', // Taipei

    // Avustralya/Okyanusya
    'SYD': '27547037', // Sydney
    'MEL': '27545227', // Melbourne
    'BNE': '27538621', // Brisbane
    'AKL': '27538075'  // Auckland
  };
  return entityIds[city] || '27544008'; // default London
};

const useFetchFlights = (from, to, date) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!from || !to || !date) return;

    const fetchFlights = async () => {
      setLoading(true);
      try {
        const fromCity = CITY_CODES[from.toUpperCase()] || from.toUpperCase();
        const toCity = CITY_CODES[to.toUpperCase()] || to.toUpperCase();

        // EntityId 
        const originEntityId = getEntityId(fromCity);
        const destinationEntityId = getEntityId(toCity);

        const response = await fetch(
          `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights?originSkyId=${fromCity}&destinationSkyId=${toCity}&originEntityId=${originEntityId}&destinationEntityId=${destinationEntityId}&date=${date}&cabinClass=economy&adults=1&sortBy=best&currency=USD&market=en-US&countryCode=US`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
              'x-rapidapi-key': '0867b319c4msh30ebcddf5a2d006p11152cjsn930e25a47c9b',
            },
          }
        );

        if (!response.ok) {
          throw new Error("API call failed");
        }

        const data = await response.json();
        
        if (data?.data?.itineraries) {
          const formattedFlights = data.data.itineraries.map(itinerary => {
            const leg = itinerary.legs[0];
            return {
              id: itinerary.id,
              price: {
                amount: itinerary.price.amount || itinerary.price.formatted.replace('$', ''),
                currency: 'USD'
              },
              duration: leg.durationInMinutes || 
                        (leg.duration ? parseInt(leg.duration) : 0),
              segments: leg.segments,
              departure: leg.departureDateTime || leg.departure,
              arrival: leg.arrivalDateTime || leg.arrival,
              carrier: {
                name: leg.carriers.marketing[0].name,
                logoUrl: leg.carriers.marketing[0].logoUrl
              },
              stops: leg.stopCount || 0,
              origin: leg.origin.name,
              destination: leg.destination.name
            };
          });
          setFlights(formattedFlights);
        } else {
          setFlights([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchFlights();
  }, [from, to, date]);

  return { flights, loading, error };
};

// Test fonksiyonu ekleyelim
const testAirport = async (cityCode) => {
  try {
    const response = await fetch(
      `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights?originSkyId=LHR&destinationSkyId=${cityCode}&originEntityId=27544008&destinationEntityId=27544008&date=2024-03-25&cabinClass=economy&adults=1&sortBy=best&currency=USD&market=en-US&countryCode=US`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
          'x-rapidapi-key': '0867b319c4msh30ebcddf5a2d006p11152cjsn930e25a47c9b',
        },
      }
    );
    const data = await response.json();
    if (data?.data?.itineraries) {
      console.log(`✅ ${cityCode} works`);
      return true;
    } else {
      console.log(`❌ ${cityCode} doesn't work`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${cityCode} error:`, error);
    return false;
  }
};

// Tüm şehirleri test et
const testAllAirports = async () => {
  const workingAirports = [];
  for (const city of CITY_SUGGESTIONS) {
    const works = await testAirport(city.code);
    if (works) {
      workingAirports.push(city);
    }
    // API limit aşımını önlemek için bekle
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('Working airports:', workingAirports);
};

// Test başlat
// testAllAirports();

export default useFetchFlights;
