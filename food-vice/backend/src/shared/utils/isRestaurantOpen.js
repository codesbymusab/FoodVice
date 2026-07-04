exports.isRestaurantOpen = (openingHours) => {
  const now = new Date();
  const currentDay = now.toLocaleString("en-US", { weekday: "long" }); // e.g. "Saturday"
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find today's hours
  const todayHours = openingHours.find(h => h.day === currentDay);
  if (!todayHours) return false;

  // Parse "3 PM to 2:30 AM"
  const [openStr, closeStr] = todayHours.hours.split(" to ");

  function parseTime(str) {
    const date = new Date(`1970-01-01 ${str}`);
    return date.getHours() * 60 + date.getMinutes();
  }

  const openMinutes = parseTime(openStr);
  let closeMinutes = parseTime(closeStr);

  // If closing time is after midnight (e.g. 2:30 AM), adjust by +24h
  if (closeMinutes <= openMinutes) {
    closeMinutes += 24 * 60;
    // If current time is after midnight, also adjust currentMinutes
    if (currentMinutes < openMinutes) {
      return (currentMinutes + 24 * 60) <= closeMinutes;
    }
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

