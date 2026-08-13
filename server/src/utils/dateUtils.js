export const getCurrentSemester = () => {
  const month = new Date().getMonth() + 1;
  // Assuming academic year: July-June
  // Semester 1 & 2: July-December and January-June
  if (month >= 7) {
    return 1;
  }
  return 2;
};

export const getCurrentAcademicYear = () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 7) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
};

export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const getDayOfWeek = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(date).getDay()];
};

export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
};

export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
