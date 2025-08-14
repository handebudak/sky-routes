import { useState, useEffect } from "react";

const CITY_CODES = {
  // Europe
  'LONDON': 'LHR', 'PARIS': 'CDG', 'AMSTERDAM': 'AMS', 'FRANKFURT': 'FRA',
  'MADRID': 'MAD', 'BARCELONA': 'BCN', 'ROME': 'FCO', 'MILAN': 'MXP',
  'VIENNA': 'VIE', 'ZURICH': 'ZRH', 'BRUSSELS': 'BRU', 'COPENHAGEN': 'CPH',
  'DUBLIN': 'DUB', 'LISBON': 'LIS', 'ATHENS': 'ATH', 'BERLIN': 'BER',
  'MUNICH': 'MUC', 'PRAGUE': 'PRG', 'WARSAW': 'WAW', 'BUDAPEST': 'BUD',
  'STOCKHOLM': 'ARN', 'OSLO': 'OSL', 'HELSINKI': 'HEL', 'COPENHAGEN': 'CPH',
  'MOSCOW': 'SVO', 'ISTANBUL': 'IST', 'ANKARA': 'ESB', 'IZMIR': 'ADB',
  'BUCHAREST': 'OTP', 'SOFIA': 'SOF', 'BELGRADE': 'BEG', 'ZAGREB': 'ZAG',
  'LJUBLJANA': 'LJU', 'BRATISLAVA': 'BTS', 'VILNIUS': 'VNO', 'RIGA': 'RIX',
  'TALLINN': 'TLL', 'REYKJAVIK': 'KEF', 'LUXEMBOURG': 'LUX', 'GENEVA': 'GVA',

  // Americas
  'NEW YORK': 'JFK', 'LOS ANGELES': 'LAX', 'CHICAGO': 'ORD', 'MIAMI': 'MIA',
  'SAN FRANCISCO': 'SFO', 'BOSTON': 'BOS', 'WASHINGTON': 'IAD', 'SEATTLE': 'SEA',
  'LAS VEGAS': 'LAS', 'TORONTO': 'YYZ', 'VANCOUVER': 'YVR', 'MONTREAL': 'YUL',
  'ATLANTA': 'ATL', 'DALLAS': 'DFW', 'DENVER': 'DEN', 'PHOENIX': 'PHX',
  'HOUSTON': 'IAH', 'PHILADELPHIA': 'PHL', 'DETROIT': 'DTW', 'MINNEAPOLIS': 'MSP',
  'ORLANDO': 'MCO', 'CHARLOTTE': 'CLT', 'NEWARK': 'EWR', 'FORT LAUDERDALE': 'FLL',
  'CALGARY': 'YYC', 'EDMONTON': 'YEG', 'OTTAWA': 'YOW', 'QUEBEC': 'YQB',
  'MEXICO CITY': 'MEX', 'CANCUN': 'CUN', 'GUADALAJARA': 'GDL', 'MONTERREY': 'MTY',
  'SAO PAULO': 'GRU', 'RIO DE JANEIRO': 'GIG', 'BRASILIA': 'BSB', 'SALVADOR': 'SSA',
  'BUENOS AIRES': 'EZE', 'CORDOBA': 'COR', 'ROSARIO': 'ROS', 'MENDOZA': 'MDZ',
  'SANTIAGO': 'SCL', 'VALPARAISO': 'VAP', 'LIMA': 'LIM', 'AREQUIPA': 'AQP',
  'BOGOTA': 'BOG', 'MEDELLIN': 'MDE', 'CALI': 'CLO', 'CARTAGENA': 'CTG',
  'CARACAS': 'CCS', 'MARACAIBO': 'MAR', 'VALENCIA': 'VLN', 'BARQUISIMETO': 'BRM',

  // Asia
  'TOKYO': 'HND', 'SINGAPORE': 'SIN', 'HONG KONG': 'HKG', 'SEOUL': 'ICN',
  'BANGKOK': 'BKK', 'DUBAI': 'DXB', 'DOHA': 'DOH', 'BEIJING': 'PEK',
  'SHANGHAI': 'PVG', 'TAIPEI': 'TPE', 'MANILA': 'MNL', 'JAKARTA': 'CGK',
  'KUALA LUMPUR': 'KUL', 'HO CHI MINH CITY': 'SGN', 'HANOI': 'HAN', 'PHNOM PENH': 'PNH',
  'VIENTIANE': 'VTE', 'YANGON': 'RGN', 'KATHMANDU': 'KTM', 'DHAKA': 'DAC',
  'COLOMBO': 'CMB', 'MALE': 'MLE', 'MUMBAI': 'BOM', 'DELHI': 'DEL',
  'BANGALORE': 'BLR', 'CHENNAI': 'MAA', 'KOLKATA': 'CCU', 'HYDERABAD': 'HYD',
  'AHMEDABAD': 'AMD', 'PUNE': 'PNQ', 'JAIPUR': 'JAI', 'LUCKNOW': 'LKO',
  'KARACHI': 'KHI', 'LAHORE': 'LHE', 'ISLAMABAD': 'ISB', 'PESHAWAR': 'PEW',
  'KABUL': 'KBL', 'TEHRAN': 'IKA', 'ISFAHAN': 'IFN', 'SHIRAZ': 'SYZ',
  'BAGHDAD': 'BGW', 'BASRA': 'BSR', 'ERBIL': 'EBL', 'DAMASCUS': 'DAM',
  'BEIRUT': 'BEY', 'AMMAN': 'AMM', 'JERUSALEM': 'JRS', 'TEL AVIV': 'TLV',
  'CAIRO': 'CAI', 'ALEXANDRIA': 'ALY', 'LUXOR': 'LXR', 'ASWAN': 'ASW',
  'CASABLANCA': 'CMN', 'RABAT': 'RBA', 'MARRAKECH': 'RAK', 'FEZ': 'FEZ',
  'ALGIERS': 'ALG', 'ORAN': 'ORN', 'TUNIS': 'TUN', 'TRIPOLI': 'TIP',

  // Australia/Oceania
  'SYDNEY': 'SYD', 'MELBOURNE': 'MEL', 'BRISBANE': 'BNE', 'AUCKLAND': 'AKL',
  'PERTH': 'PER', 'ADELAIDE': 'ADL', 'DARWIN': 'DRW', 'HOBART': 'HBA',
  'CAIRNS': 'CNS', 'GOLD COAST': 'OOL', 'WELLINGTON': 'WLG', 'CHRISTCHURCH': 'CHC',
  'PORT MORESBY': 'POM', 'SUVA': 'SUV', 'NOUMEA': 'NOU', 'PAPEETE': 'PPT',
  'HONOLULU': 'HNL', 'ANCHORAGE': 'ANC', 'FAIRBANKS': 'FAI', 'JUNEAU': 'JNU'
};

const getEntityId = (city) => {
  const entityIds = {
    // Avrupa
    'LHR': '27544008', 'CDG': '27539733', 'AMS': '27544915', 'FRA': '27545744',
    'MAD': '27547498', 'BCN': '27548283', 'FCO': '27539793', 'MXP': '27544850',
    'VIE': '27547558', 'ZRH': '27547858', 'BRU': '27538635', 'CPH': '27539267',
    'DUB': '27540823', 'LIS': '27544950', 'ATH': '27538091', 'BER': '27538787',
    'MUC': '27545517', 'PRG': '27546253', 'WAW': '27546533', 'BUD': '27538731',
    'ARN': '27544008', 'OSL': '27544008', 'HEL': '27544008', 'SVO': '27544008',
    'IST': '27544008', 'ESB': '27544008', 'ADB': '27544008', 'OTP': '27544008',
    'SOF': '27544008', 'BEG': '27544008', 'ZAG': '27544008', 'LJU': '27544008',
    'BTS': '27544008', 'VNO': '27544008', 'RIX': '27544008', 'TLL': '27544008',
    'KEF': '27544008', 'LUX': '27544008', 'GVA': '27544008',

    // Amerika
    'JFK': '27537542', 'LAX': '27545022', 'ORD': '27546033', 'MIA': '27545212',
    'SFO': '27547327', 'BOS': '27538638', 'IAD': '27547597', 'SEA': '27547098',
    'LAS': '27544966', 'YYZ': '27547375', 'YVR': '27547431', 'YUL': '27545461',
    'ATL': '27544008', 'DFW': '27544008', 'DEN': '27544008', 'PHX': '27544008',
    'IAH': '27544008', 'PHL': '27544008', 'DTW': '27544008', 'MSP': '27544008',
    'MCO': '27544008', 'CLT': '27544008', 'EWR': '27544008', 'FLL': '27544008',
    'YYC': '27544008', 'YEG': '27544008', 'YOW': '27544008', 'YQB': '27544008',
    'MEX': '27544008', 'CUN': '27544008', 'GDL': '27544008', 'MTY': '27544008',
    'GRU': '27544008', 'GIG': '27544008', 'BSB': '27544008', 'SSA': '27544008',
    'EZE': '27544008', 'COR': '27544008', 'ROS': '27544008', 'MDZ': '27544008',
    'SCL': '27544008', 'VAP': '27544008', 'LIM': '27544008', 'AQP': '27544008',
    'BOG': '27544008', 'MDE': '27544008', 'CLO': '27544008', 'CTG': '27544008',
    'CCS': '27544008', 'MAR': '27544008', 'VLN': '27544008', 'BRM': '27544008',

    // Asya
    'HND': '27542671', 'SIN': '27547029', 'HKG': '27542447', 'ICN': '27543039',
    'BKK': '27538249', 'DXB': '27540825', 'DOH': '27540728', 'PEK': '27546276',
    'PVG': '27546291', 'TPE': '27547168', 'MNL': '27544008', 'CGK': '27544008',
    'KUL': '27544008', 'SGN': '27544008', 'HAN': '27544008', 'PNH': '27544008',
    'VTE': '27544008', 'RGN': '27544008', 'KTM': '27544008', 'DAC': '27544008',
    'CMB': '27544008', 'MLE': '27544008', 'BOM': '27544008', 'DEL': '27544008',
    'BLR': '27544008', 'MAA': '27544008', 'CCU': '27544008', 'HYD': '27544008',
    'AMD': '27544008', 'PNQ': '27544008', 'JAI': '27544008', 'LKO': '27544008',
    'KHI': '27544008', 'LHE': '27544008', 'ISB': '27544008', 'PEW': '27544008',
    'KBL': '27544008', 'IKA': '27544008', 'IFN': '27544008', 'SYZ': '27544008',
    'BGW': '27544008', 'BSR': '27544008', 'EBL': '27544008', 'DAM': '27544008',
    'BEY': '27544008', 'AMM': '27544008', 'JRS': '27544008', 'TLV': '27544008',
    'CAI': '27544008', 'ALY': '27544008', 'LXR': '27544008', 'ASW': '27544008',
    'CMN': '27544008', 'RBA': '27544008', 'RAK': '27544008', 'FEZ': '27544008',
    'ALG': '27544008', 'ORN': '27544008', 'TUN': '27544008', 'TIP': '27544008',

    // Avustralya/Okyanusya
    'SYD': '27547037', 'MEL': '27545227', 'BNE': '27538621', 'AKL': '27538075',
    'PER': '27544008', 'ADL': '27544008', 'DRW': '27544008', 'HBA': '27544008',
    'CNS': '27544008', 'OOL': '27544008', 'WLG': '27544008', 'CHC': '27544008',
    'POM': '27544008', 'SUV': '27544008', 'NOU': '27544008', 'PPT': '27544008',
    'HNL': '27544008', 'ANC': '27544008', 'FAI': '27544008', 'JNU': '27544008'
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

        // Market kodunu belirle (şehir bazlı)
        const getMarketCode = (city) => {
          const europeCities = ['LHR', 'CDG', 'AMS', 'FRA', 'MAD', 'BCN', 'FCO', 'MXP', 'VIE', 'ZRH', 'BRU', 'CPH', 'DUB', 'LIS', 'ATH', 'BER', 'MUC', 'PRG', 'WAW', 'BUD', 'ARN', 'OSL', 'HEL', 'SVO'];
          const usCities = ['JFK', 'LAX', 'ORD', 'MIA', 'SFO', 'BOS', 'IAD', 'SEA', 'LAS', 'ATL', 'DFW', 'DEN', 'PHX', 'IAH', 'PHL', 'DTW', 'MSP', 'MCO', 'CLT', 'EWR', 'FLL', 'HNL'];
          const asiaCities = ['HND', 'SIN', 'HKG', 'ICN', 'BKK', 'DXB', 'DOH', 'PEK', 'PVG', 'TPE', 'MNL', 'CGK', 'KUL', 'SGN', 'HAN', 'BOM', 'DEL', 'BLR', 'MAA', 'KHI', 'LHE', 'IKA'];
          const turkeyCities = ['IST', 'ESB', 'ADB'];
          
          // Tüm şehirler için aynı market kodu kullan (test için)
          return { market: 'en-US', countryCode: 'US', currency: 'USD' };
          
          // Eski kod (yorum satırına aldım)
          // if (turkeyCities.includes(city)) return { market: 'en-GB', countryCode: 'GB', currency: 'EUR' };
          // if (europeCities.includes(city)) return { market: 'en-GB', countryCode: 'GB', currency: 'EUR' };
          // if (usCities.includes(city)) return { market: 'en-US', countryCode: 'US', currency: 'USD' };
          // if (asiaCities.includes(city)) return { market: 'en-GB', countryCode: 'GB', currency: 'USD' };
          // return { market: 'en-GB', countryCode: 'GB', currency: 'EUR' };
        };

        const marketConfig = getMarketCode(fromCity);
        
        // Debug için URL'i logla
        const apiUrl = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights?originSkyId=${fromCity}&destinationSkyId=${toCity}&originEntityId=${originEntityId}&destinationEntityId=${destinationEntityId}&date=${date}&cabinClass=economy&adults=1&sortBy=best&currency=${marketConfig.currency}&market=${marketConfig.market}&countryCode=${marketConfig.countryCode}&includedCarriersIds=&excludedCarriersIds=&includedAgentsIds=&excludedAgentsIds=&includeSustainabilityData=false&includeVirtualInterlining=false`;
        console.log('🔍 API URL:', apiUrl);
        console.log('📍 From City:', fromCity, 'To City:', toCity);
        console.log('🆔 Entity IDs:', originEntityId, destinationEntityId);
        console.log('🌍 Market Config:', marketConfig);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_HOST,
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("API call failed");
        }

        const data = await response.json();
        console.log('📊 API Response:', data);
        console.log('📋 Response Status:', data?.data?.context?.status);
        console.log('📋 Itineraries Count:', data?.data?.itineraries?.length || 0);
        console.log('📋 Full Response Structure:', JSON.stringify(data, null, 2));
        
        // Test için farklı tarih ve rota önerisi
        if (data?.data?.context?.totalResults === 0) {
          console.log('⚠️  No flights found. Suggestions:');
          console.log('   - Try a closer date (next 1-3 months)');
          console.log('   - Try popular routes like: LHR-JFK, CDG-AMS, IST-LHR');
          console.log('   - Check if this route exists in real life');
        }
        
        // API failure kontrolü
        if (data?.data?.context?.status === 'failure') {
          console.log('API returned failure status');
          setFlights([]);
          setError(null);
          setLoading(false);
          return;
        }
        
        if (data?.data?.itineraries) {
          const formattedFlights = data.data.itineraries.map(itinerary => {
            const leg = itinerary.legs[0];
            return {
              id: itinerary.id,
              price: {
                amount: itinerary.price.amount || itinerary.price.formatted.replace('€', '').replace('$', ''),
                currency: marketConfig.currency
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



export default useFetchFlights;
